<?php


//Start session
session_start();

//Array to store validation errors
$errmsg_arr = array();
$istatus = array();

header('Content-Type: application/json');

function listdir_by_date($path){
	$dir = opendir($path);
	$list = array();
	while($file = readdir($dir)){
		if ($file != '.' and $file != '..'){
			// add the filename, to be sure not to
			// overwrite a array key

			$url = $path . $file;
			$ddiff =  ((TIME() - FILECTIME($url))/86400);

			$ctime = filectime($path . $file) . ',' . $file;
			$attr = array();
			$attr["url"] = substr($url,3);
			$attr["daysago"] = floor($ddiff);
			$attr["hrsago"] = floor(($ddiff - floor($ddiff))*3600/24);
			$attr["minsago"] = floor(($ddiff - floor($ddiff))*86400/3600);
			$list[$ctime] = $attr;
		}
	}
	closedir($dir);
	krsort($list);
	return $list;
}

$file = '*.jpg';
$dir = '../user_images/';

$sorted_array = listdir_by_date($dir);

//echo 'list 1 <br>';
//foreach ($sorted_array as $f)
//echo $f.'<br>';
$istatus["errorcode"] = 0;
$istatus["errormsg"] = "Found images";
$istatus["gallery"] = array_slice(array_values($sorted_array),0,10);
echo json_encode($istatus);

?>