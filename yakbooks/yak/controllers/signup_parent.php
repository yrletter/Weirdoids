<?php
//Start session
session_start();

//Include database connection details
require_once('config.php');
require_once('../models/user.php');

//Array to store validation errors
$errmsg_arr = array();
$istatus = array();

//Validation error flag
$errflag = false;

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
//$name = clean($_POST['name']);
$email = clean($_POST['email']);
$password = clean($_POST['password']);
$cpassword = clean($_POST['cpassword']);

//Input Validations
//	if($name == '') {
//		$errmsg_arr[] = 'Name missing';
//		$errflag = true;
//	}
if($email == '') {
	$errmsg_arr[] = 'Email missing';
	$errflag = true;
}
if($password == '') {
	$errmsg_arr[] = 'Password missing';
	$errflag = true;
}
if($cpassword == '') {
	$errmsg_arr[] = 'Confirm password missing';
	$errflag = true;
}
if( strcmp($password, $cpassword) != 0 ) {
	$errmsg_arr[] = 'Passwords do not match';
	$errflag = true;
}

//Check for duplicate login ID
if($login != '') {
	$qry = "SELECT * FROM users WHERE email='".$email."'";
	$result = mysql_query($qry);
	if($result) {
		if(mysql_num_rows($result) > 0) {
			$errmsg_arr[] = 'email already in use';
			$errflag = true;
		}
		@mysql_free_result($result);
	}
	else {
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Query failed: ".mysql_errno($link). " ".mysql_error($link);
		echo json_encode($istatus);
		die();
	}
}

//If there are input validations, redirect back to the registration form
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

//Create INSERT query
$qry = "INSERT INTO users( email, password,is_parent) VALUES('$email','".md5($_POST['password'])."',true)";
$result = @mysql_query($qry);

//Check whether the query was successful or not

if($result) {
	// save parent id in session
	$_SESSION['SESS_PARENTID'] = mysql_insert_id();
	$_SESSION['SESS_EMAIL'] = $email;
	
	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "user inserted";
	echo json_encode($istatus);
	exit();
}else {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Insert user Query failed ".mysql_errno($link). " ".mysql_error($link);
	echo json_encode($istatus);
	die();
}
?>