<?php
  class GoalList{
    private $db;
    private $goal_list = [];
    //construct the model:
    public function __construct($database){
      $this->db = $database;
    }
    //load user's goals:
    private function loadUserGoalList($user_id){
      $this->goal_list = [];
      $this->db->dbConnect();
      $db_goals = $this->db->runQuery("SELECT * FROM `goal` WHERE user_id=$user_id ORDER BY created DESC");
      while ($row = $db_goals->fetch_array(MYSQLI_ASSOC)) {
        $goal = array('id' => $row['id'],
          'budget_id' => $row['budget_id'],
          'amount' => $row['amount'],
          'category' => utf8_encode($row['category']),
          'created' => $row['created']
        );
        array_push($this->goal_list, $goal);
      }
      $this->db->dbDisconnect();
    }
    //function to save goal:
		private function saveGoal($args){
      $connection = $args['connection'];
			$stmt = $connection->prepare("INSERT INTO goal (budget_id, user_id, amount, category) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("iids", $args['budget_id'], $args['user_id'], $args['amount'], $args['category']);
			$save_results = array();
			if($stmt->execute()){
				$id = $stmt->insert_id;
				$save_results = array(true, $id);
			} else {
				$save_results = array(false, 'no_id');
			}
			return $save_results;
		}
		//function to save goal to 'log_goal' table:
		private function saveGoalLog($args){
      $connection = $args['connection'];
    	$stmt = $connection->prepare("INSERT INTO log_goal (goal_id, budget_id, user_id, amount, category, log_type) VALUES (?, ?, ?, ?, ?, ?)");
			$stmt->bind_param("iiidss", $args['goal_id'], $args['budget_id'], $args['user_id'], $args['amount'], $args['category'], $args['log_type']);
			$save_results = array();
			if($stmt->execute()){
				return true;
			} else {
				return false;
			}
		}
    //get user goals list:
    public function getGoalsList($id){
      $this->loadUserGoalList($id);
      return $this->goal_list;
    }
    //add user's weekly budget goal
    public function addGoal($args){
      $message = "";
      $newId = "";
      $connection = $this->db->dbConnect();
      $dbtotalgoals = $this->db->runQuery("SELECT SUM(`amount`) AS `goals_total`
      FROM `goal` WHERE `budget_id`='".$args['budget_id']."'");
      $dbtotalgoals = $dbtotalgoals->fetch_array(MYSQLI_ASSOC);
      $totalgoals=0;
      if ($dbtotalgoals['goals_total']=== NULL) {
        $totalgoals=0;
      }else{
        $totalgoals = $dbtotalgoals['goals_total'];
      }
      $new_total_goals = $totalgoals+$args['amount'];
      $budgetamount = $this->db->runQuery("SELECT amount FROM `budget` WHERE `id`='".$args['budget_id']."'");
      $budgetamount = $budgetamount->fetch_array(MYSQLI_ASSOC);
      $budgetamount = $budgetamount['amount'];
      if ($new_total_goals<=$budgetamount) {
        $categories = $this->db->runQuery("SELECT * FROM `category`
          WHERE category_name='".$args['category']."'
          AND (added_by='".$args['user_id']."' OR added_by IS NULL)");
        $rowcount=mysqli_num_rows($categories);
        if ($rowcount>0) {
          $count_params = array('table' => 'goal',
          'column' => 'category',
          'where' => "`category`='".$args['category']."' AND `budget_id`='".$args['budget_id']."'");
          $goalincategory = $this->db->countColumn($count_params);
          if ($goalincategory===0) {
            $save_params = $args;
            $save_params['connection'] = $connection;
            $saved = $this->saveGoal($save_params);
            if($saved[0]===true){
              $log_params = $save_params;
              $log_params['goal_id'] = $saved[1];
              $log_params['goal_type'] = 'inserted';
              $this->saveGoalLog($log_params);
              $message = "success";
              $newId = $saved[1];
            }else{
              $message = "db_error";
            }
          }else{
            $message = "goal_exists";
          }
        }else{
          $message = "category_not_found";
        }
      }else{
        $message = "budget_less";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'added_id' =>$newId, 'target' => "goal");
      return $results;
    }
    //delete user's weekly budget goal
    public function deleteGoal($args){
      $message = "";
      $message = "";
      $connection = $this->db->dbConnect();
      $deleted = $this->db->deleteFromDB("DELETE FROM `goal` WHERE id='".$args['goal_id']."'
        AND budget_id='".$args['budget_id']."' AND user_id='".$args['user_id']."'");
      if($deleted===true){
        $log_params = $args;
        $log_params['connection'] = $connection;
        $log_params['goal_type'] = 'deleted';
        $this->saveGoalLog($log_params);
        $message = "success";
      } else {
        $message = "db_error";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "goal");
      return $results;
    }
    //update user's weekly budget goal
    public function updateGoal($args){
      $message = "";
      $connection = $this->db->dbConnect();
      $dbtotalgoals = $this->db->runQuery("SELECT SUM(`amount`) AS `goals_total` FROM `goal`
      WHERE `budget_id`='".$args['budget_id']."' AND id!='".$args['goal_id']."'");
      $dbtotalgoals = $dbtotalgoals->fetch_array(MYSQLI_ASSOC);
      $totalgoals=0;
      if ($dbtotalgoals['goals_total']=== NULL) {
        $totalgoals=0;
      }else{
        $totalgoals = $dbtotalgoals['goals_total'];
      }
      $new_total_goals = $totalgoals+$args['amount'];
      $budgetamount = $this->db->runQuery("SELECT amount FROM `budget` WHERE `id`='".$args['budget_id']."'");
      $budgetamount = $budgetamount->fetch_array(MYSQLI_ASSOC);
      $budgetamount = $budgetamount['amount'];
      if ($new_total_goals<=$budgetamount) {
        $update_params = array('table' =>'goal',
        'column' =>'amount',
        'value' =>$args['amount'],
        'where' =>"id='".$args['goal_id']."' AND budget_id='".$args['budget_id']."' AND user_id='".$args['user_id']."'");
        $saved = $this->db->updateFloatColumn($update_params);
        if($saved===true){
          $log_params = $args;
          $log_params['connection'] = $connection;
          $log_params['goal_type'] = 'updated';
          $this->saveGoalLog($log_params);
          $message = "success";
        }else{
          $message = "db_error";
        }
      }else{
        $message = "budget_less";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "goal");
      return $results;
    }
  }
?>
