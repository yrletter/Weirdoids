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

// Make sure session exists, user is logged in, we have parent state address
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
$parent_fname = clean($_POST['parent_fname']);
$parent_lname = clean($_POST['parent_lname']);
$parent_phone = clean($_POST['parent_phone']);
$parent_bday = clean($_POST['parent_bday']);
$parent_address1 = clean($_POST['parent_address1']);
$parent_city = clean($_POST['parent_city']);
$parent_state = clean($_POST['parent_state']);
$parent_country = clean($_POST['parent_country']);
$parent_postal = clean($_POST['parent_postal']);
$parent_cc_type = clean($_POST['parent_cc_type']);
$parent_cc_number = clean($_POST['parent_cc_number']);
$parent_cc_cvv = clean($_POST['parent_cc_cvv']);
$parent_verification_method = clean($_POST['parent_verification_method']);
$parent_cc_expiration_date = clean($_POST['parent_cc_expiration_date']);


//Input Validations
//	if($name == '') {
//		$errmsg_arr[] = 'Name missing';
//		$errflag = true;
//	}
if($parent_fname == '') {
	$errmsg_arr[] = 'First name missing. ';
	$errflag = true;
}
if($parent_lname == '') {
	$errmsg_arr[] = 'Last name missing. ';
	$errflag = true;
}
if($parent_phone == '') {
	$errmsg_arr[] = 'Phone # missing. ';
	$errflag = true;
}

if($parent_address1 == '') {
	$errmsg_arr[] = 'Address missing. ';
	$errflag = true;
}
if($parent_city == '') {
	$errmsg_arr[] = 'City missing. ';
	$errflag = true;
}
if($parent_state == '') {
	$errmsg_arr[] = 'State missing. ';
	$errflag = true;
}

if($parent_postal == '') {
	$errmsg_arr[] = 'Postal code missing. ';
	$errflag = true;
}


// if verifying with credit card
//if ($parent_verification_method == 'creditcard')
//{
	if (!validateDate($parent_cc_expiration_date)) {
		$errmsg_arr[] = 'Invalid credit card expiration date. ';
		$errflag = true;
	}
	if ($parent_cc_cvv == '') {
		$errmsg_arr[] = 'Missing credit card CVV.';
		$errflag = true;
	}
	if ($parent_cc_type = '') {
		$errmsg_arr[] = 'No credit card type specified. ';
		$errflag = true;
	}
	if ($parent_cc_number = '') {
		$errmsg_arr[] = 'No credit card number specified. ';
		$errflag = true;
	}

//}
//else
//{
//	$errmsg_arr[] = 'Invalid verification method. '.$parent_verification_method;
//	$errflag = true;
//}

//Check for existing login ID

$qry = "SELECT * FROM users WHERE email='".$email."'";
$result = mysql_query($qry);
if($result) {
	if(mysql_num_rows($result) == 0) {
		$errmsg_arr[] = 'User not in database: '.$email;
		$errflag = true;
	}
	@mysql_free_result($result);
}
else {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Check parent exists query failed: ".mysql_errno($link). " ".mysql_error($link);
	echo json_encode($istatus);
	die();
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

//Create Update query

//if ($parent_verification_method == 'creditcard')
//{
	$qry = sprintf("update users set fname = '%s' ,lname = '%s',
		mobilephoneno = '%s',address1 = '%s',city = '%s',state ='%s',
		country = '%s',postal = '%s',
		verify_method = '%s',cc_expiration_date = '%s',
		cc_cvv = '%s',cc_type = '%s',cc_number = '%s',is_verified = 0",
	$parent_fname, $parent_lname,  $parent_phone, $parent_address1,
	$parent_city,$parent_state,$parent_country,$parent_postal,
	$parent_verification_method,$parent_cc_expiration_date,$parent_cc_cvv,
	$parent_cc_type, $parent_cc_number);
//}
//else
//{
//	$qry = "xxx";

//}
$result = @mysql_query($qry);

//Check whether the query was successful or not

if (!mysql_error()) {
	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "Parent verification data updated for ".$email." Parent ID: ".$parent_user_id;
	echo json_encode($istatus);
	exit();
}else {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Parent verification data update failed ".mysql_errno($link). " ".mysql_error($link) . " Query: ". $qry;
	echo json_encode($istatus);
	die();
}
?>