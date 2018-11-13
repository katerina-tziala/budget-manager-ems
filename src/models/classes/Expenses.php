<?php
  class Expenses{
    private $db;
    private $expenseList = [];
    //construct the Expenses model:
    public function __construct($database){
      $this->db = $database;
    }
    /*
    * USER'S EXPENSES
    */
    //load all expenses:
    private function loadUserExpenses($id){
      $this->expenseList = [];
      $this->db->dbConnect();
      $db_expenses = $this->db->runQuery("SELECT * FROM `expense` WHERE user_id=$id ORDER BY created_at DESC");
      while ($row = $db_expenses->fetch_array(MYSQLI_ASSOC)) {
        $expense = array('id' => $row['id'],
        'amount' => $row['amount'],
        'category' => utf8_encode($row['category']),
        'payment' => $row['payment'],
        'expense_date' => $row['expense_date'],
        'expense_time' => $row['expense_time'],
        'location' => $row['location'],
        'store' => $row['store'],
        'comments' => $row['comments']
      );
        array_push($this->expenseList, $expense);
      }
      $this->db->dbDisconnect();
    }
    //get user's expenses (all):
    public function getExpenses($id){
      $this->loadUserExpenses($id);
      return $this->expenseList;
    }
    //function to save expense:
		private function saveExpense($args){
      $connection = $args['connection'];
			$stmt = $connection->prepare("INSERT INTO expense (user_id, amount, category, payment, expense_date, expense_time, location, store, comments)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
			$stmt->bind_param("idsssssss", $args['user_id'], $args['amount'], $args['category'], $args['payment'],  $args['date'], $args['time'], $args['location'], $args['store'], $args['comments']);
			$save_results = array();
			if($stmt->execute()){
				$id = $stmt->insert_id;
				$save_results = array(true, $id);
			} else {
				$save_results = array(false, 'no_id');
			}
			return $save_results;
		}
		//function to save expense to 'log_expense' table:
		private function saveExpenseLog($args){
      $connection = $args['connection'];
    	$stmt = $connection->prepare("INSERT INTO log_expense	(user_id, expense_id, amount, category, payment, expense_date, expense_time, location, store, comments, log_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			$stmt->bind_param("iidssssssss", $args['user_id'], $args['expense_id'], $args['amount'], $args['category'], $args['payment'], $args['date'], $args['time'], $args['location'], $args['store'], $args['comments'], $args['log_type']);
			$save_results = array();
			if($stmt->execute()){
				$id = $stmt->insert_id;
				$save_results = array(true, $id);
			} else {
				$save_results = array(false, 'no_id');
			}
			return $save_results;
		}
    //function to update expense:
		private function updateExpense($args){
      $connection = $args['connection'];
      $stmt = $connection->prepare("UPDATE expense SET amount=?, category=?, payment=?, expense_date=?, expense_time=?, location=?, store=?, comments=? WHERE id=".$args['expense_id']." AND user_id=".$args['user_id']."");
			$stmt->bind_param("dsssssss", $args['amount'], $args['category'], $args['payment'],  $args['date'], $args['time'], $args['location'], $args['store'], $args['comments']);
			if($stmt->execute()){
				return true;
			} else {
				return false;
			}
		}
    //add expense
    public function addExpense($args){
      $message = "";
       $connection = $this->db->dbConnect();
       $categories = $this->db->runQuery("SELECT * FROM `category` WHERE category_name='".$args['category']."' AND (added_by='".$args['user_id']."' OR added_by IS NULL)");
       $rowcount=mysqli_num_rows($categories);
       if ($rowcount>0) {
         $save_params = $args;
         $save_params['connection'] = $connection;
         $saved = $this->saveExpense($save_params);
         if($saved[0]===true){
           $save_log_params = $save_params;
           $save_log_params['expense_id'] = $saved[1];
           $save_log_params['log_type'] = 'inserted';
           $this->saveExpenseLog($save_log_params);
           $message = "success";
         }else{
           $message = "db_error";
         }
       }else{
        $message = "category_not_found";
       }
       $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "expense");
      return $results;
    }
    //delete expense
    public function deleteExpense($args){
      $message = "";
      $connection = $this->db->dbConnect();
      $deleted = $this->db->deleteFromDB("DELETE FROM `expense` WHERE id='".$args['expense_id']."' AND user_id='".$args['user_id']."'");
      if($deleted===true){
        $save_log_params = $args;
        $save_log_params['connection'] = $connection;
        $save_log_params['log_type'] = 'deleted';
        $this->saveExpenseLog($save_log_params);
        $message = "success";
      } else {
        $message = "db_error";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "expense");
      return $results;
    }
    //edit - update expense
    public function editExpense($args){
      $message = "";
      $connection = $this->db->dbConnect();
      $update_params = $args;
      $update_params['connection'] = $connection;
      $updated = $this->updateExpense($update_params);
      if($updated===true){
        $save_log_params = $update_params;
        $save_log_params['log_type'] = 'updated';
        $this->saveExpenseLog($save_log_params);
        $message = "success";
      } else {
        $message = "db_error";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "expense");
      return $results;
    }
  }
?>
