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


// SELECT uw.user_weirdoid_id, fname, lname,
// xloc, yloc, width, height, zindex, topoffset, src, cyclename

 $path = $_SERVER['DOCUMENT_ROOT'];

$serverUrl = "http://yrcreative.com/clients/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";

//$serverUrl = "http://yrcreative.com/clients/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";
$imgname = "../user_images/".$user_weirdoid_id.".jpg";
if (file_exists ( $imgname))
{
	// already exists
	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "User weirdodid image already exists.";
	$istatus["serverUrl"] = $serverUrl;
//	echo json_encode($istatus);
//	return ;
}

$jpeg = null;

$first_row = true;
while ($row = mysql_fetch_assoc($result)) {
	$pack = array();

	if ($first_row)
	{
		$fname = $row["fname"];
		$lname = $row["fname"];
	}

	$cyclename =  $row["cyclename"];
	$xloc =  $row["xloc"];
	$yloc =  $row["yloc"];
	$width =  $row["width"];
	$height =  $row["height"];
	$zindex =  $row["zindex"];
	$topoffset =  $row["topoffset"];
	$src =  "../".$row["src"];
	
	try {


		switch ($cyclename)
		{
			case 'head':
				$head_png = imagecreatefrompng($src);
				list($head_width, $head_height) = getimagesize($src);
				break;
			case 'body':
				$body_png = imagecreatefrompng($src);
				list($body_width, $body_height) = getimagesize($src);
				break;
			case 'leg':
				$leg_png = imagecreatefrompng($src);
				list($leg_width, $leg_height) = getimagesize($src);
				break;
			case 'xtra':
				$xtra_png = imagecreatefrompng($src);
				list($xtra_width, $xtra_height) = getimagesize($src);
				break;
			case 'bkgd':
				$jpeg = imagecreatefromjpeg($src);
				list($bkgd_width, $bkgd_height) = getimagesize($src);
				break;
		}
	}
	catch (Exception $e)
	{
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Exception caught writing images (phase 1): ". $e->getMessage();
		echo json_encode($istatus);
		die();
	}
}

try {
	$out = imagecreatetruecolor($bkgd_width, $bkgd_width);

	imagecopyresampled($out, $jpeg, 0, 0, 0, 0, $bkgd_width, $bkgd_height, $bkgd_width, $bkgd_height);
	imagecopyresampled($out, $head_png, 170,60, 0, 0, $head_width, $head_height, $head_width, $head_height);
	imagecopyresampled($out, $body_png, 170,290, 0, 0, $body_width, $body_height, $body_width, $body_height);
	imagecopyresampled($out, $leg_png, 170,560, 0, 0, $leg_width, $leg_height, $leg_width, $leg_height);
	imagecopyresampled($out, $xtra_png, 170,60, 0, 0, $xtra_width, $xtra_height, $xtra_width, $xtra_height);
	imagejpeg($out, $imgname,100);
//header('Content-Type: image/jpg');

	//imagejpeg($out);
	imagedestroy($out);
	
	// success
	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "Created User Weirdoid Image!";
	$istatus["serverUrl"] = $serverUrl;
	echo json_encode($istatus);
	exit;
}
catch (Exception $e)
{
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Exception caught writing images (phase 2): ". $e->getMessage();
		echo json_encode($istatus);
		die();	
}

?>