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


function emailChgPasswordRequest($login,$email,$key){
	$to = "bkeenan@rochester.rr.com";//$email;
	$subject = "Yakhq password change request";

	// the message here is HTML, but you could
	// use plain text in the same manner
	// this could also be pulled from a template file

	$data = array('key'=>$key);
	$query = http_build_query($data, '', '&amp;');
	
	$okurl = "http://yrcreative.com/clients/yakbooks/yak/controllers/chg_pwd.php".($query!=''?'?'.$query:'');
//	$rejecturl = "http://yrcreative.com/clients/yakbooks/yak/controllers/reject_chg_pwd.php".($query!=''?'?'.$query:'');
	
	$message = '
	    <html>
	    <head>
	      <title>A message from Yakhq.com, your home for Weirdoids!</title>
	    </head>
	    <body>
	    <h1>We received a request to reset your password.</h1>
	      <p>If you know made this request, then you can <a href="'.$okurl.'" > click here to change your password</a></p>
	      <p>If you did not make this request, you do not need to do anything.</p>
	      <p>Thanks, Yakhq Customer Support</p>
	      </body>
	    </html>';

	// To send HTML mail, the Content-type header must be set
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	// Additional headers
	// I'm not sure how the To: field in the header functions since it's part
	// of the function call, so I've commented it out here
	//$headers .= 'To: ' . $emailAddr . "\r\n";
	$headers .= 'From: Yak Customer Support <info@yrcreative.com>' . "\r\n";
	//$headers .= 'Cc: briankeenan03@gmail.com' . "\r\n";
	// if you want to receive a copy
	//$headers .= 'Bcc: info@yrcreative.com' . "\r\n";

	// Mail it
	try {
		$accepted =  mail($to, $subject, $message, $headers);
		if ($accepted)
		{
			//echo "mail accepted";
		}
		else
		{
			//echo "mail failed";
		}
		return $accepted;
	}
	catch (Exception $e) {
		//echo "Exception". $e->getMessage();
		die();
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
function emailValidateRequest( $userno, $login, $email)
{
	$to = "bkeenan@rochester.rr.com";//$email;
	$subject = "Please validate user registration on Yakhq.com";

	// the message here is HTML, but you could
	// use plain text in the same manner
	// this could also be pulled from a template file

	$data = array('userno'=>$userno,
              'login'=>$login);
	$query = http_build_query($data, '', '&amp;');
	$okurl = "http://yrcreative.com/clients/yakbooks/yak/controllers/verify_email.php".($query!=''?'?'.$query:'');
	$rejecturl = "http://yrcreative.com/clients/yakbooks/yak/controllers/reject_email.php".($query!=''?'?'.$query:'');
	$message = '
	    <html>
	    <head>
	      <title>Welcome to Yakhq.com, your home for Weirdoids!</title>
	    </head>
	    <body>
	    <h1>A new user has registered to use Weirodoids, from Yakhq.com</h1>
	      <p><b>'.$login.'</b> has entered your email address.</p>
	      <p>If you know this person and want them to use this email address <a href="'.$okurl.'" > click here </a></p>
	      <p>If you do not know this person or do not want them to use this email address, <a href="'.$rejecturl.'" > click here </a></p>
	      <p>Thanks, Yakhq Customer Support</p>
	      </body>
	    </html>';

	// To send HTML mail, the Content-type header must be set
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	// Additional headers
	// I'm not sure how the To: field in the header functions since it's part
	// of the function call, so I've commented it out here
	//$headers .= 'To: ' . $emailAddr . "\r\n";
	$headers .= 'From: Yak Customer Support <info@yrcreative.com>' . "\r\n";
	$headers .= 'Cc: briankeenan03@gmail.com' . "\r\n";
	// if you want to receive a copy
	$headers .= 'Bcc: info@yrcreative.com' . "\r\n";

	// Mail it
	try {
		$accepted =  mail($to, $subject, $message, $headers);
		if ($accepted)
		{
			//echo "mail accepted";
		}
		else
		{
			//echo "mail failed";
		}
		return $accepted;
	}
	catch (Exception $e) {
		//echo "Exception". $e->getMessage();
		die();

	}
}

/**
 Validate an email address.
 Provide email address (raw input)
 Returns true if the email address has the email
 address format and the domain exists.
 */
function validEmail($email)
{
	$isValid = true;
	$atIndex = strrpos($email, "@");
	if (is_bool($atIndex) && !$atIndex)
	{
		$isValid = false;
	}
	else
	{
		$domain = substr($email, $atIndex+1);
		$local = substr($email, 0, $atIndex);
		$localLen = strlen($local);
		$domainLen = strlen($domain);
		if ($localLen < 1 || $localLen > 64)
		{
			// local part length exceeded
			$isValid = false;
		}
		else if ($domainLen < 1 || $domainLen > 255)
		{
			// domain part length exceeded
			$isValid = false;
		}
		else if ($local[0] == '.' || $local[$localLen-1] == '.')
		{
			// local part starts or ends with '.'
			$isValid = false;
		}
		else if (preg_match('/\\.\\./', $local))
		{
			// local part has two consecutive dots
			$isValid = false;
		}
		else if (!preg_match('/^[A-Za-z0-9\\-\\.]+$/', $domain))
		{
			// character not valid in domain part
			$isValid = false;
		}
		else if (preg_match('/\\.\\./', $domain))
		{
			// domain part has two consecutive dots
			$isValid = false;
		}
		else if
		(!preg_match('/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/',
		str_replace("\\\\","",$local)))
		{
			// character not valid in local part unless
			// local part is quoted
			if (!preg_match('/^"(\\\\"|[^"])+"$/',
			str_replace("\\\\","",$local)))
			{
				$isValid = false;
			}
		}
		if ($isValid && !(checkdnsrr($domain,"MX") ||
			checkdnsrr($domain,"A")))
		{
			// domain not found in DNS
			$isValid = false;
		}
	}
	return $isValid;
}

function createRandomPassword() {

    $chars = "abcdefghijkmnopqrstuvwxyz023456789";
    srand((double)microtime()*1000000);
    $i = 0;
    $pass = '' ;

    while ($i <= 7) {
        $num = rand() % 33;
        $tmp = substr($chars, $num, 1);
        $pass = $pass . $tmp;
        $i++;
    }

    return $pass;
}

function gen_uuid() {
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        // 32 bits for "time_low"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

        // 16 bits for "time_mid"
        mt_rand( 0, 0xffff ),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand( 0, 0x0fff ) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand( 0, 0x3fff ) | 0x8000,

        // 48 bits for "node"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}

?>