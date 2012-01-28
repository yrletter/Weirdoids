<?php
function clean($elem)
{
	if(!is_array($elem))
	$elem = htmlentities($elem,ENT_QUOTES,"UTF-8");
	else
	foreach ($elem as $key => $value)
	$elem[$key] = $this->clean($value);
	return $elem;
}

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

$cycleid = 2;
$packfamilyid = 1;
//echo $_GET["cycleid"];
//echo  'req ' . $_REQUEST["cycleid"];

if(isset($_REQUEST["cycleid"]))
{
	//echo 'found '. $_GET["cycleid"];
	$cycleid = $_REQUEST["cycleid"];

}
if(isset($_REQUEST["packfamilyid"]))
$packfamilyid = $_REQUEST["packfamilyid"];

//Create query
// pass in the packid
/*
 "bands": [
 {"divname":"bodies",
 "background": "imgs/pack2_char.png",
 "imagestyle" : "left:170px; overflow:hidden; position:absolute; top:240px;",
 "top": "240",
 "left": "170",
 "zindex" : 9,
 "height": "400",
 "width": "380",
 "images": [
 {"text":"body_1", "width":380, "height":400, "x":0, "y":300},
 {"text":"body_2", "width":380, "height":400, "x":380, "y":300},
 {"text":"body_3", "width":380, "height":400, "x":760, "y":300},
 {"text":"body_4", "width":380, "height":400, "x":1140, "y":300},
 {"text":"body_5", "width":380, "height":400, "x":1520, "y":300},
 {"text":"body_6", "width":380, "height":400, "x":1900, "y":300}
 ]
 */

$qry="select c.name as divname,
ct.top, ct.leftx as 'left',
ct.height, ct.width,
ct.zindex, ci.src, ci.cycleimageid, i.dataurl
 from  cycle c,  cycle_types ct, cycle_image ci, weirdoids_images i
where c.cycletypeid = ct.cycletypeid
and ct.cycletypeid = c.cycletypeid
and c.packid = '%s'
and ct.packfamilyid = '%s'
and ci.cycleid = c.cycleid
and i.src = ci.src
order by c.cycleid, ci.listorder ;";


$sql = sprintf($qry, mysql_real_escape_string($cycleid), mysql_real_escape_string($packfamilyid));

//echo $sql;

$result=mysql_query($sql);

if (!$result) {
	if (mysql_error($link)) {
		//Login failed
		//header("location: login-failed.php");
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Error: Reading packlist failed ".mysql_errno($link). " ".mysql_error($link);
		echo json_encode($istatus);
		die();
	} else {
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Unknown error reading cycles: Pack#: ".$packfamilyid.' Cycle#: '.$cycleid;
		echo json_encode($istatus);
		die();
	}
}

if (mysql_num_rows($result) == 0) {
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "No data found for cycles: Pack#: ".$packfamilyid.' Cycle#: '.$cycleid;
		echo json_encode($istatus);
		die();
	}
//Check whether the query was successful or not


$curr_cycle = '';
$cycle = $cycles = array();
$first_row = 1;
while ($row = mysql_fetch_assoc($result)) {
	$image = array();

	if ($curr_cycle != $row["divname"])
	{

		if (!$first_row)
		{
			// done with this cycle, start new
			array_push($cycles,$cycle);
			$cycle = array();

		}
		$cycle['divname'] = $row["divname"];
		$cycle['left'] = $row["left"];
		$cycle['height'] = $row["height"];
		$cycle['width'] = $row["width"];
		$cycle['top'] = $row["top"];
		$cycle['zindex'] = $row["zindex"];
		$cycle['images'] = array();

		$curr_cycle = $row["divname"];
		//echo $cycle['divname']."<br>";
	}

	$image['id'] = $row["cycleimageid"];
	//$image['id'] = $row["packname"];
	$image['src'] = "imgs/".$row["src"];
	$image['dataurl'] = " ";//$row["dataurl"];
	//echo $image['src']."<br>";
	array_push($cycle['images'],$image);
	$first_row = 0;
}

// push the last row
array_push($cycles,$cycle);

$p = array('bands'=> $cycles);
$istatus["errorcode"] = 0;
$istatus["errormsg"] = "Found user";
$istatus["bands"] = $p;
echo json_encode($istatus);

mysql_free_result($result);

mysql_close($link);

?>