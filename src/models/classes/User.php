<?php
  require_once ('Database.php');
  class User{
    private $db;
    public $app_mail = "budgetmanager.ems@gmail.com";
    //constructor
    public function __construct(){
      $this->db = new Database();
    }
    //function to set feedback for users:
    private function setFeedback($connection){
      $query_a_params = array('table' => 'user', 'column' => 'feedback', 'where' => "feedback=1");
      $query_b_params = array('table' => 'user', 'column' => 'feedback', 'where' => "feedback=0");
      $feedback = $this->db->countColumn($query_a_params);
      $nofeedback = $this->db->countColumn($query_b_params);
      $addfeedback_value;
      if($feedback==$nofeedback){//same number of users with feedback and without feedback:
        $addfeedback_value=(rand(0,1));
      } elseif ($feedback > $nofeedback) {//if we have more users with feedback then we add a user without feedback:
        $addfeedback_value=0;
      } else {//if we have more users without feedback then we add a user with feedback:
        $addfeedback_value=1;
      }
      return $addfeedback_value;
    }
    //function to save user's activity:
		public function saveActivity($args){
      $connection = $args['connection'];
			$stmt = $connection->prepare("INSERT INTO log_activity (user_id, log_time, activity_type) VALUES (?, ?, ?)");
			$stmt->bind_param("iss", $args['user_id'], $args['time'], $args['activity_type']);
			if($stmt->execute()){
				return true;
			} else {
				return false;
			}
		}
    //function to save user's activity:
		public function updatePasswordCells($args){
      $connection = $args['connection'];
      $sql = "UPDATE user SET password=?, activationcode=?  WHERE ".$args['where']."";
      $stmt = $connection->prepare($sql);
      $stmt->bind_param('ss', $args['value_one'], $args['value_two']);
      if($stmt->execute()){
        return true;
      } else {
        return false;
      }
		}
    //function to save user:
		private function saveUser($args){
      $connection = $args['connection'];
    	$stmt = $connection->prepare("INSERT INTO user (username, email, password, gender, birthdate, feedback, activationcode) VALUES (?, ?, ?, ?, ?, ?, ?)");
			$stmt->bind_param("sssssis",  $args['username'], $args['email'], $args['user_pass'], $args['gender'],  $args['birthday'], $args['feedback'], $args['activationcode']);
			$save_results = array();
			if($stmt->execute()){
				$id = $stmt->insert_id;
				$save_results = array(true, $id);
			} else {
				$save_results = array(false, 'no_id');
			}
			return $save_results;
		}
    //function to send email
    public function sendEmail($args){
      $to = $args['receiver'];
      $headers = "MIME-Version: 1.0" . "\r\n";
      $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
      $headers .= "From: '".$args['sendername']."' <".$args['sender'].">" . "\r\n";
      if (mail($to,$args['subject'],$args['message'],$headers)) {
        return true;
      }else{
        return false;
      }
    }
    //function to create emails that are sent from the app
    public function getAppMail($args){
      $app_host = "";
      $linkpart = "";
      $greeting = "";
      if (array_key_exists("app_host", $args)){
        $app_host = $args['app_host'];
      }
      if (array_key_exists("linkpart", $args)){
        $linkpart = $args['linkpart'];
      }
      if (array_key_exists("sendinguser", $args)){
        $greeting = "Dear ".$args['sendinguser'].",";
      }
      $links = array('index' => $app_host."index.html",
        'contact' => $app_host."contact.html",
        'activation' => $app_host."account_activation.html".$linkpart,
        'reset' => $app_host."reset_password.html".$linkpart);
      $messages = array(
        'reset' =>"<br/><br/>We got requested to reset your password!
          <br>If you requested this, just click on the following link to reset your password, otherwise ignore this email!<br>
          <a href='".$links['reset']."'>Reset You Password Here!</a>",
        'pass_change' =>"<br/><br/>You successfully changed your password!
          <br>You can now login to your account with your new password!<br/><a href='".$links['index']."'>Login</a><br/><br/>If you did not perform this action contact us immediately!</b>
          You can reply at this email or contact us via the app by clicking the following link:<br/><a href='".$links['contact']."'>Contact Us</a>",
        'activation' =>"<br><br><b>Welcome to Budget Manager!</b><br/>To finish your registration and activate your account click on the following link:<br/><a href='".$links['activation']."'>Activate You Account Here!</a>",
        're_activation' =>"<br/><br/><b>You just changed your account's email address!</b><br/><br/>You have to activate again your account by following the link below:<br/>
        <br/><a href='".$links['activation']."'>Activate You Account Here!</a><br/><br/><b><i>PS: If you didn't perform that action or you cannot activate your account please contact use immediately!</i></b>"
      );
        $bye_greeting = "<br><br>Thank you!<br><i>the Budget Manager team</i>";
        $compiled_email = $greeting.$messages[$args['type']].$bye_greeting;
        return $compiled_email;
      }
    //function to sign up user:
    public function signUp($data){
      $message="";
      $username = $this->prepareDataString($data['username']);
      $email = $this->prepareDataString($data['email']);
      $password = $this->prepareDataString($data['password']);
      $gender = $this->prepareDataString($data['gender']);
      $birthday = $this->prepareDataDate($data['birth']);
      $apphost = $this->prepareDataString($data['apphost']);
      $connection = $this->db->dbConnect();
      $db_emails_params = array('table' => 'user', 'column' => 'email', 'where' => "email='".$email."'");
      $db_usernames_params = array('table' => 'user', 'column' => 'username', 'where' => "email='".$email."'");
      $db_emails = $this->db->countColumn($db_emails_params);
      $db_usernames = $this->db->countColumn($db_usernames_params);
      if($db_usernames===0 && $db_emails===0){
        $activationcode = password_hash(uniqid(rand()), PASSWORD_DEFAULT);
        $user_pass = password_hash($password, PASSWORD_DEFAULT);
        $feedback = $this->setFeedback($connection);
        $saveuser_params = array('connection' => $connection, 'username' => $username, 'email' => $email, 'user_pass' => $user_pass, 'gender' => $gender, 'birthday' => $birthday, 'feedback' => $feedback, 'activationcode' => $activationcode);
        $user_saved = $this->saveUser($saveuser_params);
        if($user_saved[0]===true){
          $subject = "Account Activation";
          $linkpart = "?id=".$user_saved[1]."&username=".$username."&code=".$activationcode;
          $mail_params = array('type' => "activation", 'app_host'=>$apphost, 'linkpart' => $linkpart,'sendinguser' => $username);
          $mailtosend = $this->getAppMail($mail_params);
          $sent_mail_params = array('sender' => $this->app_mail, 'sendername' => "Budget Manager", 'receiver' => $email, 'subject' => $subject,'message' =>$mailtosend);
          $send_mail = $this->sendEmail($sent_mail_params);
          if($send_mail===true){
            $message="success";
          } else {
            $message = "saved_no_ver_email";
          }
        }else {
          $message="db_error";
        }
      }elseif ($db_usernames!=0 && $db_emails!=0) {
        $message = "username_email_exists";
      } elseif ($db_usernames!=0 && $db_emails==0) {
        $message = "username_exists";
      } elseif ($db_usernames==0 && $db_emails!=0) {
        $message = "email_exists";
      }
      $this->db->dbDisconnect();
      $results = array("message" => $message, 'target' => "signup");
      return $results;
    }
    //function to verify user and activate account:
    public function activateAccount($data){
      $id = $this->prepareDataId($data['id']);
      $username = $this->prepareDataString($data['username']);
      $activationcode = $this->prepareDataString($data['activationcode']);
      $message = "";
      $this->db->dbConnect();
      $row_params = array('select' => 'verified, activationcode','table' => 'user','where' => "id='".$id."' AND username='".$username."'");
      $db_user = $this->db->getRow($row_params);
      if(count($db_user)===0){
        $message = "account_not_found";
      }else{
        if(count($db_user)>0 && $db_user['verified']===1){
          $message = "already_active";
        } else if($db_user['activationcode']===$activationcode){
          $update_params = array('table' => 'user', 'column' => 'verified', 'value' => 1, 'where' => "id='".$id."'");
          $updated = $this->db->updateIntColumn($update_params);
          if ($updated===true) {
            $message = "success";
          }
          else {
            $message = "activation_error";
          }
        }
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "activateaccount");
      return $results;
    }
    //function to send password recovery email:
    public function forgotPasswordRequest($data){
      $email = $this->prepareDataString($data['email']);
      $username = $this->prepareDataString($data['username']);
      $apphost = $this->prepareDataString($data['apphost']);
      $message = "";
      $this->db->dbConnect();
      $row_params = array('select' => 'id, username, email, verified','table' => 'user','where' => "username='".$username."' AND email='".$email."'");
      $db_account = $this->db->getRow($row_params);
      $numb = count($db_account);
      if($numb>0 && $db_account['verified']==1){
        $activationcode = password_hash(uniqid(rand()), PASSWORD_DEFAULT);
        $update_params = array('table' =>'user', 'column' =>'activationcode', 'value' =>$activationcode, 'where' =>"email='".$email."'");
        $update_code = $this->db->updateStringColumn($update_params);
        if($update_code===true){
          $subject =  "Reset Password";
          $linkpart = "?account=".$username."&code=".$activationcode;
          $mail_params = array('type' => "reset", 'app_host'=>$apphost, 'linkpart' => $linkpart,'sendinguser' => $username);
          $mailtosend = $this->getAppMail($mail_params);
          $sent_mail_params = array('sender' => $this->app_mail, 'sendername' => "Budget Manager", 'receiver' => $email, 'subject' => $subject,'message' =>$mailtosend);
          $send_mail = $this->sendEmail($sent_mail_params);
          if($send_mail===true){
            $message = "success";
          }
          else{
            $message = "process_error";
          }
        }else{
          $message = "process_error";
        }
      }elseif ($numb>0 && $db_account['verified']==0) {
        $message = "unverified_account";
      }else{
        $message = "noaccount";
      }
      $this->db->dbDisconnect();

      $results = array("message" => $message, 'target' => "forgotpassword");
      return $results;
    }
    //function to reset password:
    public function resetPassword($data){
      $username = $this->prepareDataString($data['user']);
      $activationcode = $this->prepareDataString($data['activationcode']);
      $newpass = $this->prepareDataString($data['newpass']);
      $newpass_conf = $this->prepareDataString($data['newpass_conf']);
      $apphost = $this->prepareDataString($data['apphost']);
      $message = "";
      if($newpass===$newpass_conf){
        $connection = $this->db->dbConnect();
        $row_params = array('select' => 'id, email, verified, activationcode','table' => 'user','where' => "username='".$username."'");
        $db_account = $this->db->getRow($row_params);
        $numb = count($db_account);
        if($numb>0 && $db_account['verified']===1){
          if($db_account['activationcode']===$activationcode){
            $newactivationcode = password_hash(uniqid(rand()), PASSWORD_DEFAULT);
            $user_pass = password_hash($newpass, PASSWORD_DEFAULT);
            $update_params = array('connection' => $connection, 'where' => "username='".$username."'", 'value_one' => $user_pass, 'value_two' => $newactivationcode);
            $updated = $this->updatePasswordCells($update_params);
            if($updated===true){
              $subject = "Your Password Changed";
              $mail_params = array('type' => "pass_change",'app_host'=>$apphost, 'sendinguser' => $username);
              $mailtosend = $this->getAppMail($mail_params);
              $sent_mail_params = array('sender' => $this->app_mail, 'sendername' => "Budget Manager", 'receiver' => $db_account['email'], 'subject' => $subject,'message' =>$mailtosend);
              $send_mail = $this->sendEmail($sent_mail_params);
              if($send_mail===true){
                $message = "success";
              }else{
                $message = "success_no_email";
              }
            }else{
              $message = "process_error";
            }
          }else{
              $message = "code_error";
            }
          }elseif ($numb>0 && $db_account['verified']===0) {
            $message = "unverified_account";
          }else{
            $message = "noaccount";
          }
          $this->db->dbDisconnect();
        }else{
          $message = "process_error";
        }
        $results = array("message" => $message, 'target' => "resetpassword");
        return $results;
      }
    //function to send contact email:
    public function sendContactEmail($data){
      $fullname = $this->prepareDataString($data['fullname']);
      $email = $this->prepareDataString($data['email']);
      $subject = $this->prepareDataString($data['subject']);
      $email_message = $this->prepareDataString($data['message']);
      $message = "";
      if(strlen($subject)==0){
          $subject = "NO SUBJECT";
      }else{
        $subject = ucwords($subject);
      }
      $sent_mail_params = array('sender' => $email, 'sendername' => $fullname, 'receiver' => $this->app_mail, 'subject' => $subject,'message' =>$email_message);
      $send_mail = $this->sendEmail($sent_mail_params);
      if($send_mail===true){
        $message = "success";
      } else {
        $message = "error";
      }
      $results = array("message" => $message, 'target' => "contactemail");
      return $results;
    }
    //function to sign in user:
    public function signIn($data){
      $password = $this->prepareDataString($data['password']);
      $credential =  $this->prepareDataString($data['credential']);
      $cookie = $data['cookie'];
      $message = "";
      $connection = $this->db->dbConnect();
      $row_args = array('select' => 'id, username, password, verified','table' => 'user','where' => "username='".$credential."' OR email='".$credential."'");
      $db_user = $this->db->getRow($row_args);
      if(count($db_user)>0 && $db_user['verified']===1){
        if(!password_verify($password, $db_user['password'])){
          $message = "wrong_password";
        } else {
          $login_time = date('Y-m-d H:i:s');
          $save_activity_params = array('connection' => $connection,'user_id' => $db_user['id'],'time' => $login_time,'activity_type' => 'sign_in');
          $update_sql = "username='".$credential."' OR email='".$credential."'";
          $update_params = array('table' => 'user','column' => 'signed_in','value' => 1,'where' => $update_sql);
          $saved_activity = $this->saveActivity($save_activity_params);
          $update_status = $this->db->updateIntColumn($update_params);
          if($saved_activity===true && $update_status===true){
            $_SESSION['bm_ems_user'] = $db_user['username'];
            if($cookie===true){
              $cookie_name = "bm_ems_user";
              $cookie_value = $db_user['username'];
              setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");
            }
            $message = "success";
            $username = $db_user['username'];
          } else {
            $message = "login_error";
          }
        }
        } elseif (count($db_user)>0 && $db_user['verified']===0) {
          $message = "unverified_account";
        } else {
          $message = "wrong_email_username";
      }
      $this->db->dbDisconnect();
      $results = array("message" => $message, 'target' => "signin");
      return $results;
    }
    /*
    * FUNCTIONS TO PREPARE DATA BEFORE SENDING THEM TO THE DATABASE
    */
    public function prepareDataString($string){
      $ready_string = filter_var(trim($string), FILTER_SANITIZE_STRING);
      return $ready_string;
    }
    public function prepareDataDate($string){
      $ready_date = filter_var(trim(date('Y-m-d',strtotime($string))), FILTER_SANITIZE_STRING);
      return $ready_date;
    }
    public function prepareDataId($incoming_id){
      $ready_id = (int)str_replace(array(' ', ','), '', $incoming_id);
      return $ready_id;
    }
  }
?>
