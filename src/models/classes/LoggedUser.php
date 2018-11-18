<?php
  require_once("User.php");
  require_once('CategoyList.php');
  require_once('BudgetList.php');
  require_once('GoalList.php');
  require_once('ExpenseList.php');
    class LoggedUser extends User{
    private $db;
    private $id;
    private $username;
    private $email;
    private $gender;
    private $birthdate;
    private $feedback;
    private $signed_in;
    private $registration_date;
    private $personal_info;
    private $userCategories;
    private $userBudget;
    private $userGoals;
    private $userExpenses;
    //constructor
    public function __construct($logged_username){
      $this->username = $logged_username;
      $this->db = new Database();
      $this->loadUserInfo($logged_username);
      $this->userBudget = new BudgetList($this->db, $this->id);
      $this->userCategories = new CategoyList($this->db);
      $this->userGoals = new GoalList($this->db);
      $this->userExpenses = new ExpenseList($this->db);
    }
    //destructor
    public function __destruct() {}
    //save sign out
    public function saveSignOut($connection){
      $logout_time = date('Y-m-d H:i:s');
      $save_activity_params = array('connection' => $connection,'user_id' => $this->id,'time' => $logout_time,'activity_type' => 'sign_out');
      $saved_activity = $this->saveActivity($save_activity_params);
      $update_params = array('table' => 'user','column' => 'signed_in','value' => 0,'where' =>"id=$this->id");
      $update_status = $this->db->updateIntColumn($update_params);
      if($saved_activity===true && $update_status===true){
        return true;
      }else{
        return false;
      }
    }
    //destroy user's session and cookie
    public function destroyUserSessionAndCookie(){
      if(isset($_SESSION['bm_ems_user']) && $_SESSION['bm_ems_user']===$this->username) {
        if(isset($_COOKIE['bm_ems_user']) && $_COOKIE['bm_ems_user']===$this->username){
          unset($_COOKIE['bm_ems_user']);
          setcookie("bm_ems_user", "", time() - (7200), "/");
        }
        session_destroy();
        return true;
      }else{
        return false;
      }
    }
    //sign out
    public function signOut($connection){
      $signout_saved = $this->saveSignOut($connection);
      if($signout_saved==true){
        return $this->destroyUserSessionAndCookie();
      }else{
        return false;
      }
    }
    //sign user out
    public function signUserOut(){
      $message="";
      $signoutid = $this->id;
      $connection = $this->db->dbConnect();
      $signed_out = $this->signOut($connection);
      if($signed_out===true){
        $message="signout";
        $this->__destruct();
      }else{
        $message="signout_error";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'signoutid' => $signoutid);
      return $results;
    }
    //function to load user information:
    public function loadUserInfo($name){
      $this->db->dbConnect();
      $user_results = $this->db->runQuery("SELECT * FROM `user` WHERE username='".$name."'");
      $db_user = $user_results->fetch_array(MYSQLI_ASSOC);
      $this->id = $db_user['id'];
      $this->email = $db_user['email'];
      $this->gender = $db_user['gender'];
      $this->birthdate = $db_user['birthdate'];
      $this->feedback = $db_user['feedback'];
      $this->registration_date = $db_user['registered_at'];
      $this->signed_in = $db_user['signed_in'];
      $this->db->dbDisconnect();
    }
    //get personal info
    public function getPersonalInfo(){
      $budget_check = $this->userBudget->checkCurrentBudgetExistence($this->id);
      $personal_info = array('id' => $this->id,
                              'username' => $this->username,
                              'email' => $this->email,
                              'gender' => $this->gender,
                              'birthdate' => $this->birthdate,
                              'feedback' => $this->feedback,
                              'signed_in' => $this->signed_in,
                              'registration_date' => $this->registration_date,
                              'has_current_budget'=> $budget_check
                          );
      return $personal_info;
    }
    /*
    * MANAGE FEEDBACK
    */
    //get feedback list
    public function getFeedbackList(){
      $feedbackList = [];
      $this->db->dbConnect();
      $db_feedbackList = $this->db->runQuery("SELECT * FROM `feedback` WHERE user_id=$this->id ORDER BY served_at");
      while ($row = $db_feedbackList->fetch_array(MYSQLI_ASSOC)) {
        $feedback_item = array('id' => $row['id'], 'budget_id' => $row['budget_id'], 'type' => $row['type'], 'user_performance' => $row['user_performance'], 'served_at' => $row['served_at']);
        array_push($feedbackList, $feedback_item);
      }
      $this->db->dbDisconnect();
      return $feedbackList;
    }
    //function to save served feedback
    private function saveFeedback($args){
      $connection = $args['connection'];
      $stmt = $connection->prepare("INSERT INTO feedback (user_id, budget_id, type, user_performance) VALUES (?, ?, ?, ?)");
      $stmt->bind_param("iiss", $args['user_id'], $args['budget_id'], $args['type'], $args['user_performance']);
      $save_results = array();
      if($stmt->execute()){
        $id = $stmt->insert_id;
        $save_results = array(true, $id);
      } else {
        $save_results = array(false, 'no_id');
      }
      return $save_results;
    }
    //save feedback displayed to user
    public function saveFeedbackDisplay($data){
      $message = "";
      $saved_id = "";
      $budget_id = $this->prepareDataId($data['budget_id']);
      $type = $this->prepareDataString($data['type']);
      $user_performance = $this->prepareDataString($data['user_performance']);
      $connection = $this->db->dbConnect();
      $count_params = array('table' => 'feedback', 'column' => 'id', 'where' => "user_id='".$this->id."' AND budget_id='".$budget_id."'");
      $feedbacknumb = $this->db->countColumn($count_params);
      if ($feedbacknumb===0) {
        $params = array('connection' => $connection, 'user_id' => $this->id, 'budget_id' => $budget_id, 'type' => $type, 'user_performance' => $user_performance);
        $saved =  $this->saveFeedback($params);
        if ($saved[0]===true) {
          $message = "success";
          $saved_id = $saved[1];
        }else{
          $message = "db_error";
        }
      }else{
        $message = "db_error";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'added_id' => $saved_id, 'target' => "feedback");
      return $results;
    }
    /*
    * UPDATE USER PERSONAL INFO
    */
    //function to save user's changes of personal info:
    private function saveUserInfoLog($args){
      $connection = $args['connection'];
      $stmt = $connection->prepare("INSERT INTO log_user (user_id, updated_field, prev_value, new_value) VALUES (?, ?, ?, ?)");
      $stmt->bind_param("isss", $args['user_id'], $args['updated_field'], $args['prev_val'], $args['new_val']);
      if($stmt->execute()){
        return true;
      } else {
        return false;
      }
    }
    //function to update user's email:
    private function updateDatabaseEmail($args){
      $connection = $args['connection'];
      $sql = "UPDATE user SET email=?, activationcode=?, verified=?  WHERE id=".$this->id."";
      $stmt = $connection->prepare($sql);
      $stmt->bind_param('ssi', $args['new_email'], $args['activationcode'], $args['verified']);
      if($stmt->execute()){
        return true;
      } else {
        return false;
      }
    }
    //update gender or birthdate
    public function updateGenderBirthday($data){
      $field_value = $this->prepareDataString($data['field_value']);
      $update_field = $this->prepareDataString($data['update_field']);
      $message = "";
      if($this->{$update_field}===$field_value){
        $message = "current";
      }else{
        $connection = $this->db->dbConnect();
        $update_params = array('table' =>'user', 'column' =>$update_field, 'value' =>$field_value, 'where' =>"id=$this->id");
        $saved = $this->db->updateStringColumn($update_params);
        if($saved===true){
          $log_params = array('connection' =>$connection, 'user_id' =>$this->id, 'updated_field' =>$update_field, 'prev_val' =>$this->{$update_field}, 'new_val'=>$field_value);
          $this->saveUserInfoLog($log_params);
          $message = "success";
        }else{
          $message = "db_error";
        }
        $this->db->dbDisconnect();
      }
      $results = array('message' => $message, 'target' => "personal_info");
      return $results;
    }
    //update username
    public function updateUsername($data){
      $new_username = $this->prepareDataString($data['username']);
      $message = "";
      if($this->username===$new_username){
        $message = "this_username";
      }else{
        $connection = $this->db->dbConnect();
        $count_params = array('table' => 'user', 'column' => 'username', 'where' => "username='".$new_username."'");
        $db_usernames = $this->db->countColumn($count_params);
        if($db_usernames>0){
          $message = "username_exists";
        }else{
          $update_params = array('table' =>'user', 'column' =>'username', 'value' =>$new_username, 'where' =>"id=$this->id");
          $saved = $this->db->updateStringColumn($update_params);
          if($saved===true){
            $log_params = array('connection' =>$connection, 'user_id' =>$this->id, 'updated_field' =>'username', 'prev_val' =>$this->username, 'new_val'=>$new_username);
            $this->saveUserInfoLog($log_params);
            $signed_out = $this->signOut($connection);
            if($signed_out===true){
              $message="success";
              $this->__destruct();
            }else{
              $message="signout_error";
            }
          }else{
            $message = "db_error";
          }
        }
        $this->db->dbDisconnect();
      }
      $results = array('message' => $message, 'target' => "personal_info");
      return $results;
    }
    //update password
    public function updatePassword($data){
      $password = $this->prepareDataString($data['password']);
      $new_password = $this->prepareDataString($data['new_password']);
      $message = "";
      $connection = $this->db->dbConnect();
      $row_args = array('select' => 'password','table' => 'user','where' => "id=$this->id");
      $db_user = $this->db->getRow($row_args);
      if(password_verify($password, $db_user['password'])){
        if(password_verify($new_password, $db_user['password'])){
          $message = "current_password";
        } else{
          $new_pass = password_hash($new_password, PASSWORD_DEFAULT);
          $update_params = array('table' =>'user', 'column' =>'password', 'value' =>$new_pass, 'where' =>"id=$this->id");
          $saved = $this->db->updateStringColumn($update_params);
          if($saved===true){
            $log_params = array('connection' =>$connection, 'user_id' =>$this->id, 'updated_field' =>'password', 'prev_val' =>$db_user['password'], 'new_val'=>$new_pass);
            $this->saveUserInfoLog($log_params);
            $signed_out = $this->signOut($connection);
            if($signed_out===true){
              $message="success";
              $this->__destruct();
            }else{
              $message="signout_error";
            }
          }else{
            $message = "db_error";
          }
        }
      }else{
        $message = "wrong_password";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "personal_info");
      return $results;
    }
    //update email
    public function updateEmail($data){
      $new_email =  $this->prepareDataString($data['email']);
      $apphost = $this->prepareDataString($data['apphost']);
      $message = "";
      if($this->email===$new_email){
        $message = "current_email";
      }else{
        $connection = $this->db->dbConnect();
        $count_params = array('table' => 'user', 'column' => 'email', 'where' => "email='".$new_email."'");
        $db_emails = $this->db->countColumn($count_params);
        if($db_emails>0){
          $message = "email_exists";
        }else{
          $activationcode = password_hash(uniqid(rand()), PASSWORD_DEFAULT);
          $update_params = array('connection' =>$connection,'new_email' =>$new_email,'activationcode' =>$activationcode,'verified' =>0);
          $saved = $this->updateDatabaseEmail($update_params);
          if($saved===true){
            $log_params = array('connection'=>$connection, 'user_id' =>$this->id, 'updated_field' =>'email', 'prev_val' =>$this->email, 'new_val'=>$new_email);
            $this->saveUserInfoLog($log_params);
            $subject = "Account Activation";
            $linkpart = "?id=".$this->id."&username=".$this->username."&code=".$activationcode;
            $mail_params = array('type' => "re_activation",'app_host'=>$apphost, 'linkpart' => $linkpart,'sendinguser' => $this->username);
            $mailtosend = $this->getAppMail($mail_params);
            $sendmail = $this->sendEmail($this->app_mail, "Budget Manager", $new_email, $subject, $mailtosend);
            if($sendmail===true){
              $signed_out = $this->signOut($connection);
              if($signed_out===true){
                $message="success";
                $this->__destruct();
              }else{
                $message="signout_error";
              }
            } else {
              $message = "saved_no_ver_email";
            }
          }else{
            $message = "db_error";
          }
        }
        $this->db->dbDisconnect();
      }
      $results = array('message' => $message, 'target' => "personal_info");
      return $results;
    }
    /*
    * MANAGE EXPENSES
    */
    //function to get full expense list:
    public function getUserExpenseList(){
      return $this->userExpenses->getExpenses($this->id);
    }
    //function to add user's expense:
    public function addUserExpense($data){
      $amount = $this->prepareDataFloat($data['amount']);
      $category = $this->prepareDataCategory($data['category']);
      $payment = strtolower($this->prepareDataString($data['payment']));
      $exp_date = $this->prepareDataDate($data['date']);
      $exp_time = $this->prepareDataString($data['time']);
      $location = strtolower($this->prepareDataString($data['location']));
      $store = strtolower($this->prepareDataString($data['store']));
      $comments = $this->prepareDataString($data['comments']);
      $params = array('user_id' => $this->id,'amount' => $amount, 'category' => $category, 'payment' => $payment, 'date' => $exp_date, 'time' => $exp_time, 'location' => $location, 'store' => $store, 'comments' => $comments);
      return $this->userExpenses->addExpense($params);
    }
    //function to delete user's expense:
    public function deleteUserExpense($data){
      $exp_id = $this->prepareDataId($data['id']);
      $amount = $this->prepareDataFloat($data['amount']);
      $category = $this->prepareDataCategory($data['category']);
      $payment = strtolower($this->prepareDataString($data['payment']));
      $exp_date = $this->prepareDataDate($data['date']);
      $exp_time = $this->prepareDataString($data['time']);
      $location = strtolower($this->prepareDataString($data['location']));
      $store = strtolower($this->prepareDataString($data['store']));
      $comments = $this->prepareDataString($data['comments']);
      $params = array('user_id' => $this->id,'expense_id' => $exp_id,'amount' => $amount, 'category' => $category, 'payment' => $payment, 'date' => $exp_date, 'time' => $exp_time, 'location' => $location, 'store' => $store, 'comments' => $comments);
      return $this->userExpenses->deleteExpense($params);
    }
    //function to delete user's expense:
    public function updateUserExpense($data){
      $exp_id = $this->prepareDataId($data['id']);
      $amount = $this->prepareDataFloat($data['amount']);
      $category = $this->prepareDataCategory($data['category']);
      $payment = strtolower($this->prepareDataString($data['payment']));
      $exp_date = $this->prepareDataDate($data['date']);
      $exp_time = $this->prepareDataString($data['time']);
      $location = strtolower($this->prepareDataString($data['location']));
      $store = strtolower($this->prepareDataString($data['store']));
      $comments = $this->prepareDataString($data['comments']);
      $params = array('user_id' => $this->id,'expense_id' => $exp_id,'amount' => $amount, 'category' => $category, 'payment' => $payment, 'date' => $exp_date, 'time' => $exp_time, 'location' => $location, 'store' => $store, 'comments' => $comments);
      return $this->userExpenses->editExpense($params);
    }
    /*
    * MANAGE BUDGET
    */
    //function to get budget list:
    public function getUserBudgetList(){
      return $this->userBudget->getBudgetList($this->id);
    }
    //function to set weekly budget:
    public function setBudget($data){
      $amount = $this->prepareDataFloat($data['amount']);
      $budget_from = $this->prepareDataDate($data['budget_from']);
      $budget_to = $this->prepareDataDate($data['budget_to']);
      $params = array('user_id' => $this->id, 'amount' => $amount, 'budget_from' => $budget_from, 'budget_to' => $budget_to);
      return $this->userBudget->addBudget($params);
    }
    //function to add weekly budget:
    public function updateBudgetAmount($data){
      $budget_id = $this->prepareDataId($data['id']);
      $amount = $this->prepareDataFloat($data['amount']);
      $budget_from = $this->prepareDataDate($data['budget_from']);
      $budget_to = $this->prepareDataDate($data['budget_to']);
      $params = array('user_id' => $this->id,'budget_id'=>$budget_id, 'amount' => $amount, 'budget_from' => $budget_from, 'budget_to' => $budget_to);
      return $this->userBudget->updateAmount($params);
    }
    //function to add weekly budget:
    public function updateBudgetPeriod($data){
      $budget_id = $this->prepareDataId($data['id']);
      $amount = $this->prepareDataFloat($data['amount']);
      $budget_from = $this->prepareDataDate($data['budget_from']);
      $budget_to = $this->prepareDataDate($data['budget_to']);
      $params = array('user_id' => $this->id,'budget_id'=>$budget_id, 'amount' => $amount, 'budget_from' => $budget_from, 'budget_to' => $budget_to);
      return $this->userBudget->updatePeriod($params);
    }
    /*
    * MANAGE GOALS
    */
    public function getUserGoalList(){
      return $this->userGoals->getGoalsList($this->id);
    }
    //add a weekly goal for a user
    public function addBudgetGoal($data){
      $amount = $this->prepareDataFloat($data['amount']);
      $category = $this->prepareDataCategory($data['category']);
      $budget_id = $this->prepareDataId($data['budget_id']);
      $params = array('user_id' => $this->id,'budget_id'=>$budget_id, 'amount' => $amount, 'category' => $category);
      return $this->userGoals->addGoal($params);
    }
    //delete a weekly goal for a user
    public function deleteBudgetGoal($data){
      $goal_id = $this->prepareDataId($data['id']);
      $budget_id = $this->prepareDataId($data['budget_id']);
      $category = $this->prepareDataCategory($data['category']);
      $amount = $this->prepareDataFloat($data['amount']);
      $params = array('user_id' => $this->id,'goal_id'=>$goal_id, 'budget_id'=>$budget_id, 'amount' => $amount, 'category' => $category);
      return $this->userGoals->deleteGoal($params);
    }
    //update a weekly goal for a user
    public function updateBudgetGoal($data){
      $amount = $this->prepareDataFloat($data['amount']);
      $goal_id = $this->prepareDataId($data['id']);
      $category = $this->prepareDataCategory($data['category']);
      $budget_id = $this->prepareDataId($data['budget_id']);
      $params = array('user_id' => $this->id,'goal_id'=>$goal_id, 'budget_id'=>$budget_id, 'amount' => $amount, 'category' => $category);
      return $this->userGoals->updateGoal($params);
    }
    /*
    * MANAGE CATEGORIES
    */
    //function to get basic categories:
    public function getUserCategories(){
      return $this->userCategories->getCategories($this->id);
    }
    //Add user's category - prepare data and call the appropriate function:
    public function addNewCategory($data){
      $category = $this->prepareDataCategory($data['name']);
      $parameters = array('category' =>$category,'user_id' => $this->id);
      return $this->userCategories->addCategory($parameters);
    }
    //Add user's category:
    public function deleteUserCategory($data){
      $category_id = $this->prepareDataId($data['id']);
      $parameters = array('category_id' =>$category_id, 'user_id' => $this->id);
      return $this->userCategories->deleteCategory($parameters);
    }
    //Update user's category:
    public function editUserCategory($data){
      $category_id = $this->prepareDataId($data['id']);
      $category = $this->prepareDataCategory($data['name']);
      $parameters = array('category_id' =>$category_id,'category' =>$category,'user_id' => $this->id);
      return $this->userCategories->editCategory($parameters);
    }
    /*
    * FUNCTIONS TO PREPARE DATA BEFORE SENDING THEM TO THE DATABASE
    */
    public function prepareDataCategory($string){
      $ready_category = strtolower(filter_var(trim(utf8_decode($string)), FILTER_SANITIZE_STRING));
      return $ready_category;
    }
    public function prepareDataFloat($value){
      $ready_float = floatval(filter_var($value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION));
      return $ready_float;
    }
  }
?>
