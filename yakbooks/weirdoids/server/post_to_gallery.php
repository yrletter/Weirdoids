<?php
//Start session
session_start();

//Include database connection details
//Include database connection details
require_once('../../yak/controllers/db_functions.php');
require_once('weirdoid.php');
require_once('weirdoid_sprite.php');

header('Content-Type: application/json');

//Array to store validation errors
$errmsg_arr = array();
$istatus = array();

//Validation error flag
$errflag = false;

//Connect to mysql server, sets $link and $db, dies on error
// uses $errflag, $istatus, $errmsg_arr
$link = connectToDB();
$db = selectDB();

//Sanitize the POST values
$json = clean($_POST['data']);

//Extract info from json
$obj=json_decode(stripslashes($json));
//var_dump($obj);

$userid = clean($obj->userid);
$user_weirdoid_id = clean($obj->user_weirdoid_id);
//$user_weirdoid_id = 16;

// make sure user exists
$qry= sprintf("SELECT uw.user_weirdoid_id, fname, lname,
xloc, yloc, width, height, zindex, topoffset, src, cyclename
 FROM `user_weirdoid` uw, 
weirdoid_sprite ws
WHERE user_id = %s and ws.user_weirdoid_id = %s
and uw.user_weirdoid_id = ws.user_weirdoid_id", $userid, $user_weirdoid_id );

$result=mysql_query($qry);

//Check whether the query was successful or not
if($result) {
	if(mysql_num_rows($result) > 0) {
		//Login Successful
	}else if (mysql_error($link)) {
		//Login failed
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Did not find Weirdoid for user in database ".mysql_errno($link). " ".mysql_error($link);
		echo json_encode($istatus);
		die();
	} else
	{
		// failed
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Weirdoid for user does not exist: ".$userid;
		echo json_encode($istatus);
		die();
	}
}else if (mysql_error($link)) {
	//Login failed
	//header("location: login-failed.php");
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Error: Find user Weirdoid failed ".mysql_errno($link). " ".mysql_error($link);
	echo json_encode($istatus);
	die();
} else {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Find user Weirdoid error: ".$userid;
	echo json_encode($istatus);
	die();
}


// update gallery post value
$qry= sprintf("update user_weirdoid set isPosted = 1 WHERE user_weirdoid_id = %s",  $user_weirdoid_id );

$result = mysql_query($qry);

if (!mysql_error()) {
	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "Posted the weirdoid to the gallery";
	echo json_encode($istatus);
	exit();
}else {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Update of posted flag failed ".mysql_errno($link). " ".mysql_error($link) . " Query: ". $qry;
	echo json_encode($istatus);
	die();
}
?>