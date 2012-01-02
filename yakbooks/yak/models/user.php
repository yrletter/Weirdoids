<?php

class UserModel {

	var $user_id;
	var $fname;
	var $lname;
	var $email;
	var $password;
	var $is_parent;
	var $bday;

	// child specific
	var $is_boy;
	var $yaklogin;
	var $yakname;
	var $avatar;

	//parent specific
	var $address1;
	var $address2;
	var $city;
	var $state;
	var $country;
	var $postal;
	var $mobilephoneno;

	// verification method
	var $verification_method;
	var $last4ssn;
	var $cc_type;
	var $cc_expiration_date;
	var $cc_number;
	var $is_verified;

	var $ok;
	var $msg;
	var $is_logged;
	var $status;
	var $last_logged_ip;
	var $last_logged_on;
	var $created_on;
	var $created_ip;
	var $is_admin;
	var $children;

	function __construct(){
		global $db;


		if(!isset($_SESSION['email'])) $_SESSION['email'] = "";
		if(!isset($_SESSION['name'])) $_SESSION['name'] ="";

		if(!isset($_COOKIE['email'])) setcookie('email',"");
		if(!isset($_COOKIE['name'])) setcookie('name',"");
		if(!$this->check_session()) $this->check_cookie();


		$this->user_id = 0;
		$this->email = '';
		$this->ok = false;
		$this->$user_id = 0;
		$this->$fname = '';
		$this->$lname = '';
		$this->$email;
		$this->$password = '';
		$this->$is_parent = false;
		$this->$bday=null;

		// child specific
		$this->$is_boy=true;
		$this->$yaklogin = '';
		$this->$yakname = '';
		$this->$avatar = '';

		//parent specific
		$this->$address1 = '';
		$this->$address2 = '';
		$this->$city = '';
		$this->$state = '';
		$this->$country = '';
		$this->$postal = '';
		$this->$mobilephoneno = '';

		// verification method
		$this->$verification_method = 'none';
		$this->$last4ssn = '';
		$this->$cc_type = '';
		$this->$cc_expiration_date = '';
		$this->$cc_number = '';
		$this->$is_verified = false;

		$this->$ok = true;
		$this->$msg = '';
		$this->$is_logged = false;
		$this->$status = 'unk';
		$this->$last_logged_ip = '';
		$this->$last_logged_on=null;
		$this->$created_on=null;
		$this->$created_ip = '';
		$this->$is_admin = false;
		$this->$children = array();

		return $this->ok;
	}

	function check_session(){
		if(!empty($_SESSION['email']) && !empty($_SESSION['name']))
		return $this->check($_SESSION['email'], $_SESSION['name']);
		else
		return false;
	}

	function check_cookie(){
		if(!empty($_COOKIE['email']) && !empty($_COOKIE['name']))
		return $this->check($_COOKIE['email'], $_COOKIE['name']);
		else
		return false;
	}

	function create($info,$login = true){
		global $db;
		$email = mysql_real_escape_string($info['email']);
		$password = md5(mysql_real_escape_string($info['password']) . PASSWORD_SALT);
		$created_ip = $_SERVER['REMOTE_ADDR'];
		$this->ok = false;

		if(!$info['name'] || !$info['email'] || !$info['password'] || !$info['password2']){
			$this->msg = "Error! All fields are required.";
			return false;
		}elseif($info['password'] != $info['password2']){
			$this->msg = "Error! Passwords do not match.";
			return false;
		}elseif(!$this->validEmail($info['email'])){
			$this->msg = "Error! Please enter a valid e-mail address.";
			return false;
		}

		$db->query("SELECT user_id, password FROM users WHERE email = '".mysql_real_escape_string($email)."'");
		if(mysql_num_rows($db->result) == 1){
			$this->msg = "Error! E-mail address is already in use.";
		}else{
			$query = $db->query("INSERT INTO users (email,password,created_ip) VALUES ('$email','$password','$created_ip')");
			if($query){
				$this->msg = "User successfully added.";
				$this->ok = true;
				if($login) $this->login($info['email'],$info['password']);
				return true;
			}else{
				$this->msg = "There was a problem, please try again.";
			}

		}
		return false;
	}

	function update($info){
		global $db;

		$this->ok = false;

		$name = mysql_real_escape_string($info['name']);
		$email = mysql_real_escape_string($info['email']);
		$password = md5(mysql_real_escape_string($info['password']) . PASSWORD_SALT);

		if($info['password'] != $info['password2']){
			$this->msg = "Error! Passwords do not match.";
			return false;
		}elseif(!$this->validEmail($info['email'])){
			$this->msg = "Error! Please enter a valid e-mail address.";
			return false;
		}
		$sql = "name='$name', email='$email'";
		if($info['password']){
			$sql .= ", password='$password'";
		}
		$query = "UPDATE users SET ".$sql." WHERE user_id = '".$this->user_id."'";
		$query = $db->query($query);
		if($query){
			$this->msg = "Info successfully updated.";
			$this->ok = true;
			$_SESSION['email'] = $email;
			if($info['password']) $_SESSION['name'] = $password;
			setcookie("email", $email, time()+60*60*24*30, "/", COOKIE_DOMAIN);
			if($info['password']) setcookie("name", $password, time()+60*60*24*30, "/", COOKIE_DOMAIN);
			$this->name = $name;
			$this->email = $email;
			return true;
		}else{
			$this->msg = "There was a problem, please try again.";
		}
		return false;
	}

	function login($email, $password){
		global $db;
		$sql = $db->query("SELECT user_id, password, name FROM users WHERE email = '".mysql_real_escape_string($email)."'");
		$this->ok = false;
		if(!$email || !$password){
			$this->msg = "Error! Both E-mail and Password are required to login.";
		}
		$results = $db->fetch($sql);
		if($db->num($sql) == 1)
		{
			$db_password = $results['password'];
			$name = $results['name'];
			if(md5($password . PASSWORD_SALT) == $db_password)
			{
				$_SESSION['email'] = $email;
				$_SESSION['name'] = md5($password . PASSWORD_SALT);
				setcookie("email", $email, time()+60*60*24*30, "/", COOKIE_DOMAIN);
				setcookie("name", md5($password . PASSWORD_SALT), time()+60*60*24*30, "/", COOKIE_DOMAIN);
				$this->user_id = $results['user_id'];
				$this->name = $name;
				$this->email = $email;
				$this->ok = true;
				$this->msg = "Login Successful!";
				$this->is_logged = true;
				return true;
			}else{
				$this->msg = "Error! Password is incorrect.";
			}
		}else{
			$this->msg = "Error! User does not exist.";
		}
		return false;
	}

	function check($email, $secret){
		global $db;
		$sql = $db->query("SELECT user_id, password, name FROM users WHERE email = '".mysql_real_escape_string($email)."'");
		$results = $db->fetch($sql);
		if($db->num($sql) == 1)
		{
			$db_password = $results['password'];
			$name = $results['name'];
			if($db_password == $secret) {
				$this->user_id = $results['user_id'];
				$this->email = $email;
				$this->name = $name;
				$this->ok = true;
				$this->is_logged = true;
				return true;
			}
		}
		return false;
	}

	function is_logged(){
		if($this->check($_SESSION['email'], $_SESSION['name'])) return true;
		else return false;
	}

	function is_admin(){
		if($this->is_logged() && $this->get_info('admin') == 1) return true;
		else return false;
	}

	function get_info($field = "*", $email = null){
		global $db;
		if(!$email) $email = $this->email;
		$sql = $db->query("SELECT $field FROM users WHERE email = '$email'");
		$info = $db->fetch($sql);
		if($field == "*") return $info;
		else return $info[$field];
	}

	function logout(){
		$this->user_id = 0;
		$this->email = "Guest";
		$this->name = "Guest";
		$this->ok = true;
		$this->msg = "You have been logged out!";
		$this->is_logged = false;

		$_SESSION['email'] = "";
		$_SESSION['name'] = "";
		setcookie("email", "", time() - 3600, "/", COOKIE_DOMAIN);
		setcookie("name", "", time() - 3600, "/", COOKIE_DOMAIN);
	}

	// Courtesy LinuxJournal.com : http://www.linuxjournal.com/article/9585?page=0,3
	function validEmail($email){
		$isValid = true;
		$atIndex = strrpos($email, "@");
		if (is_bool($atIndex) && !$atIndex){
			$isValid = false;
		}
		else{
			$domain = substr($email, $atIndex+1);
			$local = substr($email, 0, $atIndex);
			$localLen = strlen($local);
			$domainLen = strlen($domain);
			if ($localLen < 1 || $localLen > 64){
				$isValid = false;
			}else if ($domainLen < 1 || $domainLen > 255){
				$isValid = false;
			}else if ($local[0] == '.' || $local[$localLen-1] == '.'){
				$isValid = false;
			}else if (preg_match('/\\.\\./', $local)){
				$isValid = false;
			}else if (!preg_match('/^[A-Za-z0-9\\-\\.]+$/', $domain)){
				$isValid = false;
			}else if (preg_match('/\\.\\./', $domain)){
				$isValid = false;
			}else if(!preg_match('/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/', str_replace("\\\\","",$local))){
				if (!preg_match('/^"(\\\\"|[^"])+"$/', str_replace("\\\\","",$local))){
					$isValid = false;
				}
			}
			if ($isValid && !(checkdnsrr($domain,"MX") ||  checkdnsrr($domain,"A"))){
				$isValid = false;
			}
		}
		return $isValid;
	}

	function status($value){
		switch($value){
			case 0:
				return 'Inactive';
				break;
			case 1:
				return 'Active';
				break;
			case 2:
				return 'Deleted';
				break;
			default:
				return 'Inactive';
				break;
		}
	}

	function user_info($user_id){
		global $user, $db;
		$query = "SELECT * FROM users WHERE user_id = '".$user_id."'";
		$result = $db->query($query);
		$info = $db->fetch($result);
		return $info;
	}

	function user_update($info, $user_id){
		global $db;
		$query = "UPDATE users SET status='".$info['status']."', name='".$info['name']."', email='".$info['email']."''";
		if($info['password']){
			$password = md5(mysql_real_escape_string($info['password']) . PASSWORD_SALT);
			$query .= ", password='".$password."'";
		}
		$query .=  " WHERE user_id = '".$user_id."'";
		if($db->query($query)) return true;
		else return false;
	}

}