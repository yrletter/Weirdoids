<?php
//Start session
session_start();

//Include database connection details
require_once('config.php');

//Array to store validation errors
$errmsg_arr = array();

//Validation error flag
$errflag = false;

$istatus = array();

header('Content-Type: application/json');

//Connect to mysql server
$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
if(!$link) {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Failed to connect to server: ".mysql_errno($link). " ".mysql_error($link);
	echo json_encode($istatus);
	die();
	}

//Select database
$db = mysql_select_db(DB_DATABASE);
if(!$db) {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Unable to select database: ".mysql_errno($link). " ".mysql_error($link);
	echo json_encode($istatus);
	die();
	}

//Function to sanitize values received from the form. Prevents SQL injection
function clean($str) {
	$str = @trim($str);
	if(get_magic_quotes_gpc()) {
		$str = stripslashes($str);
	}
	return mysql_real_escape_string($str);
}

//Sanitize the POST values
$login = clean($_POST['login']);
$password = clean($_POST['password']);

//Input Validations
if($login == '') {
	$errmsg_arr[] = 'Login ID missing';
	$errflag = true;
}
if($password == '') {
	$errmsg_arr[] = 'Password missing';
	$errflag = true;
}

//If there are input validations, redirect back to the login form
if($errflag) {
	$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
	session_write_close();
	foreach ($array as $i => $value) {
		unset($array[$i]);
	}
	$istatus["errorcode"] = -1;
	$istatus["errormsg"] = "validation error";
	$istatus["errmsg_arr"] = $errmsg_arr;
	echo json_encode($istatus);
	die();
}

//Create query
$qry="SELECT * FROM users WHERE email='$login' AND password='".md5($_POST['password'])."'";
$result=mysql_query($qry);

//Check whether the query was successful or not
if($result) {
	if(mysql_num_rows($result) == 1) {
		//Login Successful
		session_regenerate_id();
		$member = mysql_fetch_assoc($result);
		$_SESSION['SESS_USER_ID'] = $member['user_id'];
		$_SESSION['SESS_NAME'] = $member['name'];
		$_SESSION['SESS_EMAIL'] = $member['email'];
		$_SESSION['SESS_IS_PARENT'] = $member['is_parent'];
		$_SESSION['SESS_AVATAR'] = $member['avatar'];
			
		// if parent, get children
			
		// else is child, get parent
			
			
		session_write_close();
		$istatus["errorcode"] = 0;
		$istatus["errormsg"] = "Found user";
		echo json_encode($istatus);
		exit();
		//return_to("myaccount");
	}else if (mysql_error($link)) {
		//Login failed
		//header("location: login-failed.php");
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "L1: Login Query failed ".mysql_errno($link). " ".mysql_error($link);
		echo json_encode($istatus);
		die();
	} else
	{
		//Login failed
		//header("location: login-failed.php");
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "U1: User does not exists: ".$login;
		echo json_encode($istatus);
		die();
	}
}else if (mysql_error($link)) {
	//Login failed
	//header("location: login-failed.php");
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Error: Login Query failed ".mysql_errno($link). " ".mysql_error($link);
	echo json_encode($istatus);
	die();
} else {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "User does not exist: ".$login;
	echo json_encode($istatus);
	die();
}
?>