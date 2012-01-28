<?php




$needfile = true;
while ($needfile) {
	$pack = rand(1,6);
	$idx = rand(1,6);
	$head = '../imgs/p'.$pack.'_head_'.$idx.'.png';
	if (file_exists($head))
	{
		$needfile = false;
	}
}

$needfile = true;
while ($needfile) {
	$pack = rand(1,6);
	$idx = rand(1,6);
	$body =  '../imgs/p'.$pack.'_body_'.$idx.'.png';
	if (file_exists($body))
	{
		$needfile = false;
	}
}


$pack = rand(1,6);
$idx = rand(1,6);
$xtra = '../imgs/p'.$pack.'_extra_'.$idx.'.png';
$haveextra = file_exists($xtra);


$needfile = true;
while ($needfile) {
	$pack = rand(1,6);
	$idx = rand(1,6);
	$leg =  '../imgs/p'.$pack.'_legs_'.$idx.'.png';
	if (file_exists($leg))
	{
		$needfile = false;
	}
}

$needfile = true;
while ($needfile) {
	$pack = rand(1,6);
	$idx = rand(1,2);
	$bkgd =  '../imgs/p'.$pack.'_bkgd_'.$idx.'.jpg';
	if (file_exists($bkgd))
	{
		$needfile = false;
	}
}

$head_png = imagecreatefrompng($head);
list($head_width, $head_height) = getimagesize($head);

$body_png = imagecreatefrompng($body);
list($body_width, $body_height) = getimagesize($body);

$leg_png = imagecreatefrompng($leg);
list($leg_width, $leg_height) = getimagesize($leg);

if ($haveextra)
{
$xtra_png = imagecreatefrompng($xtra);
list($xtra_width, $xtra_height) = getimagesize($xtra);
}



$jpeg = imagecreatefromjpeg($bkgd);
list($width, $height) = getimagesize($bkgd);

$out = imagecreatetruecolor($width, $height);

imagecopyresampled($out, $jpeg, 0, 0, 0, 0, $width, $height, $width, $height);
imagecopyresampled($out, $leg_png, 34,510, 0, 0, $leg_width, $leg_height, $leg_width, $leg_height);
imagecopyresampled($out, $body_png, 34,150, 0, 0, $body_width, $body_height, $body_width, $body_height);
imagecopyresampled($out, $head_png, 159,00, 0, 0, $head_width, $head_height, $head_width, $head_height);
if ($haveextra)
imagecopyresampled($out, $xtra_png, 134,20, 0, 0, $xtra_width, $xtra_height, $xtra_width, $xtra_height);

//header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
//header('Pragma: no-cache'); // HTTP 1.0.
//header('Expires: 0'); // Proxies.
header('Content-Type: image/jpg');
imagejpeg($out);
?>