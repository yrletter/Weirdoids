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

$cycleid = 1;
$packfamilyid = 1;
$packfile = '../imgs/p1_bands.txt';

//echo $_GET["cycleid"];
//echo  'req ' . $_REQUEST["cycleid"];

if(isset($_REQUEST["cycleid"]))
{
	//echo 'found '. $_GET["cycleid"];
	$cycleid = $_REQUEST["cycleid"];

}
if(isset($_REQUEST["packfamilyid"])) {
	$packfamilyid = $_REQUEST["packfamilyid"];
}

if(isset($_REQUEST["packfile"])) {
	$packfile = $_REQUEST["packfile"];
}
header('Content-Type: application/json');

try {


	$bands = file_get_contents($packfile);
	if ($bands == FALSE)
	throw new Exception("Could not read bands");

	$parsedText = str_replace(chr(10), "", $bands);
	$parsedText = str_replace('\"', '"', $parsedText);
	$parsedText = str_replace(chr(9), "", $parsedText);
	//$bands = str_replace(chr(13), "", $parsedText);
	
	$nuband = "imgs/p".$cycleid;
	
	$parsedText = preg_replace('/imgs\/p1/', $nuband, $parsedText);
	
	$bands = preg_replace('/\s\s+/', ' ', $parsedText);
	//echo $bands;

	echo $bands;
	//$istatus["errorcode"] = 0;
	//$istatus["errormsg"] = "Pack band details found.";
	//$istatus["bands"]	= $bands;
	//echo json_encode($istatus);
	exit();
}
catch (Exception $e)
{

	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Exception reading bands: " .  $e->getMessage();
	echo json_encode($istatus);
	die();

}
//Check whether the query was successful or not

?>