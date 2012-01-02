<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'yakbooks');
define('DB_PASSWORD', 'yakbooks');
define('DB_DATABASE', 'yakbooks');

require_once("functions.php");

// Be sure to set these!
define("BASE_URL","http://192.168.1.8:80/yakbooks/yak");
define("COOKIE_DOMAIN","192.168.1.8");

// Database Config
$database = array (
	"user"  => "yakbooks",
	"pass"  => "yakbooks",
	"host"  => "local.yakbooks.com",
	"dbname" => "yakbooks"
);

?>