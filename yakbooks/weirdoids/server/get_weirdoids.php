<?php


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

//echo 'after connect';
$db = selectDB();

//echo 'after select';

$user_id = '';
if (isset($_REQUEST['user_id']))
$user_id = clean($_REQUEST['user_id']);

//Input Validations
if($user_id == '') {
	$errmsg_arr[] = 'User ID is missing';
	$errflag = true;
}

//If there are input validations, redirect back to the login form
if($errflag) {
	$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
	session_write_close();
	$istatus["errorcode"] = -1;
	$istatus["errormsg"] = "validation error";
	$istatus["errmsg_arr"] = $errmsg_arr;
	echo json_encode($istatus);
	die();
}

$qry=sprintf("SELECT w.user_id, w.user_weirdoid_id, fname, lname, s.weirdoid_sprite_id, xloc, yloc, width, height, zindex, topoffset, src, cyclename
FROM user_weirdoid w, weirdoid_sprite s
WHERE user_id = %d
AND w.user_weirdoid_id = s.user_weirdoid_id 
ORDER BY w.user_id, w.user_weirdoid_id, s.cyclename", $user_id);

//echo $qry;

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
		$istatus["errormsg"] = "Unknown error reading weirdoids: Pack#: ".$packfamilyid.' Cycle#: '.$weirdoidid;
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

while ($row = mysql_fetch_assoc($result)) {
	$sprite = array();

	if ($curr_weirdoid != $row["user_weirdoid_id"])
	{

		if (!$first_row)
		{
			// done with this cycle, start new
			array_push($weirdoids,$weirdoid);
			$weirdoid = array();

		}

		$weirdoid['user_weirdoid_id'] = $row["user_weirdoid_id"];
		$weirdoid['fname'] = $row["fname"];
		$weirdoid['lname'] = $row["lname"];
		$weirdoid['eastereggs'] = array();

		$curr_weirdoid = $row["user_weirdoid_id"];

		//echo $weirdoid['divname']."<br>";
	}

	// each row is new cycle and sprite
	$cycle_name = $row["cyclename"];
	$weirdoid[$cycle_name]["topoffset"] = $row["topoffset"];

	$weirdoid_sprite_id =  $row["weirdoid_sprite_id"];
	$sprite = array();

	$sprite['xloc'] = $row["xloc"];
	$sprite['yloc'] = $row["yloc"];
	$sprite['width'] = $row["width"];
	$sprite['height'] = $row["height"];
	$sprite['zindex'] = $row["zindex"];
	$sprite['src'] = $row["src"];
	$weirdoid[$cycle_name]["sprite"] = $sprite;

	$first_row = 0;
}
//echo 'get eastereggs';

// get any eastereggs

// push the last row
array_push($weirdoids,$weirdoid);
$tmp = array();

// get any eastereggs
foreach ($weirdoids as $weirdoid)
{
	$uwid = $weirdoid['user_weirdoid_id'];
	$qry=sprintf("SELECT egg_id, top_pct, left_pct, height_pct, width_pct, show_pct, easteregg_id, divname, src, location_class
	FROM weirdoid_easteregg e
	WHERE e.user_weirdoid_id = %d
	ORDER BY egg_id", $uwid);

	//echo $sql;



	$result=mysql_query($qry);

	if (!$result) {
		if (mysql_error($link)) {
			// failed
			//header("location: login-failed.php");
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Error: Reading weirdoid eastereggs failed ".mysql_errno($link). " ".mysql_error($link);
			echo json_encode($istatus);
			die();
		} else {
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Unknown error reading weirdoid eastereggs: uwid ".$uwid;
			echo json_encode($istatus);
			die();
		}
	}

	$eggs = array();
	while ($row = mysql_fetch_assoc($result)) {
		$egg = array();
		$egg['egg_id'] = $row["egg_id"];
		$egg['top_pct'] = $row["top_pct"];
		$egg['left_pct'] = $row["left_pct"];
		$egg['height_pct'] = $row["height_pct"];
		$egg['show_pct'] = $row["show_pct"];
		$egg['width_pct'] = $row["width_pct"];
		$egg['easteregg_id'] = $row["easteregg_id"];
		$egg['divname'] = $row["divname"];
		$egg['src'] = $row["src"];
		$egg['location_class'] = $row["location_class"];

		array_push($weirdoid['eastereggs'],$egg);
	}
	array_push($tmp,$weirdoid);
	//var_dump($weirdoid);
}
//var_dump($tmp);

$istatus["errorcode"] = 0;
$istatus["errormsg"] = "Found user";
$istatus["weirdoids"] = $tmp;
echo json_encode($istatus);

mysql_free_result($result);

mysql_close($link);

?>