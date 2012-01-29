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

try {


	$catalog = file_get_contents('../imgs/catalog_1.txt');
	if ($catalog == FALSE)
		throw new Exception("Could not read catalog");

	$parsedText = str_replace(chr(10), "", $catalog);
	$parsedText = str_replace('\"', '"', $parsedText);
	$parsedText = str_replace(chr(9), "", $parsedText);
		//$bands = str_replace(chr(13), "", $parsedText);
		$catalog = preg_replace('/\s\s+/', ' ', $parsedText);
	//echo $bands;
	
	echo $catalog;	
	exit();
}
catch (Exception $e)
{

	$istatus["errorcode"] = 1;
	$istatus["errormsg"] = "Exception reading catalog: " .  $e->getMessage();
	echo json_encode($istatus);
	die();

}
//Check whether the query was successful or not

?>