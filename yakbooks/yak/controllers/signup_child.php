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
$child_fname = clean($_POST['child_fname']);
$child_yakname = clean($_POST['child_yakname']);
$child_yaklogin = clean($_POST['child_yaklogin']);
$password = clean($_POST['child_password']);
$cpassword = clean($_POST['child_cpassword']);
$child_email = clean($_POST['child_email']);
$child_parent_email = clean($_POST['child_parent_email']);

//Input Validations
if($child_fname == '') {
	$errmsg_arr[] = 'First Name missing';
	$errflag = true;
}

if($child_yakname == '') {
	$errmsg_arr[] = 'Yak Name missing';
	$errflag = true;
}

if($child_yaklogin == '') {
	$errmsg_arr[] = 'Yak Login missing';
	$errflag = true;
}



if($child_parent_email == '') {
	$errmsg_arr[] = 'Parent email missing';
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
	$qry = "SELECT * FROM users WHERE email='$child_parent_email'";
	$result = mysql_query($qry);
	if($result) {
		if(mysql_num_rows($result) > 0) {
			$errmsg_arr[] = 'Parent exists.';
			$errflag = true;
		}
		@mysql_free_result($result);
	}
	else {
		die("Query failed");
	}
}

//If there are input validations, redirect back to the registration form
if($errflag) {
	$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
	session_write_close();
	$istatus["errorcode"] = -1;
	$istatus["errormsg"] = "validation error";
	$istatus["errmsg_arr"] = $errmsg_arr;
	echo json_encode($istatus);
	exit();
}

//Create INSERT query
$qry = sprintf("INSERT INTO users(fname, yakname, yaklogin,  password, is_parent) 
	VALUES('%s', '%s', '%s', '%s',   false)",
	$child_fname,
	$child_yakname,
	$child_yaklogin,
	md5($_POST['password']));
	
$result = @mysql_query($qry);

//Check whether the query was successful or not
if($result) {
	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "child inserted";
	echo json_encode($istatus);
	exit();
}else {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Insert child user Query failed ".mysql_errno($link). " ".mysql_error($link);
	echo json_encode($istatus);
	die();
}

?>