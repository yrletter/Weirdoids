<?php
//Start session
session_start();

//Include database connection details
require_once('config.php');

//Array to store validation errors
$errmsg_arr = array();

//Validation error flag
$errflag = false;

//Connect to mysql server
$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
if(!$link) {
	die('Failed to connect to server: ' . mysql_error());
}

//Select database
$db = mysql_select_db(DB_DATABASE);
if(!$db) {
	die("Unable to select database");
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
	echo mysql_errno($link)." ". mysql_error($link);
	exit;
}

if (mysql_num_rows($result) == 0) {
	echo "No rows found, nothing to print so am exiting";
	exit;
}
//Check whether the query was successful or not


$curr_family = '';
$family = array();
$first_row = 1;
while ($row = mysql_fetch_assoc($result)) {
	$pack = array();
	
	if ($curr_family != $row["packfamilyid"])
	{

		 if (!$first_row) 
		 {
		 	// done with this family, start new
		 	$pack = array();
		 	
		 }
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

$p = array('packs'=> $family['packs']);

header('Content-Type: application/json');

echo json_encode($p);

mysql_free_result($result);

mysql_close($link);

?>