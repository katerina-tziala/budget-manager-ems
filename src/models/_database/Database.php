<?php
	class Database{
	  private $db_host = "localhost";
		private $db_username = "APP_DB_USERNAME";
		private $db_password = "APP_DB_PASSWORD";
		private $db_name = "APP_DB_NAME";
		private $db_connection = null;
		//constructor:
		public function __construct(){}
		//function to connect to database if there isn't connection:
		public function dbConnect(){
			if(!isset($this->db_connection)){
					$this->db_connection = new mysqli($this->db_host, $this->db_username, $this->db_password, $this->db_name);
					if ($this->db_connection->connect_error) {
						die('Connect Error (' . $this->db_connection->connect_errno . ') '. $this->db_connection->connect_error);
					}
			}
			return $this->db_connection;
		}
		//function to disconnect from the database:
		public function dbDisconnect(){
			$this->db_connection->close();
			unset($this->db_connection);
		}
		/*
		* FUNCTIONS TO RUN QUERIES:
		*/
		//function to runQuery to sql:
		public function runQuery($sql){
			$stmt = $this->db_connection->prepare($sql);
			$stmt->execute();
			$results = $stmt->get_result();
			return $results;
		}
		//function to select one row:
		public function getRow($args){
			$sql ="SELECT ".$args['select']." FROM ".$args['table']." WHERE ".$args['where']."";
			$results = $this->runQuery($sql);
			if(!$results->num_rows){
				$data = [];
			}else{
				$data = $results->fetch_array(MYSQLI_ASSOC);
			}
			return $data;
		}
		//function to get value of one cell:
		public function getCell($args){
			$sql ="SELECT ".$args['column']." FROM ".$args['table']." WHERE ".$args['where']."";
			$result = $this->runQuery($sql);
			$cell = $result->fetch_row();
			return $cell[0];
		}
		//function to count one column:
		public function countColumn($args){
			$column = $args['column'];
			$sql ="SELECT COUNT('".$column."') FROM ".$args['table']." WHERE ".$args['where']."";
			$result = $this->runQuery($sql);
			$cell = $result->fetch_row();
			return $cell[0];
		}
		//function to delete from the database:
		public function deleteFromDB($sql){
			$stmt = $this->db_connection->prepare($sql);
			if($stmt->execute()){
				return true;
			} else {
				return false;
			}
		}
		//function to update a cell of a table that contains integer:
		public function updateIntColumn($args){
			$sql = "UPDATE ".$args['table']." SET ".$args['column']."=? WHERE ".$args['where']."";
			$stmt = $this->db_connection->prepare($sql);
			$stmt->bind_param('i', $args['value']);
			if($stmt->execute()){
				return true;
			} else {
				return false;
			}
		}
		//function to update column that contains string:
		public function updateStringColumn($args){
			$sql = "UPDATE ".$args['table']." SET ".$args['column']."=? WHERE ".$args['where']."";
			$stmt = $this->db_connection->prepare($sql);
			$stmt->bind_param('s', $args['value']);
			if($stmt->execute()){
				return true;
			} else {
				return false;
			}
		}
		//function to update column that contains decimal:
		public function updateFloatColumn($args){
			$sql = "UPDATE ".$args['table']." SET ".$args['column']."=? WHERE ".$args['where']."";
			$stmt = $this->db_connection->prepare($sql);
			$stmt->bind_param('d', $args['value']);
			if($stmt->execute()){
				return true;
			} else {
				return false;
			}
		}
	}
?>
