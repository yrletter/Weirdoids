<?php


function drawImage($imgname, $jpeg,$head_png,$body_png, $leg_png,$xtra_png,$jpeg,$bkgd_width, $bkgd_height, $head_width, $head_height,$body_width, $body_height,$leg_height, $leg_width,$xtra_width, $xtra_height)
{
	//echo 'drawing ' . $imgname . '<br>';
	if (file_exists ( $imgname))
	{
		// already exists
		//echo 'found ' . $imgname . '<br>';
		return;
	}

	try {
		$out = imagecreatetruecolor($bkgd_width, $bkgd_height);

		imagecopyresampled($out, $jpeg, 0, 0, 0, 0, $bkgd_width, $bkgd_height, $bkgd_width, $bkgd_height);
		imagecopyresampled($out, $head_png, 159,00, 0, 0, $head_width, $head_height, $head_width, $head_height);
		imagecopyresampled($out, $body_png, 34,150, 0, 0, $body_width, $body_height, $body_width, $body_height);
		imagecopyresampled($out, $leg_png, 34,510, 0, 0, $leg_width, $leg_height, $leg_width, $leg_height);
		imagecopyresampled($out, $xtra_png, 134,20, 0, 0, $xtra_width, $xtra_height, $xtra_width, $xtra_height);
		imagejpeg($out, $imgname,100);
		//header('Content-Type: image/jpg');

		//imagejpeg($out);
		imagedestroy($out);
		//echo 'created ' . $imgname . '<br>';
		// success
		//$istatus["errorcode"] = 0;
		//$istatus["errormsg"] = "Created User Weirdoid Image!";
		//$istatus["serverUrl"] = $serverUrl;
		//echo json_encode($istatus);
		//exit;
	}
	catch (Exception $e)
	{
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Exception caught writing images (phase 2): ". $e->getMessage();
		echo json_encode($istatus);
		die();
	}
}


//Start session
session_start();

header('Content-Type: application/json');

//Include database connection details
require_once('../../yak/controllers/db_functions.php');

//Array to store validation errors
$errmsg_arr = array();
$istatus = array();

//Validation error flag
$errflag = false;

//Connect to mysql server, sets $link and $db, dies on error
// uses $errflag, $istatus, $errmsg_arr
$link = connectToDB();
$db = selectDB();

//$past = mktime() -  (86400 * 10);

$qry=sprintf("SELECT w.user_id, yaklogin, w.user_weirdoid_id, w.fname,
	w.lname, s.weirdoid_sprite_id, xloc, yloc, width, height, zindex, topoffset, src, cyclename,
	w.created, unix_timestamp(w.created) as unix_created, unix_timestamp(now()) as unix_now
	FROM user_weirdoid w, weirdoid_sprite s, users u
	WHERE  w.user_weirdoid_id = s.user_weirdoid_id and unix_timestamp(w.created) > (unix_timestamp(now())-(86400*12))
	and u.user_id = w.user_id
	ORDER BY w.created desc, w.user_weirdoid_id, s.cyclename");

//echo $sql;

$result=mysql_query($qry);

if (!$result) {
	if (mysql_error($link)) {
		// failed
		//header("location: login-failed.php");
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Error: Reading weirdoids failed ".mysql_errno($link). " ".mysql_error($link);
		echo json_encode($istatus);
		die();
	} else {
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Unknown error reading weirdoids";
		echo json_encode($istatus);
		die();
	}
}

if (mysql_num_rows($result) == 0) {
	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "No data found for user";
	echo json_encode($istatus);
	die();
}
//Check whether the query was successful or not


$curr_weirdoid = '';
$weirdoid = $weirdoids = array();
$sprite = $sprites = array();
$curr_weirdoid_sprite_id = -1;

$first_row = 1;
$first_sprite = true;



// create images if necessary


//$serverUrl = "http://yrcreative.com/clients/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";

$first_row = true;
$lastid = 0;
$imgs = array();


while ($row = mysql_fetch_assoc($result)) {
	//echo 'toploop<br>';
	$user_weirdoid_id = $row["user_weirdoid_id"];

	$active_imgname = "../user_images/".$lastid.".jpg";
	$imgname = "../user_images/".$user_weirdoid_id.".jpg";
	//$serverUrl = "http://yrcreative.com/clients/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";
	//$serverUrl = "http://yak.com/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";


	if ($first_row)
	{
		$fname = $row["fname"];
		$lname = $row["lname"];
	}

	//echo 'lastid '.$lastid.' user_weirdoid_id '. $user_weirdoid_id. '<br>';



	if ($lastid > 0 && $lastid != $user_weirdoid_id)
	{
		// add this

		$img = array();
		$img["url"] = substr($active_imgname,3);
		$img["fname"] = $lastfname;
		$img["lname"] = $lastlname;
		$img["yaklogin"] = $lastlogin;
		$img["daysago"] = floor($ddiff);
		$img["hrsago"] = floor(($ddiff - floor($ddiff))*86400/3600);
		$img["minsago"] = floor(($ddiff - floor($ddiff))*86400/60);
		array_push($imgs, $img);

		// draw image
		if (!file_exists ( $active_imgname))
		{
			// already exists
			//echo 'did not find ' . $active_imgname . '<br>';
			drawImage($active_imgname, $jpeg,$head_png,$body_png, $leg_png,$xtra_png,$jpeg,
			$bkgd_width, $bkgd_height, $head_width, $head_height,$body_width, $body_height,$leg_height, $leg_width,$xtra_width, $xtra_height);

		}
	}
	//reset variables
	$lastfname = $row["fname"];
	$lastlname = $row["lname"];
	$lastlogin = $row["yaklogin"];
	$lastcreated = $row["unix_created"];
	$lastnow = $row["unix_now"];
	$ddiff =  (($lastnow - $lastcreated)/86400);


	if (file_exists ( $imgname))
	{
		// already exists
		//echo 'found ' . $imgname . '<br>';
		$lastid = $user_weirdoid_id;
		continue;
	}

	$lastid = $user_weirdoid_id;

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

if ($lastid > 0)
{
	$img = array();
	$img["url"] = substr($active_imgname,3);
	$img["fname"] = $lastfname;
	$img["lname"] = $lastlname;
	$img["yaklogin"] = $lastlogin;
	$img["daysago"] = floor($ddiff);
	$img["hrsago"] = floor(($ddiff - floor($ddiff))*3600/24);
	$img["minsago"] = floor(($ddiff - floor($ddiff))*86400/3600);
	array_push($imgs, $img);

	// draw image
	if (!file_exists ( $active_imgname))
	{
		// already exists
		//echo 'did not find ' . $active_imgname . '<br>';
		drawImage($imgname, $jpeg,$head_png,$body_png, $leg_png,$xtra_png,$jpeg,
		$bkgd_width, $bkgd_height, $head_width, $head_height,$body_width, $body_height,$leg_height, $leg_width,$xtra_width, $xtra_height);
	};
}

$istatus["errorcode"] = 0;
$istatus["errormsg"] = "Created all gallery images";
$istatus["gallery"] = $imgs;
echo json_encode($istatus);

mysql_free_result($result);

mysql_close($link);



?>