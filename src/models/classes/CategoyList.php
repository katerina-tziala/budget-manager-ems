<?php
  class CategoyList{
    private $db;
    private $basic_categories = [];
    //construct the model:
    public function __construct($database){
      $this->db = $database;
    }
    /*
    * USER'S CATEGORIES
    */
    //load basic categories:
    private function loadUserCategories($id){
      $this->basic_categories = [];
      $this->db->dbConnect();
      $db_categories = $this->db->runQuery("(SELECT * FROM `category` WHERE added_by=$id ORDER BY category_name) UNION (SELECT * FROM `category` WHERE added_by IS NULL) ORDER BY added_by DESC, category_name ASC");
      while ($row = $db_categories->fetch_array(MYSQLI_ASSOC)) {
        $category = array('id' => $row['id'], 'name' => utf8_encode($row['category_name']), 'added_by' => $row['added_by'] );
        array_push($this->basic_categories, $category);
      }
      $this->db->dbDisconnect();
    }
    //function to save user's category:
		private function saveCategory($args){
      $connection = $args['connection'];
			$stmt = $connection->prepare("INSERT INTO category (category_name, added_by) VALUES (?, ?)");
			$stmt->bind_param("si", $args['category'], $args['user_id']);
			$save_results = array();
			if($stmt->execute()){
				$id = $stmt->insert_id;
				$save_results = array(true, $id);
			} else {
				$save_results = array(false, 'no_id');
			}
			return $save_results;
		}
		//function to save category to 'log_category' table:
		private function saveCategoryLog($args){
      $connection = $args['connection'];
			$stmt = $connection->prepare("INSERT INTO log_category (user_id, category_id, category_name, log_type) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("iiss", $args['user_id'], $args['category_id'], $args['category'], $args['type']);
			if($stmt->execute()){
				return true;
			} else {
				return false;
			}
		}
    //get user categories:
    public function getCategories($id){
      $this->loadUserCategories($id);
      return $this->basic_categories;
    }
    //add category for user:
    public function addCategory($args){
      $user_id = $args['user_id'];
      $category = $args['category'];
      $message = "";
      $return_data = array();
      $connection = $this->db->dbConnect();
      $count_params = array('table' => 'category', 'column' => 'category_name', 'where' => "category_name='".$category."' AND added_by='".$user_id."'");
      $db_category = $this->db->countColumn($count_params);
      if($db_category>0){
        $message = "exists";
      }else{
        $save_params  = array('connection' => $connection,'user_id' => $user_id,'category' => $category);
        $saved = $this->saveCategory($save_params);
        if($saved[0]===true){
          $log_params  = array('connection' => $connection,'user_id' => $user_id,'category_id' => $saved[1],'category' => $category,'type' => 'inserted');
          $this->saveCategoryLog($log_params);
          $message = "success";
          $return_data = array('id' => $saved[1], 'name' => utf8_encode($category), 'added_by' => $user_id);
        }else{
          $message = "db_error";
        }
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'data' => $return_data, 'target' => "category");
      return $results;
    }
    //delete category for user:
    public function deleteCategory($args){
      $user_id = $args['user_id'];
      $category_id = $args['category_id'];
      $connection = $this->db->dbConnect();
      $dbrec = $this->db->runQuery("SELECT category_name FROM category WHERE id='".$category_id."' AND added_by='".$user_id."'");
      $db_category = $dbrec->fetch_array(MYSQLI_ASSOC);
      $numb = mysqli_num_rows($dbrec);
      $message = "";
      if($numb>0){
        $deleted = $this->db->deleteFromDB("DELETE FROM `category` WHERE id='".$category_id."'");
        $log_params  = array('connection' => $connection,'user_id' => $user_id,'category_id' => $category_id,'category' => $db_category['category_name'],'type' => 'deleted');
        $this->saveCategoryLog($log_params);
        if($deleted===true){
          $message = "success";
        } else {
          $message = "db_error";
        }
      } else {
        $message = "cannot_delete";
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "category");
      return $results;
    }
    //update category for user:
    public function editCategory($args){
      $category = $args['category'];
      $user_id = $args['user_id'];
      $category_id = $args['category_id'];
      $message = "";
      $count_params = array('table' => 'category', 'column' => 'category_name', 'where' => "category_name='".$category."' AND added_by='".$user_id."'");
      $connection = $this->db->dbConnect();
      $db_category = $this->db->countColumn($count_params);
      if($db_category>0){
        $message = "exists";
      } else {
        $upadate_params = array('table' => 'category', 'column' => 'category_name', 'value' => $category, 'where' => "id='".$category_id."' AND added_by='".$user_id."'");
        $log_params  = array('connection' => $connection,'user_id' => $user_id,'category_id' => $category_id,'category' => $category,'type' => 'updated');
        $updated = $this->db->updateStringColumn($upadate_params);
        $this->saveCategoryLog($log_params);
          if($updated===true){
            $message = "success";
          } else {
            $message = "db_error";
          }
      }
      $this->db->dbDisconnect();
      $results = array('message' => $message, 'target' => "category");
      return $results;
    }
  }
?>
