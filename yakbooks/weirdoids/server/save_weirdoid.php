<?php
//Start session
session_start();

header('Content-Type: application/json');

//Include database connection details
require_once('../../yak/controllers/db_functions.php');
require_once('weirdoid.php');
require_once('weirdoid_sprite.php');

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

// make sure user exists
$qry="SELECT * FROM users WHERE user_id='$userid'";
$result=mysql_query($qry);

//Check whether the query was successful or not
if($result) {
	if(mysql_num_rows($result) == 1) {
		//Login Successful
	}else if (mysql_error($link)) {
		//Login failed
		//header("location: login-failed.php");
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Did not find user in database ".mysql_errno($link). " ".mysql_error($link);
		echo json_encode($istatus);
		die();
	} else
	{
		//Login failed
		//header("location: login-failed.php");
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "User does not exist: ".$userid;
		echo json_encode($istatus);
		die();
	}
}else if (mysql_error($link)) {
	//Login failed
	//header("location: login-failed.php");
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Error: Find user failed ".mysql_errno($link). " ".mysql_error($link);
	echo json_encode($istatus);
	die();
} else {
	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Find user error: ".$userid;
	echo json_encode($istatus);
	die();
}

// store the weirdoid and each sprite
$weirdoid = new Weirdoid();
$weirdoid->fname = clean($obj->fname);
$weirdoid->lname = clean($obj->lname);

// create each sprite/element
$head = new WeirdoidSprite();
//$head->zindex = clean($obj->head->zindex);
$head->cyclename = "head";

$head->topoffset = clean($obj->head->topoffset);
$head->src = clean($obj->head->sprite->src);
$head->xloc = clean($obj->head->sprite->xloc);
$head->yloc = clean($obj->head->sprite->yloc);
$head->width = clean($obj->head->sprite->width);
$head->height = clean($obj->head->sprite->height);

$body = new WeirdoidSprite();
$body->cyclename = "body";
$body->topoffset = clean($obj->body->topoffset);
$body->src = clean($obj->body->sprite->src);
$body->xloc = clean($obj->body->sprite->xloc);
$body->yloc = clean($obj->body->sprite->yloc);
$body->width = clean($obj->body->sprite->width);
$body->height = clean($obj->body->sprite->height);

$leg = new WeirdoidSprite();
$leg->cyclename = "leg";
$leg->topoffset = clean($obj->leg->topoffset);
$leg->src = clean($obj->leg->sprite->src);
$leg->xloc = clean($obj->leg->sprite->xloc);
$leg->yloc = clean($obj->leg->sprite->yloc);
$leg->width = clean($obj->leg->sprite->width);
$leg->height = clean($obj->leg->sprite->height);

$xtra = new WeirdoidSprite();
$xtra->cyclename = "xtra";
$xtra->topoffset = clean($obj->xtra->topoffset);
$xtra->src = clean($obj->xtra->sprite->src);
$xtra->xloc = clean($obj->xtra->sprite->xloc);
$xtra->yloc = clean($obj->xtra->sprite->yloc);
$xtra->width = clean($obj->xtra->sprite->width);
$xtra->height = clean($obj->xtra->sprite->height);

$bkgd = new WeirdoidSprite();
$bkgd->cyclename = "bkgd";
$bkgd->topoffset = clean($obj->bkgd->topoffset);
$bkgd->src = clean($obj->bkgd->sprite->src);
$bkgd->xloc = clean($obj->bkgd->sprite->xloc);
$bkgd->yloc = clean($obj->bkgd->sprite->yloc);
$bkgd->width = clean($obj->bkgd->sprite->width);
$bkgd->height = clean($obj->bkgd->sprite->height);

//echo("head src = " + $head->src);
$elements = array($head, $body, $leg, $xtra, $bkgd);

try {
	mysql_query('SET AUTOCOMMIT=0');
	mysql_query('START TRANSACTION');

	// first insert weirdoid, then sprites
	$qry = sprintf("insert into user_weirdoid (user_id, fname, lname) values (%s, '%s', '%s')",
	mysql_real_escape_string($userid),
	mysql_real_escape_string($weirdoid->fname),
	mysql_real_escape_string($weirdoid->lname));

	$result = mysql_query($qry);

	$user_weirdoid_id = -1;

	if (!$result) {
		//echo "Could not successfully run query ($qry) from DB: " . mysql_error();
		if (mysql_error($link)) {
			//Login failed
			//header("location: login-failed.php");
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Error: Insert user_weirdoid failed ".mysql_errno($link). " ".mysql_error($link);
			echo json_encode($istatus);
			throw new Exception($istatus["errormsg"]);
		} else {
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Unknown error.";
			echo json_encode($istatus);
			throw new Exception($istatus["errormsg"]);
		}
	}
	else
	{
		$user_weirdoid_id = mysql_insert_id();
	}

	// iterate through elements
	foreach ($elements as $sprite)
	{
		// first insert weirdoid, then sprites
		// TODO ADD zindex
		$qry = sprintf("insert into weirdoid_sprite (user_weirdoid_id,xloc,yloc,width,height,topoffset,src,cyclename) values (%s,%s,%s,%s,%s,%s, '%s', '%s')",
		mysql_real_escape_string($user_weirdoid_id),
		mysql_real_escape_string($sprite->xloc),
		mysql_real_escape_string($sprite->yloc),
		mysql_real_escape_string($sprite->width),
		mysql_real_escape_string($sprite->height),
		mysql_real_escape_string($sprite->topoffset),
		mysql_real_escape_string($sprite->src),
		mysql_real_escape_string($sprite->cyclename));

		$result = mysql_query($qry);

		if (!$result) {
			//echo "Could not successfully run query ($qry) from DB: " . mysql_error();
			if (mysql_error($link)) {
				//Login failed
				//header("location: login-failed.php");
				$istatus["errorcode"] = 1;
				$istatus["errormsg"] = "Error: insert weirdoid_sprite failed ".mysql_errno($link). " ".mysql_error($link);
				echo json_encode($istatus);
				throw new Exception($istatus["errormsg"]);
				
			} else {
				$istatus["errorcode"] = 1;
				$istatus["errormsg"] = "Unknown error.";
				echo json_encode($istatus);
				throw new Exception($istatus["errormsg"]);
			}
		}
		else
		{
			//echo("save sprite for ". $sprite->cyclename);
			//echo("last weirdoid_sprite id = " . mysql_insert_id());
		}

	}

	mysql_query('COMMIT');
	mysql_query('SET AUTOCOMMIT=1');

	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "Stored weirdoid.";
	$istatus["user_weirdoid_id"] = $user_weirdoid_id;
	echo json_encode($istatus);

	mysql_close($link);
} catch (Exception $e) {
	// An exception has been thrown
	// We must rollback the transaction
	mysql_query('ROLLBACK');//nothing will be done, I assume it's for testing

	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Exception: Transaction failed: ".mysql_errno($link). " ".mysql_error($link);
	echo json_encode($istatus);
	die();
}


?>