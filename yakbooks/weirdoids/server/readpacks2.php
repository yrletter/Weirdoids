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

//Create query
$qry="SELECT f.packfamilyid, f.name AS familyname, f.description AS familydesc,
f.listorder AS familylistorder, 
p.packid, p.name as packname, p.heading1, p.heading2, 
p.cost_str, p.cost,p.listorder as packlistorder, p.thumbnail, p.manifest
FROM book b, packfamily f, pack p
WHERE b.bookid = f.bookid
AND p.packfamilyid = f.packfamilyid
order by f.listorder, p.listorder";
$result=mysql_query($qry);


if (!$result) {
	//echo "Could not successfully run query ($qry) from DB: " . mysql_error();
	if (mysql_error($link)) {
		//Login failed
		//header("location: login-failed.php");
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Error: Reading packlist failed ".mysql_errno($link). " ".mysql_error($link);
		echo json_encode($istatus);
		die();
	} else {
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Unknown error.";
		echo json_encode($istatus);
		die();
	}
}

if (mysql_num_rows($result) == 0) {
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Packlist not found.";
		echo json_encode($istatus);
		die();
	}
//Check whether the query was successful or not


$curr_family = '';
$family = array();
$families = array();

$first_row = 1;
while ($row = mysql_fetch_assoc($result)) {
	$pack = array();

	if ($curr_family != $row["packfamilyid"])
	{

		if (!$first_row)
		{
			// done with this family, push it and start new
			array_push($families, $family);
			$family = array();

		}
			
		//start new family object
		$family['familyid'] = $row["packfamilyid"];
		$family['familyname'] = $row["familyname"];
		$family['familydesc'] = $row["familydesc"];
		$family['familylistorder'] = $row["familylistorder"];
		$family['packs'] = array();

		$curr_family = $row["packfamilyid"];
	}

	$pack['id'] = $row["packid"];
	//$pack['id'] = $row["packname"];
	$pack['heading1'] = $row["heading1"];
	$pack['heading2'] = $row["heading2"];
	$pack['cost_str'] = $row["cost_str"];
	$pack['cost'] = $row["cost"];
	$pack['listorder'] = $row["packlistorder"];
	$pack['thumbnail'] = $row["thumbnail"];
	$pack['manifest'] = $row["manifest"];
	array_push($family['packs'],$pack);
	$first_row = 0;
}

// push the last family
array_push($families, $family);

$p = array('families'=> $families);

$istatus["errorcode"] = 0;
$istatus["errormsg"] = "Read packlist.";
$istatus["packlist"] = $p;
echo json_encode($istatus);

mysql_free_result($result);

mysql_close($link);

?>