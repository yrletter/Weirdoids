<?php

function __autoload($name){
	require_once LIB_DIR.'/controllers/'.strtolower($name).'.php';
}

function return_to($location){
	$location = BASE_URL.'#'.$location;
	header("Location: $location");
	exit();
}

function login_required(){
	global $user, $template;
	if(!$user->is_logged){
		$template->set_msg("You must be logged in to access this section.",false);
		User::login();
		exit();
	}
}

/**
 *
 * Validate a date
 *
 * @param    string    $date
 * @param    string    format
 * @return    bool
 *
 */
function validateDate( $date, $format='YYYY-MM-DD')
{
	switch( $format )
	{
		case 'YYYY/MM/DD':
		case 'YYYY-MM-DD':
			list( $y, $m, $d ) = preg_split( '/[-\.\/ ]/', $date );
			break;

		case 'YYYY/DD/MM':
		case 'YYYY-DD-MM':
			list( $y, $d, $m ) = preg_split( '/[-\.\/ ]/', $date );
			break;

		case 'DD-MM-YYYY':
		case 'DD/MM/YYYY':
			list( $d, $m, $y ) = preg_split( '/[-\.\/ ]/', $date );
			break;

		case 'MM-DD-YYYY':
		case 'MM/DD/YYYY':
			list( $m, $d, $y ) = preg_split( '/[-\.\/ ]/', $date );
			break;

		case 'YYYYMMDD':
			$y = substr( $date, 0, 4 );
			$m = substr( $date, 4, 2 );
			$d = substr( $date, 6, 2 );
			break;

		case 'YYYYDDMM':
			$y = substr( $date, 0, 4 );
			$d = substr( $date, 4, 2 );
			$m = substr( $date, 6, 2 );
			break;

		default:
			throw new Exception( "Invalid Date Format" );
	}
	return checkdate( $m, $d, $y );
}

?>