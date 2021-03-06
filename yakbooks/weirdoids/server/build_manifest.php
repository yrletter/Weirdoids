<?php

// if user is logged in, build the manifest file for them

$cacheList = array();
// The directories we want to scan.
$paths = array('./imgs', './css', './script', './data');
chdir('..');

// Foreach directory, scan.
foreach($paths as $path) {
	$files = scandir($path);
	foreach($files as $file) {
		if (preg_match('/\.(jpg|png|jpeg|gif|css|js|php|txt)$/i',$file)) {
			if (!preg_match('* *', $file))
			{
				$cacheList[] = $path . '/' . $file;
				//print($file.'<br>');
			}
		}
	}
};
// Name the manifest.
$manifestFile = 'weirdoids.manifest';
$writeTo = fopen($manifestFile, 'w') or die("Error, could not create manifest.");
$contentsCache = "CACHE MANIFEST\nindex.html\nweirdoids.manifest\n";
foreach($cacheList as $toCache) {
	$contentsCache .= $toCache . "\n";
}
// Write it all out.
fwrite($writeTo, $contentsCache);

fclose($writeTo);


?>
;
