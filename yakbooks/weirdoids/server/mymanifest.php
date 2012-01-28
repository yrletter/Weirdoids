<?php
header("content-type:text/cache-manifest");
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
			$cacheList[] = $path . '/' . $file;
			//print($file.'<br>');
		}
	}
};

$contentsCache = "CACHE MANIFEST\nCACHE:\nindex.html\n";
foreach($cacheList as $toCache) {
	$contentsCache .= $toCache . "\n";
}
// Write it all out.

echo($contentsCache);


?>
