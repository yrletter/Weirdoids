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


	$bands = file_get_contents('../imgs/p1_bands.txt');
	if ($bands == FALSE)
		throw new Exception("Could not read bands");

	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "Pack band details found.";
	$istatus["bands"]	= $bands;
	echo json_encode($istatus);
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