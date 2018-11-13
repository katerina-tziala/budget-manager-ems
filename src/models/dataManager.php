<?php
	session_start();
	$return_data = [];
	if(isset($_COOKIE['bm_ems_user']) && !empty($_COOKIE['bm_ems_user'])){
		$_SESSION['bm_ems_user'] = $_COOKIE['bm_ems_user'];
	}
	if(isset($_SESSION['bm_ems_user']) && !empty($_SESSION['bm_ems_user'])){
		$allowed_actions = ["getPersonalInfo",
		"getFeedbackList", "saveFeedbackDisplay","updateGenderBirthday","updateUsername",
		"updatePassword",	"updateEmail",	"getUserExpenseList",	"addUserExpense",	"deleteUserExpense","updateUserExpense",
		"getUserBudgetList",	"setBudget",	"updateBudgetAmount",	"updateBudgetPeriod",	"getUserGoalList","addWeeklyGoal",
		"deleteBudgetGoal",	"updateBudgetGoal",	"getUserCategories",	"addNewCategory",	"deleteUserCategory",	"editUserCategory",
		"signUserOut",	"sendContactEmail"];
		require_once("classes/LoggedUser.php");
		$loggedUser = new LoggedUser($_SESSION['bm_ems_user']);
		if (isset($_GET['action']) && !empty($_GET['action'])) {
			$required_action = $_GET['action'];
			if($_SERVER['REQUEST_METHOD'] === 'POST' && in_array($required_action, $allowed_actions)){
	      $input_data = json_decode(file_get_contents('php://input'), true);
				$return_data = $loggedUser->{$required_action}($input_data);
	    }elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && in_array($required_action, $allowed_actions)) {
				$return_data = $loggedUser->{$required_action}();
	    }elseif (!in_array($required_action, $allowed_actions)) {
				$results = array("message" => "invalid_request", 'target' => "no_target");
				$return_data = $results;
	    }
		}
	}else {
		require_once("classes/User.php");
		$allowed_actions = ["signUp", "signIn", "sendContactEmail", "forgotPasswordRequest", "resetPassword", "activateAccount"];
		$basicUser = new User();
		if (isset($_GET['action']) && !empty($_GET['action'])) {
			$required_action = $_GET['action'];

			if (in_array($required_action, $allowed_actions)) {
				$input_data = json_decode(file_get_contents('php://input'), true);
				$return_data = $basicUser->{$required_action}($input_data);
			} else {
				if ($required_action === 'getPersonalInfo') {//override this action when user is not signed in
					$return_data = array('id' => "no_id",
						'username' =>"no_user",
						'email' => "no_email",
						'gender' => "no_gender",
						'birthdate' => "no_birthdate",
						'feedback' => 0,
						'signed_in' => 0,
						'registration_date' => "no_date",
						'has_current_budget'=> "no");
				}else{
					$results = array("message" => "invalid_request", 'target' => "no_target");
					$return_data = $results;
				}
			}
		}
	}
	echo json_encode($return_data);
?>
