<?php


header('Content-Type: image/jpg');
$pack = rand(1,2);
$idx = rand(1,6);
$head = '../imgs/pack'.$pack.'_head_'.$idx.'.png';

$pack = rand(1,2);
$idx = rand(1,6);
$body =  '../imgs/pack'.$pack.'_body_'.$idx.'.png';

$pack = rand(1,2);
$idx = rand(1,6);
$xtra = '../imgs/pack'.$pack.'_extras_'.$idx.'.png';

$pack = rand(1,2);
$idx = rand(1,6);
$leg =  '../imgs/pack'.$pack.'_legs_'.$idx.'.png';

$pack = rand(1,2);
$idx = rand(1,2);
$bkgd =  '../imgs/pack'.$pack.'_bkgd_'.$idx.'.jpg';

$head_png = imagecreatefrompng($head);
list($head_width, $head_height) = getimagesize($head);

$body_png = imagecreatefrompng($body);
list($body_width, $body_height) = getimagesize($body);

$leg_png = imagecreatefrompng($leg);
list($leg_width, $leg_height) = getimagesize($leg);

$xtra_png = imagecreatefrompng($xtra);
list($xtra_width, $xtra_height) = getimagesize($xtra);


$jpeg = imagecreatefromjpeg($bkgd);
list($width, $height) = getimagesize($bkgd);

$out = imagecreatetruecolor($width, $height);

imagecopyresampled($out, $jpeg, 0, 0, 0, 0, $width, $height, $width, $height);
imagecopyresampled($out, $head_png, 170,60, 0, 0, $head_width, $head_height, $head_width, $head_height);
imagecopyresampled($out, $body_png, 170,290, 0, 0, $body_width, $body_height, $body_width, $body_height);
imagecopyresampled($out, $leg_png, 170,560, 0, 0, $leg_width, $leg_height, $leg_width, $leg_height);
imagecopyresampled($out, $xtra_png, 170,60, 0, 0, $xtra_width, $xtra_height, $xtra_width, $xtra_height);
imagejpeg($out);
imagedestroy($out);

?>