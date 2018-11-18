<?php
  class BudgetList{
    private $db;
    private $budget_list = [];
    //construct the model:
    public function __construct($database, $user_id){
      $this->db = $database;
      $this->loadUserBudgetList($user_id);
    }
    //load user's budget:
    private function loadUserBudgetList($user_id){
      $this->budget_list = [];
      $this->db->dbConnect();
      $db_budgets = $this->db->runQuery("SELECT * FROM `budget` WHERE user_id=$user_id ORDER BY budget_to DESC");
      while ($row = $db_budgets->fetch_array(MYSQLI_ASSOC)) {
        $count_params = array('table' => 'goal', 'column' => 'id', 'where' => "budget_id=".$row['id']." AND user_id=$user_id");
        $goals_numb = $this->db->countColumn($count_params);
        $budget = array('id' => $row['id'],
          'amount' => $row['amount'],
          'budget_from' => $row['budget_from'],
          'budget_to' => $row['budget_to'],
          'goals'=>$goals_numb
        );
      array_push($this->budget_list, $budget);
      }
      $this->db->dbDisconnect();
    }
    //function to save budget:
		private function saveBudget($args){
      $connection = $args['connection'];
			$stmt = $connection->prepare("INSERT INTO budget (user_id, amount, budget_from, budget_to) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("idss", $args['user_id'], $args['amount'], $args['budget_from'], $args['budget_to']);
			$save_results = array();
			if($stmt->execute()){
				$id = $stmt->insert_id;
				$save_results = array(true, $id);
			} else {
				$save_results = array(false, 'no_id');
			}
			return $save_results;
		}
		//function to save budget to 'log_budget' table:
		private function saveBudgetLog($args){
      $connection = $args['connection'];
    	$stmt = $connection->prepare("INSERT INTO log_budget (user_id, budget_id, amount, budget_from, budget_to, log_type) VALUES (?, ?, ?, ?, ?, ?)");
			$stmt->bind_param("iidsss", $args['user_id'], $args['budget_id'], $args['amount'], $args['budget_from'], $args['budget_to'], $args['log_type']);
			$save_results = array();
			if($stmt->execute()){
				return true;
			} else {
				return false;
			}
		}
    //function to update budget perion in db:
    private function updatePeriodInDB($args){
      $connection = $args['connection'];
      $sql = "UPDATE `budget` SET budget_from=?,budget_to=?  WHERE id='".$args['budget_id']."' AND user_id='".$args['user_id']."'";
      $stmt = $connection->prepare($sql);
      $stmt->bind_param('ss', $args['budget_from'], $args['budget_to']);
      if($stmt->execute()){
        return true;
      } else {
        return false;
      }
    }
    //get id of current budget
    public function getCurrentBudgetId (){
      return $this->budget_list[0]['id'];
    }
    //check if current budget exists
    public function checkCurrentBudgetExistence($id){
      $this->db->dbConnect();
      $get_params = array('table' => 'budget', 'column' => 'budget_to', 'where' => "user_id=$id ORDER BY budget_to DESC LIMIT 1");
      $db_until_date = $this->db->getCell($get_params);
      $this->db->dbDisconnect();
      $today_time = strtotime(date('Y-m-d'));
      $budget_end_time = strtotime($db_until_date);
      $current_budget = "no";
      if($today_time>$budget_end_time){
        $current_budget = "no";
      }else{
        $current_budget = "yes";
      }
      return $current_budget;
    }
    //get user budget list:
    public function getBudgetList($id){
      $this->loadUserBudgetList($id);
      return $this->budget_list;
    }
    //add user's weekly budget
    public function addBudget($args){
      $message = "";
      $added_id = "";
      $connection = $this->db->dbConnect();
      $save_params = $args;
      $save_params['connection'] = $connection;
      $budgets = $this->db->runQuery("SELECT * FROM `budget` WHERE user_id='".$args['user_id']."' AND budget_to>='".$args['budget_from']."'");
      $rowcount=mysqli_num_rows($budgets);
      if ($rowcount===0) {
        $saved = $this->saveBudget($save_params);
        if($saved[0]===true){
          $log_params = $save_params;
          $log_params['budget_id'] = $saved[1];
          $log_params['log_type'] = 'inserted';
          $this->saveBudgetLog($log_params);
          $added_id = $saved[1];
          $message = "success";
        }else{
          $message = "db_error";
        }
      }else{
        $message = "overlapping_budget";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'added_id' => $added_id, 'target' => "budget");
      return $results;
    }
    //update budget amount
    public function updateAmount($args){
      $message = "";
      $connection = $this->db->dbConnect();
      $dbtotalgoals = $this->db->runQuery("SELECT SUM(`amount`) AS `goals_total` FROM `goal` WHERE `budget_id`='".$args['budget_id']."'");
      $dbtotalgoals = $dbtotalgoals->fetch_array(MYSQLI_ASSOC);
      $totalgoals=0;
      if ($dbtotalgoals['goals_total']=== NULL) {
        $totalgoals=0;
      }else{
        $totalgoals = $dbtotalgoals['goals_total'];
      }
      if ($totalgoals<=$args['amount']) {
        $update_params = array('table' =>'budget', 'column' =>'amount', 'value' =>$args['amount'], 'where' =>"id='".$args['budget_id']."' AND user_id='".$args['user_id']."'");
        $updated = $this->db->updateFloatColumn($update_params);
        if($updated===true){
          $log_params = $args;
          $log_params['connection'] = $connection;
          $log_params['log_type'] = 'updated';
          $this->saveBudgetLog($log_params);
          $message = "success";
        }else{
          $message = "db_error";
        }
      }else{
        $message = "goals_more";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "budget");
      return $results;
    }
    //update budget period
    public function updatePeriod($args){
      $message = "";
      $connection = $this->db->dbConnect();
      $update_params = $args;
      $update_params['connection'] = $connection;
      $updated = $this->updatePeriodInDB($update_params);
      if($updated===true){
        $log_params = $update_params;
        $log_params['log_type'] = 'updated';
        $this->saveBudgetLog($log_params);
        $message = "success";
      }else{
        $message = "db_error";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "budget");
      return $results;
    }
  }
?>
