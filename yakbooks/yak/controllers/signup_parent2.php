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

// Make sure session exists, user is logged in, we have parent email address
if(!isset($_SESSION['SESS_EMAIL'])){
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Sorry, Please login and use this page.";
	echo json_encode($istatus);
	die();
}
else
{
	$email = $_SESSION['SESS_EMAIL'];
}

if(!isset($_SESSION['SESS_PARENTID'])){
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Parent ID not specified.";
	echo json_encode($istatus);
	die();
}
else
{
	$parent_user_id = $_SESSION['SESS_PARENTID'];
}

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
$child_fname = clean($_POST['child_fname']);
$child_lname = clean($_POST['child_lname']);
$child_yakname = clean($_POST['child_yakname']);
$child_bday = clean($_POST['child_bday']);
$child_gender = clean($_POST['child_gender']);
$child_yaklogin = clean($_POST['child_yaklogin']);
$child_email = clean($_POST['child_email']);
$child_bday_date = clean($_POST['child_bday_date']);
/*
 child_fname
 child_lname
 child_yakname
 child_yaklogin
 child_bday
 child_email
 child_gender
 */

//Input Validations
//	if($name == '') {
//		$errmsg_arr[] = 'Name missing';
//		$errflag = true;
//	}
if($child_fname == '') {
	$errmsg_arr[] = 'First name missing. ';
	$errflag = true;
}
if($child_lname == '') {
	$errmsg_arr[] = 'Last name missing. ';
	$errflag = true;
}
if($child_yakname == '') {
	$errmsg_arr[] = 'Yak Screen name missing. ';
	$errflag = true;
}

if($child_yaklogin == '') {
	$errmsg_arr[] = 'Yak Login missing. ';
	$errflag = true;
}

if (!validateDate($child_bday_date)) {
	$errmsg_arr[] = 'Invalid date. ';
	$errflag = true;
}

//Check for duplicate login ID
if($login != '') {
	$qry = "SELECT * FROM users WHERE child_yaklogin='".$child_yaklogin."'";
	$result = mysql_query($qry);
	if($result) {
		if(mysql_num_rows($result) > 0) {
			$errmsg_arr[] = 'Yak login already in use';
			$errflag = true;
		}
		@mysql_free_result($result);
	}
	else {
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Check child exists query failed: ".mysql_errno($link). " ".mysql_error($link);
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
	exit();
}

//Create INSERT query
$qry = 'xxx';

if ($child_email != '')
{
	$qry = sprintf("INSERT INTO users( fname,lname,bday,is_boy,yakname,yaklogin,is_parent,parent_user_id,email)
 		VALUES('%s','%s','%s',%s,'%s','%s',false,'%s','%s')",
	$child_fname, $child_lname, $child_bday_date, $child_gender, $child_yakname,
	$child_yaklogin,$parent_user_id,$child_email);
}
else
{
	$qry = sprintf("INSERT INTO users( fname,lname,bday,is_boy,yakname,yaklogin,is_parent,parent_user_id)
 		VALUES('%s','%s','%s',%s,'%s','%s',false,'%s')",
	$child_fname, $child_lname, $child_bday_date, $child_gender, $child_yakname, $child_yaklogin,$parent_user_id);

}
$result = @mysql_query($qry);

//Check whether the query was successful or not

if($result) {
	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "Child user inserted for ".$email." Parent ID: ".$parent_user_id;
	echo json_encode($istatus);
	exit();
}else {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Insert user Query failed ".mysql_errno($link). " ".mysql_error($link) . " Query: ". $qry;
	echo json_encode($istatus);
	die();
}
?>