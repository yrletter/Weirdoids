
var goback = false;

var $fbCompleteCallback = null;
var $firstcheck = true;
var $fbdata = [];

$(document).ready(function() {
	var e = document.createElement('script');
	e.async = true;
	e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
	document.getElementById('fb-root').appendChild(e);

	// if (navigator.onLine == false)
	// $('#fb-auth').attr('disabled', 'disabled');
	// else
	// $('#fb-auth').removeAttr('disabled');

});

window.fbAsyncInit = function() {
	console.log("fbAsyncInit");
	FB.init({
		appId : '194566610619414', // change the appId to your appId
		status : true,
		cookie : true,
		xfbml : true,
		oauth : true
	});

	// showLoader(true);

	function afterFirstCheck()
	{
		

	}
	function updateStatus(response) {
		// button = document.getElementById('fb-auth');
		// userInfo = document.getElementById('user-info');
		console.log("in updateStatus: $firstcheck = " + $firstcheck);
		if (response.authResponse) {
			// user is already logged in and connected
			$fbdata.userID = response.authResponse.id;
			FB.api('/me', function(info) {
				goback = false;
				console.log("calling login in updateStatus");
				login(response, info);
				$is_on_facebook = true;
				console.log("logged into fb");

				if ($firstcheck) {
					// user already logged in, pop dialog to see if you should log
					// in to yak
					afterFirstCheck();
					
					console.log("already logged in to fb at start");
					$.mobile.changePage("#fbverify_pg", {
						transition : "pop"
					});
				}
			});

			// button.onclick = function() {
			// FB.logout(function(response) {
			// logout(response);
			// });
			// };
		} else {
			// user is not connected to your app or logged out
			// button.innerHTML = 'Login';
			// button.onclick = fbLoginHandler;
			$is_on_facebook = false;
			console.log("not logged into FB");
			afterFirstCheck();
		}

	}

	function afterFirstCheck() {
		if ($firstcheck)
			FB.Event.subscribe('auth.statusChange', updateStatus);
		$firstcheck = false;
	}
	// run once with current status and whenever the status changes
	//console.log("Get FB status at startup.");
	FB.getLoginStatus(updateStatus);
};

function getFirstStatus()
{
	console.log("Get FB status at startup.");
	FB.getLoginStatus(updateStatus);
	
}
function fbLoginHandler(completeCallback) {
	// showLoader(true);
	$fbCompleteCallback = completeCallback;
	console.log("In fbLoginhandler");

	FB
			.login(
					function(response) {
						if (response.authResponse) {
							console.log("in authresponse");
							FB.api('/me', function(info) {
								goback = true;
								login(response, info);
								if ($fbCompleteCallback) {
									
									$fbCompleteCallback(true,"After login(): User logged in.");
								}
							});
						} else {
							// user cancelled login or did not grant
							// authorization
							// showLoader(false);
							$fbCompleteCallback(false,
									"User cancelled login or did not grant permissions.");
						}
					},
					{
						scope : 'email,user_birthday,status_update,publish_stream,user_about_me',
						redirect_uri : 'http://yrcreative.com/clients/yakbooks/weirdoids/index.html'
					});
};

function login(response, info) {
	console.log("in login after /me");
	if (response.authResponse) {
		var accessToken = response.authResponse.accessToken;

		/*
		 * userInfo.innerHTML = '<img src="https://graph.facebook.com/' +
		 * info.id + '/picture">' + info.name + "<br /> Your Access Token: " +
		 * accessToken; button.innerHTML = 'Logout'; showLoader(false);
		 * document.getElementById('other').style.display = "block";
		 */
		$is_on_facebook = true;

		$facebook_userid = info.id;
		console.log("Have authResponse: user = " + info.id);

		// log in to yak with fb credentials
		// if no such account, create one
		// 

		// create data object
		$fbdata = {
			email : info.email,
			id : info.id,
			first_name: info.first_name,
			last_name: info.last_name,
			username: info.username,
			accessToken : accessToken
		};
		

		/*
		 * button.onclick = function() { FB.logout(function(response) {
		 * 
		 * }); logout(response, true); };
		 */

	}
}

function login_to_site(fbdata) {

	console.log("Logging into yak using FB credentials");

	$
			.ajax({
				url : '../yak/controllers/login-fb.php',
				type : 'post',
				dataType : 'json',
				data : fbdata,
				success : function(json) {
					// process the result
					if (json.errorcode == 0) {
						console.log("logged in with facebook credentials!");
						$is_logged_in = true;
						if (json.userid) {
							$userid = json.userid;
						}
						console.log("User " + name
								+ " logged in with fb! userid=" + $userid);

						$('.logged-in-only').attr('disabled', '');
						if ($fbCompleteCallback != null) {
							$fbCompleteCallback(
									true,
									name
											+ " logged into server using FB credentials. userid="
											+ $userid);
						}
						else if (goback)
							history.back();

					} else {
						serverAlert("Login with fb failure", json);
						if ($fbCompleteCallback != null) {
							$fbCompleteCallback(false,
									"Server error logging into Site.");
						}
						console.log("Login with fb failure");
						console.log(json.errormsg);
					}
				},
				failure : function(data) {
					console.log("login with fb failure");
					if ($fbCompleteCallback != null) {
						$fbCompleteCallback(false,
								"Error logging into server using FB credentials.");
					}
				}
			});
}

function logout(response) {
	// userInfo.innerHTML = "";
	// document.getElementById('debug').innerHTML = "";
	// document.getElementById('other').style.display = "none";
	// showLoader(false);

	$is_on_facebook = false;
	// $is_logged_in = false;

	// button.innerHTML = 'Login';
	// button.onclick = fbLoginHandler;
}

// stream publish method
/*
 * 
 * function shareImageOnFB(name, description, hrefTitle, hrefLink, userPrompt) {
 * //showLoader(true); console.log("sharing " + hrefLink); FB.ui({ method :
 * 'stream.publish', message : '', attachment : { name : name, caption : '',
 * description : (description), href : hrefLink }, action_links : [{ text :
 * hrefTitle, href : hrefLink }], user_prompt_message : userPrompt },
 * function(response) { //showLoader(false); }); }
 */

/*
 * function showStream() { FB.api('/me', function(response) { //
 * console.log(response.id); streamPublish(response.name, 'I like yak',
 * 'hrefTitle', 'http://www.yak.com', "Share yak.com"); }); }
 * 
 * function share() { showLoader(true); var share = { method : 'stream.share', u :
 * 'http://yak.com/' };
 * 
 * FB.ui(share, function(response) { showLoader(false); console.log(response);
 * }); }
 */

function shareImageOnFB(msg, server, img, name, description,
		shareCompleteHandler) {
	// showLoader(true);

	FB.api('/me/feed', 'post', {
		message : msg,
		link : server,
		picture : img,
		name : name,
		description : description

	}, function(response) {
		// showLoader(false);

		wasShared = false;
		if (!response) {
			alert('Null response sharing on facebook');
		} else if (response.error) {
			alert('Error occured sharing on facebook: ' + response.error);
		} else {
			console.log('Post ID: ' + response.id);
			wasShared = true;
		}
		if (shareCompleteHandler != null)
			shareCompleteHandler(wasShared);
	});
}

/*
 * function shareImageOnFB(msg, server, img, name, description,
 * shareCompleteHandler) { // showLoader(true);
 * 
 * FB.api('/me/feed', 'post', { message : msg, link : server, picture : img,
 * name : name, description : description }, function(response) { //
 * showLoader(false); wasShared = false; if (!response) { alert('Null response
 * sharing on facebook'); } else if ( response.error) { alert('Error occured
 * sharing on facebook: ' + response.error); } else { alert('Post ID: ' +
 * response.id); wasShared = true; } if (shareCompleteHandler != null)
 * shareCompleteHandler(wasShared); }); }
 * 
 * 
 * function fqlQuery() { showLoader(true);
 * 
 * FB .api( '/me', function(response) { showLoader(false); //
 * http://developers.facebook.com/docs/reference/fql/user/ var query = FB.Data
 * .query( 'select name, profile_url, sex, pic_small from user where uid={0}',
 * response.id); query .wait(function(rows) {
 * document.getElementById('debug').innerHTML = 'FQL Information: ' + "<br />" +
 * 'Your name: ' + rows[0].name + "<br />" + 'Your Sex: ' + (rows[0].sex !=
 * undefined ? rows[0].sex : "") + "<br />" + 'Your Profile: ' + "<a href='" +
 * rows[0].profile_url + "'>" + rows[0].profile_url + "</a>" + "<br />" + '<img
 * src="' + rows[0].pic_small + '" alt="" />' + "<br />"; }); }); }
 * 
 * 
 * function setStatus() { showLoader(true);
 * 
 * status1 = document.getElementById('status').value; FB .api( { method :
 * 'status.set', status : status1 }, function(response) { if (response == 0) {
 * alert('Your facebook status not updated. Give Status Update Permission.'); }
 * else { alert('Your facebook status updated'); } showLoader(false); }); }
 * 
 * function showLoader(status) { if (status)
 * document.getElementById('loader').style.display = 'block'; else
 * document.getElementById('loader').style.display = 'none'; }
 */