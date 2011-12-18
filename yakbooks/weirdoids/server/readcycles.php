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

$cycleid = 1;
$packfamilyid = 1;

if(isset($_REQUEST["cycleid"]))
	$cyleid = $_REQUEST["cycleid"];
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
and i.cycleimageid = ci.cycleimageid
order by c.cycleid, ci.listorder ;";


$sql = sprintf($qry, mysql_real_escape_string($cycleid), mysql_real_escape_string($packfamilyid));

$result=mysql_query($sql);

if (!$result) {
	echo "Could not successfully run query ($qry) from DB: " . mysql_error();
	exit;
}

if (mysql_num_rows($result) == 0) {
	echo "No rows found, nothing to print so am exiting";
	exit;
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
	$image['dataurl'] = $row["dataurl"];
	//echo $image['src']."<br>";
	array_push($cycle['images'],$image);
	$first_row = 0;
}

// push the last row
array_push($cycles,$cycle);

$p = array('bands'=> $cycles);

echo json_encode($p);

mysql_free_result($result);

mysql_close($link);

?>