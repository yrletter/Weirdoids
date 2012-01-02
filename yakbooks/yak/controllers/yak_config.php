<?php
define('DB_HOST', 'internal-db.s124068.gridserver.com');
define('DB_USER', 'db124068_yak');
define('DB_PASSWORD', 'Shoestring4');
define('DB_DATABASE', 'db124068_yakbooks');

require_once("functions.php");

// Be sure to set these!
define("BASE_URL","http://192.168.1.8:80/yakbooks/yak");
define("COOKIE_DOMAIN","192.168.1.8");

// Database Config
$database = array (
	"user"  => "db124068_yak",
	"pass"  => "Shoestring4",
	"host"  => "internal-db.s124068.gridserver.com",
	"dbname" => "db124068_yakbooks"
);

?>