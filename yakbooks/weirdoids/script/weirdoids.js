var $active_cycle;
var $vaultCnt = 0;
var firstNameVar = null;
var lastNameVar = null;
var $weirdoids = [];
var $lastweirdoid = null;
var $toSaveWeirdoid = null;
var $savingFromPreview = false;
var $saveSuccessFunction = null;
var $srcPage = null;
var $saved_new_weirdoid = false;

var $packs = [];

var STD_HEIGHT = 1024;
var STD_WIDTH = 768;
var WIDTH_TO_HEIGHT = STD_WIDTH / STD_HEIGHT;
var STD_VAULT_HEIGHT = 300;
var NARROW_VAULT_HEIGHT = 150;
var NARROW_WIDTH = 600;

var VAULT_DISPLAY_COUNT = 6;

var $btn_build_top = 400;
var $btn_vault_top = 500;
var $btn_packs_top = 600;

var $fnames_url = "data/firstnames_json.txt";
var $lnames_url = "data/last_names_json.txt";

var $online = navigator.onLine;
var $is_logged_in = false;
var $is_on_facebook = false;
var $is_trial_only = false;
var $username = 'Guest';
var $local_user_keys = [];
var $current_user_key = null;
var $userid = null;
var $facebook_userid = null;
var $userkey_prefix = "myWeirdoids_";
var $local_user_id = 0;

// easter egg variables
var $random_cycle = false;
var $random_eggs = 0;
var $current_eastereggs = [];

var iWebkit;

if (typeof console == "undefined" || typeof console.log == "undefined")
	var console = {
		log : function() {
		}
	};

jQuery.processNameJson = function(json, url) {

	console.log("processNameJson " + url);

	if (localStorage.getItem(url) === null) {
		localStorage.setItem(url, JSON.stringify(json));
	}
	console.log("processNameJson " + url);

	var is_first_name = (url == $fnames_url);
	var selector = is_first_name
			? $("#firstname_listview")
			: $("#lastname_listview");
	// var selector = is_first_name
	// ? $("#select-choice-firstname")
	// : $("#select-choice-lastname");

	var cnt = 10;
	$.each(json, function(i, name) {
		// console.log("next first name " + name);
		if (--cnt > 0) {

			if (is_first_name)
				selector.append('<li name="' + name
						+ '"><a href="#" class="firstname_link" name="' + name
						+ '">' + name + '</a></li>');
			else
				selector.append('<li name="' + name
						+ '"><a href="#" class="lastname_link" name="' + name
						+ '">' + name + '</a></li>');
			// selector.append('<option value="' + name + '"> ' + name
			// + '</option>');
		}

	});

	// console.log("select length " + selector[0].length);
};

$(document)
		.ready(
				function() {
					console.log("in ready w");

					// $('a').live('click', function(event) {
					// event.preventDefault();
					// window.location = $(this).attr("href");
					// });

					// localStorage.clear();

					if (navigator.userAgent.match(/iPad/i)) {
						console.log('on ipad');
						// if (window.navigator.standalone == true) {
						// $('body').height("1004px");
						// } else {
						// $('body').height("984px");
						// }

					}

					document.ontouchmove = function(event) {
						// event.preventDefault();
					};

					$(document).delegate(
							'#vault',
							'pageshow',
							function() {
								var mh = Math.min(STD_HEIGHT, $(window)
										.height());
								var the_height = (mh
										- $(this).find('[data-role="header"]')
												.height()
										- $(this).find('[data-role="footer"]')
												.height() - 35);
								$(this).height(mh)
										.find('[data-role="content"]').height(
												the_height);
							});

					console.log("browser " + navigator.userAgent);
					if (navigator.userAgent.match(/Android/i)
							|| navigator.userAgent.match(/webOS/i)
							|| navigator.userAgent.match(/iPhone/i)
							|| navigator.userAgent.match(/iPad/i)) {
						console.log('in match');
						$('.browser-nav-btn').remove();

					}

					$(window).bind("offline", function(e) {
						console.log("offline");
						$online = navigator.onLine;
						// OR you can set attr to ""
						$('.online-only').attr('disabled', 'disabled');
					});

					$(window).bind("online", function(e) {
						console.log("online");
						$online = navigator.onLine;

						// enable online functionality
						// log in buttons

						// To enable
						$('.online-only').removeAttr('disabled');

						synchProdKeys();
					});

					$(document)
							.delegate(
									'#opendialog',
									'click',
									function() {
										// NOTE: The selector can be whatever
										// you like, so long as it is an HTML
										// element.
										// If you prefer, it can be a member of
										// the current page, or an anonymous div
										// like shown.
										$('<div>')
												.simpledialog2(
														{
															mode : 'blank',
															headerText : 'Some Stuff',
															headerClose : true,
															blankContent : "<ul data-role='listview'><li>Some</li><li>List</li><li>Items</li></ul>"
																	+
																	// NOTE: the
																	// use of
																	// rel="close"
																	// causes
																	// this
																	// button to
																	// close the
																	// dialog.
																	"<a rel='close' data-role='button' href='#'>Close</a>"
														})
									});
					// get the json file

					$("#bldbtn,#packsbtn").button('disable').css('opacity',
							'.5');

					var packs = [];

					if ($online) {
						checkAutoLogin();
					}

					if ($online) {
						$
								.ajax({
									url : $fnames_url,
									type : 'get',
									dataType : 'json',
									success : function(json) {
										// process the result
										console.log("getting fname json "
												+ $fnames_url);
										$.processNameJson(json, $fnames_url);
									},
									failure : function(data) {
										console.log("fname json failure");
									},
									complete : function(xhr, data) {
										if (xhr.status != 0
												&& xhr.status != 200)
											alert('Error calling server to read json name. Status='
													+ xhr.status
													+ " "
													+ xhr.statusText);
									}

								});

					} else if (localStorage.getItem($fnames_url) === null) {
						alert("Not online and no local version of JSON for "
								+ $fnames_url);

					} else {
						$.processNameJson(JSON.parse(localStorage
								.getItem($fnames_url)), $fnames_url);
					}

					if ($online) {
						$.getJSON($lnames_url, function(json) {
							console.log("getting lname json " + $lnames_url);
							$.processNameJson(json, $lnames_url);
						});
					} else if (localStorage.getItem($lnames_url) === null) {
						alert("Not online and no local version of JSON for "
								+ $lnames_url);

					} else {
						console.log("found lname json in localStorage");
						$.processNameJson(JSON.parse(localStorage
								.getItem($lnames_url)), $lnames_url);
					}

					$('.firstname_link').live('click', function(event) {
						var target = $(this);
						var name = target.attr('name');
						console.log("Clicked a fname " + name);
						$('#firstname_value').html(name);
						combine_names();
					});

					$('.lastname_link').live('click', function(event) {
						var target = $(this);
						var name = target.attr('name');
						console.log("Clicked a lname " + name);
						$('#lastname_value').html(name);
						combine_names();

					});

					$('#btn_random_fname').click(function(event) {
						var name = random_name($('#firstname_listview'));
						$('#firstname_value').html(name);
						combine_names();
					});

					$('#btn_random_lname').click(function(event) {
						var name = random_name($('#lastname_listview'));
						$('#lastname_value').html(name);
						combine_names();
					});

					$('#home').live('pagebeforeshow', function(event) {
						$.resizeHome();
					});

					$('#btn_share_on_fb').click(function(e) {
						console.log("share on fb clicked");
						$savingFromPreview = true;
						$saveSuccessFunction = null;
						$afterLoginPage = "#vault";
						shareClickHandler(true, $lastweirdoid);
						return false;
					});
					$('#btn_post_gallery').click(function(e) {
						console.log("post to gallery clicked");
						$savingFromPreview = true;
						$saveSuccessFunction = null;
						$afterLoginPage = "#previewpage";
						postGalleryClickHandler(true, $lastweirdoid);
						return false;
					});

					$('#btn_login_with_fb')
							.click(
									function(e) {
										console
												.log("btn_login_with_fb clicked");
										if ($is_on_facebook) {
											console
													.log("already logged in to fb after login btn");
											$.mobile.changePage("#fbverify_pg",
													{
														transition : "pop"
													});

										} else
											fbLoginHandler(afterFirstFBLogin);
										return false;
									});

					$('#home_login_btn').click(function(e) {
						console.log("home login button clicked");
						$srcPage = "#home";

						$afterLoginPage = "#home";
						$('#logged_in_msg').hide();
						$.mobile.changePage("#loginaccount", {
							transition : "fade"
						});

						return false;
					});

					$('#homefooterbtns_afterlogin').children().hide();

					$('#btn_getpwd').click(function(e) {
						console.log("btn_getpwd button clicked");
						resetpwd();
						gotoPage("#home");
						return false;
					});

					$('#wanttoshare_btn_login').click(function(e) {
						console.log("wanttoshare_btn_login button clicked");
						// $srcPage = "#wanttoshare"
						$afterLoginPage = "#previewpage";
						$.mobile.changePage("#loginaccount", {
							transition : "fade"
						});

						return false;
					});

					$('#home_signup_btn').click(function(e) {
						console.log("home signup button clicked");
						$('.error').hide();

						$.mobile.changePage("#signup_pg", {
							transition : "fade"
						});

						// displayUserName("Bob Wiley");
						return false;
					});

					$('#previewpage').live('pagebeforeshow', function(event) {
						$('#saved_or_shared_msg').hide();
						drawPreview(event, "previewpage");

					});

					$('#previewshare').live('pagebeforeshow', function(event) {
						$('#saved_or_shared_msg_previewshare').hide();
						$('#shared_msg_previewshare').hide();
						drawPreview(event, "previewshare");

					});

					$('#fbverify_pg').live('pagebeforeshow', function(event) {
						var prompt = "You are already logged into Facebook.";
						if ($fbdata.email)
							prompt += "as " + $fbdata.email;
						$('#fbverify_pg_h1_1').html(prompt);

					});

					$('#fbverify_pg_btn_login').click(function(e) {
						$srcPage = "#fbverify_pg";
						$afterLoginPage = '#home';

						fbLoginHandler(afterFirstFBLogin);

						return false;
					});

					$('#clearcachebtn').click(
							function(e) {
								$.mobile.changePage('#confirm_clear_pg', 'pop',
										false, true);
								return false;
							});

					$(document).delegate('#simplebool', 'click', function() {
						$(this).simpledialog({
							'mode' : 'bool',
							'prompt' : 'How about it?',
							'useModal' : true,
							'buttons' : {
								'OK' : {
									click : function() {
										$('#dialogoutput').text('OK');
									}
								},
								'Cancel' : {
									click : function() {
										$('#dialogoutput').text('Cancel');
									},
									icon : "delete",
									theme : "c"
								}
							}
						});
					});

					$('#myModal').click(function(e) {
						e.preventDefault();
						return;
					});

					$("#btn_clear_vault_yes").click(function(e) {
						console.log("clearing cache");
						localStorage.removeItem($current_user_key);
						$weirdoids = new Array();
						$('#vaultgrid').empty();

						return true;
					});

					$('#btn_login').click(function(e) {
						loginToYak();
						return false;
					});

					$('#btn_signup').click(function(e) {
						$srcPage = "#signup_pg";
						$afterLoginPage = '#home';
						signupToYak();
						return false;
					});

					$('#btn_getpwd').click(function(e) {
						getPassword();
						return false;
					});

					if (navigator.userAgent.match(/Android/i)
							|| navigator.userAgent.match(/webOS/i)
							|| navigator.userAgent.match(/iPhone/i)
							|| navigator.userAgent.match(/iPad/i)) {
						$(window)
								.bind(
										'orientationchange',
										function(event) {
											console.log("new orientation "
													+ window.orientation);
											if (window.orientation == 90
													|| window.orientation == -90
													|| window.orientation == 270) {

												$('meta[name="viewport"]')
														.attr('content',
																'height=device-width,width=device-height,initial-scale=1.0,maximum-scale=1.0');
												// if
												// (navigator.userAgent.match(/iPad/i))
												// {
												// console.log('on ipad');
												// if
												// (window.navigator.standalone
												// == true) {
												// $('body').height("1004px");
												// } else {
												// $('body').height("984px");
												// }
												//													
												//
												// }

											} else {
												$('meta[name="viewport"]')
														.attr('content',
																'height=device-height,width=device-width,initial-scale=1.0,maximum-scale=1.0');
												// if
												// (navigator.userAgent.match(/iPad/i))
												// {
												// console.log('on ipad');
												// if
												// (window.navigator.standalone
												// == true) {
												// $('body').height("748px");
												// } else {
												// $('body').height("728px");
												// }
												//
												// }
											}

											// $('html, body').animate({
											// scrollTop: '0', left: '0'},
											// 1000,function() {
											// // Animation complete.
											// console.log("did anim1");
											// });
											console.log("in anim");
											// $('html').animate({
											// scrollLeft: 0,
											// scrollTop: 0},1000,
											// "linear",function() {
											// // Animation complete.
											// alert("done");
											// console.log("did anim");
											// });
										}).trigger('orientationchange');
					}

					// get array weirdoids from local storage
					// can have multiple IDs
					// $local_user_keys
					var getKey = getUserKey();

					$weirdoids = new Array();

					var lastUserKey = $.cookies.get('last_user_key');
					if (lastUserKey != null) {
						console.log("Found last_user_key " + lastUserKey);
						getLocalWeirdoids(lastUserKey);
					} else {
						$local_user_keys = eval('('
								+ localStorage.getItem('local_user_keys') + ')');
						if ($local_user_keys != null) {
							// have previously saved some keys
							if ($local_user_keys.length == 1) {
								getKey = $local_user_keys[0];
							} else if ($local_user_keys.length) {
								// TO DO: more than one key
								console
										.log("More than one local_user_keys. Must select one before restore.");
								$current_user_key = $local_user_keys[0];
								getKey = $current_user_key;
								console.log("getKey: " + getKey);
							} else {
								alert("Zero length $local_user_keys");
							}
							getLocalWeirdoids(getKey);
						} else {
							console.log("No record of $local_user_keys");
						}
					}

					// get product keys
					synchProdKeys();

					$('#vault').live('pagebeforeshow', function(event) {
						// draw all the saved weirdoids
						$vault_start_idx = 0;
						$('#btn_vault_prev').button('disable');
						$('#btn_vault_more').button('disable');
						drawVault();

					});

					$('#btn_vault_prev').click(
							function(event) {

								if ($vault_start_idx > 0) {
									$vault_start_idx = Math.max(0,
											$vault_start_idx
													- getVaultDivCount());
									drawVault();
								}

								event.preventDefault();
							});

					$('#btn_vault_more').click(
							function(event) {

								if ($vault_start_idx < $weirdoids.length) {
									$vault_start_idx = Math.min(
											$weirdoids.length - 1,
											$vault_start_idx
													+ getVaultDivCount());
									drawVault();
								}

								event.preventDefault();
							});

					$('#saveInVaultBtn').click(function() {
						$srcPage = "#previewpage";
						$afterLoginPage = '#previewshare';
						$savingFromPreview = true;
						if (!$saved_new_weirdoid)
							storeLocalWeirdoid($lastweirdoid);
						gotoPage("#previewshare");
						return false;
					});

					$('#btn_previewpage_save').click(function() {
						$srcPage = "#previewpage";
						$afterLoginPage = '#previewshare';

						storeLocalWeirdoid($lastweirdoid);

						$savingFromPreview = true;
						$saveSuccessFunction = afterPreviewSave;
						$srcPage = "#previewpage";
						$afterLoginPage = '#previewshare';
						saveWeirdoid($lastweirdoid);
						return false;
					});
				});

function getUserKey() {
	if ($current_user_key == null)
		$current_user_key = $userkey_prefix + $userid;
}

function getNewUserKey(userid) {
	return $userkey_prefix + userid;
}

function afterFirstFBLogin(isloggedin, msg) {
	if (isloggedin) {

		$fbCompleteCallback = afterYakLogin;

		login_to_site($fbdata);
	} else
		history.back();
}

function afterYakLogin(isloggedin, msg) {
	console.log("in afterYakLogin");

	afterLogin($userid);
	$('.logged-in-only').attr('disabled', '');

	var nuid = "Logged in with Facebook";
	if ($fbdata.first_name)
		nuid = $fbdata.first_name;

	displayUserName(nuid);
	chgPageAfterLoginOrShare();
}

function getLocalWeirdoids(getKey) {
	$current_user_key = getKey;
	$weirdoids = eval('(' + localStorage.getItem(getKey) + ')');

	if ($weirdoids != null) {
		console.log("retreived weirdoids for " + getKey + " Count="
				+ $weirdoids.length);
	} else {
		console.log("No weirdoids in localStorage for " + getKey);
		$weirdoids = new Array();
	}
	if ($.cookies.test()) {
		$.cookies.set('last_user_key', getKey);
	}

}
function getPassword() {
	console.log("getPassword");
	$('.error').hide();

	var email = $('#forgotpwd_email').val();
	if (email == "") {
		$("label#forgotpwd_email_error").show();
		$("#forgotpwd_email").focus();
		return false;
	}

}

function checkAutoLogin() {

	// cache the form element for use in this
	// function
	// var $this = $(this);

	// prevent the default submission of the form

	if ($is_logged_in) {
		console.log("checkAutoLogin: already logged in");
		return;
	}

	$.ajax({
		url : '../yak/controllers/checklogin.php',
		type : 'post',
		dataType : 'json',
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log(" auto logged in!");
				$is_logged_in = true;

				if (json.userid) {
					$userid = json.userid;
				}

				$('#logged_in_msg').show();
				// myalert("User " + name + " logged in! userid=" + $userid);

				$('.logged-in-only').attr('disabled', '');
				if (json.yakname)
					displayUserName(json.yakname);

				// synch up user data
				afterLogin($userid);

			} else if (json.errorcode == 1) {
				console.log("No previous login");
				console.log(json.errormsg)
			} else {
				serverAlert("Login check error", json);
				console.log("Login check error");
				console.log(json.errormsg);
			}
		},
		failure : function(data) {
			console.log("login check failure");
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to check login up. Status='
						+ xhr.status + " " + xhr.statusText);
		}
	});
}

function loginToYak() {

	$('.error').hide();

	var name = $("#username").val();
	if (name == "") {
		$("label#name_error").show();
		$("#name").focus();
		return false;
	}

	var password = $("#password").val();
	if (password == "") {
		$("label#password_error").show();
		$("input#password").focus();
		return false;
	}

	// cache the form element for use in this
	// function
	// var $this = $(this);

	// prevent the default submission of the form

	$is_logged_in = false;
	$('.logged-in-only').attr('disabled', '');

	$.ajax({
		url : '../yak/controllers/login.php',
		type : 'post',
		dataType : 'json',
		data : $('#loginform').serialize(),
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("logged in!");
				$is_logged_in = true;
				if (json.userid) {
					$userid = json.userid;
				}

				$('#logged_in_msg').show();
				// myalert("User " + name + " logged in! userid=" + $userid);

				$('.logged-in-only').attr('disabled', '');
				displayUserName(name);

				// synch up user data
				afterLogin($userid);
				window.setTimeout(function() {
					chgPageAfterLoginOrShare();
				}, 2000);

			} else {
				serverAlert("Login failure", json);
				console.log("Login failure");
				console.log(json.errormsg);
			}
		},
		failure : function(data) {
			console.log("login failure");
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to login up. Status=' + xhr.status
						+ " " + xhr.statusText);
		}
	});
}

function resetpwd() {
	$
			.ajax({
				url : '../yak/controllers/reset_pwd.php',
				type : 'post',
				dataType : 'json',
				data : $('#resetpwdform').serialize(),
				success : function(json) {
					// process the result
					if (json.errorcode == 0) {
						console.log("Pwd reset request completed.");
						myalert("An email was sent to you to complete the reset process.");
					} else {
						serverAlert("Pwd reset request error", json);
						console.log("Pwd reset request error");
						console.log(json.errormsg);
					}
				},
				failure : function(data) {
					myalert("Pwd reset request failure");
				},
				complete : function(xhr, data) {
					if (xhr.status != 0 && xhr.status != 200)
						myalert('Error calling server to make Pwd reset request. Status='
								+ xhr.status + " " + xhr.statusText);
				}
			});
}

function signupToYak() {

	$('.error').hide();

	var name = $("#signup_username").val();
	if (name == "") {
		$("label#signup_username_error").show();
		$("#signup_name").focus();
		return false;
	}

	var email = $('#email').val();
	if (email == "") {
		$("label#email_error").show();
		$("#email").focus();
		return false;
	}

	var password = $("#signup_password").val();
	if (password == "") {
		$("label#signup_password_error").show();
		$("input#signup_password").focus();
		return false;
	}

	var cpassword = $("#cpassword").val();
	if (cpassword == "") {
		$("label#cpassword_error").html("This field is required.").show();
		$("input#cpassword").focus();
		return false;
	} else if (cpassword != password) {
		$("label#cpassword_error").html("Passwords don't match.").show();
		$("input#cpassword").focus();
		return false;
	}

	// prevent the default submission of the form

	$is_logged_in = false;
	$('.logged-in-only').attr('disabled', '');

	$.ajax({
		url : '../yak/controllers/signup.php',
		type : 'post',
		dataType : 'json',
		data : $('#signupform').serialize(),
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("logged in!");
				$is_logged_in = true;
				if (json.userid) {
					$userid = json.userid;
				}
				myalert("User " + name + " signed up! userid=" + $userid);

				$('.logged-in-only').attr('disabled', '');
				displayUserName(name);
				// synch up user data
				afterLogin($userid);

				chgPageAfterLoginOrShare();
			} else {
				serverAlert("Sign up failure", json);
				console.log("Sign up failure");
				console.log(json.errormsg);
			}
		},
		failure : function(data) {
			console.log("Sign up failure");
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200)
				myalert('Error calling server to sign up. Status=' + xhr.status
						+ " " + xhr.statusText);
		}
	});
}

function displayUserName(uname) {
	$('#homefooterbtns').hide();
	$('#homefooterbtns').children().hide();
	$('#homefooterbtns_afterlogin').show();
	$('#homefooterbtns_afterlogin #user_name').html(uname);
	$('#homefooterbtns_afterlogin').children().show();
	$('#home_logout_btn').show();

	$('#home_logout_btn').click(function(e) {
		// myalert("Log the user out");

		$userid = null;
		$is_logged_in = false;

		$('#homefooterbtns').show();
		$('#homefooterbtns').children().show();
		$('#homefooterbtns_afterlogin').hide();
		$('#home_logout_btn').hide();
	});
}

function afterFBLogin(success, msg) {
	console.log("afterFBLogin: " + success + " msg: " + msg);
	history.back();

}

function chgPageAfterLoginOrShare() {

	if ($srcPage == null) {
		myalert("chgPageAfterLoginOrShare: null $srcPage");
		return;
	}

	if ($srcPage == '#home') {
		gotoPage($srcPage);
		return;
	}

	if ($srcPage == '#previewpage') {
		saveWeirdoid($lastweirdoid);
		return;

	}

	console.log("$srcPage - " + $srcPage);

	if ($afterLoginPage == null) {
		myalert("Null $afterLoginPage");

	} else if ($afterLoginPage == 'back') {
		history.back();
	} else if ($afterLoginPage == 'beforeshare') {
		if ($savedReturnPage != null) {
			$afterLoginPage = $savedReturnPage;
			$savedReturnPage = null;
		}
		afterFBLoginBeforeShare(true, "null msg");
	} else if ($($afterLoginPage).length > 0) {

		$.mobile.changePage($afterLoginPage, {
			transition : "fade"
		});
	} else {
		myalert("Unknown $afterLoginPage " + $afterLoginPage);
	}

	$afterLoginPage = null;

}

function gotoPage(page) {
	$.mobile.changePage(page, {
		transition : "fade"
	});
}

/*
 * function changePageAfterFBLogin() { if ($afterFBLoginPage == null) {
 * alert("changePageAfterFBLogin: Null $afterLoginPage"); } else if
 * ($afterFBLoginPage == 'back') { history.back(); } else if ($afterFBLoginPage ==
 * 'beforeshare') { afterFBLoginBeforeShare(true, "null msg"); } else if
 * ($($afterFBLoginPage).length > 0) {
 * 
 * $.mobile.changePage($afterFBLoginPage, { transition : "fade" }); } else {
 * myalert("Unknown $afterFBLoginPage " + $afterFBLoginPage); }
 * 
 * $afterLoginPage = null; }
 */

function afterFBLoginBeforeShare(success, msg) {
	if (success) {
		console.log("afterFBLoginBeforeShare");
		shareClickHandler(false, $toSaveWeirdoid);
	} else
		myalert("Failed to log in to FB before sharing: " + msg);
}

function postGalleryClickHandler(isFromPreview, tmpWeirdoid) {

	$toSaveWeirdoid = tmpWeirdoid;

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		console.log("postGalleryClickHandler $lastweirdoid undefined");
		return;
	}

	if (!navigator.onLine) {
		// user must log in first
		myalert("You cannot post to the gallery unless you are online.");
		return;
	}

	// was weirdoid previously saved on server?
	if (typeof $toSaveWeirdoid.user_weirdoid_id == undefined
			|| $toSaveWeirdoid.user_weirdoid_id == null) {
		// first save the weirdoid
		$saveSuccessFunction = readyToPostToGallery;
		saveBeforeShare();

	} else {
		// create image on server
		// calls share it when done
		readyToPostToGallery();
	}
}

function shareClickHandler(isFromPreview, $tmpWeirdoid) {

	$toSaveWeirdoid = $tmpWeirdoid;

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		console.log("shareClickHandler $lastweirdoid undefined");
		return;
	}

	if (!navigator.onLine) {
		// user must log in first
		myalert("Not online.");
		return;
	}

	// if not logged into fb, do so now
	if (!$is_on_facebook) {
		console.log("User must log on to Facebook first.");
		$savedReturnPage = $afterLoginPage;
		$afterLoginPage = "beforeshare";
		fbLoginHandler(afterFBLoginBeforeShare);
		return;
	}

	// was weirdoid previously saved on server?
	if (typeof $toSaveWeirdoid.user_weirdoid_id == undefined
			|| $toSaveWeirdoid.user_weirdoid_id == null) {
		// first save the weirdoid
		$saveSuccessFunction = readyToCreateImage;
		saveBeforeShare();

	} else {
		// create image on server
		// calls share it when done
		readyToCreateImage();
	}
}

function drawPreview(event, target) {
	//
	// draw the current
	//
	console.log("drawPreview - target = " + target);

	if (typeof $lastweirdoid == undefined || $lastweirdoid == null) {
		console.log(" $lastweirdoid undefined");
		return;
	}

	canvasname = "preview-canvas";
	bkgdname = "preview-canvas-background";
	canvasdiv = "preview-canvas-div";

	var name = getWeirdoidName($lastweirdoid);

	var showimage = (target == "previewshare");

	if (target == "previewshare") {

		canvasname = "preview-share-canvas";
		bkgdname = "preview-share-canvas-background";
		canvasdiv = "preview-share-canvas-div";
		$('#preview-share-weirdoid-name').html(name);

	} else {
		// var myselect = $('#select-choice-firstname');
		// myselect[0].selectedIndex = 0;

		var fname = '';
		var lname = '';

		if (name.length == 0) {

			fname = random_name($('#firstname_listview'));

			$('#firstname_value').html(fname);
			// $('#select-choice-firstname option').eq(idx).attr('selected',
			// 'selected');
		}
		// myselect.selectmenu("refresh");

		// myselect = $('#select-choice-lastname');
		// myselect[0].selectedIndex = 0;

		if (name.length == 0) {
			lname = random_name($('#lastname_listview'));

			$('#lastname_value').html(lname);
			// $('#select-choice-lastname option').eq(idx).attr('selected',
			// 'selected');
		}
		// myselect.selectmenu("refresh");

		if (name.length == 0) {
			combine_names();
		}
	}

	if (target == "previewshare") {

		var btarget = $('#previewshare_body_wrapper');
		btarget.empty();

		// queueImageDraw( $lastweirdoid.bkgd,0);

		var body_width = btarget.width();
		var body_height = $('body').height();

		var hdrheight = $('#previewshare_header').outerHeight()
				+ parseInt($('#previewshare_header').css("border-top-width"))
				+ parseInt($('#previewshare_header').css("border-bottom-width"));

		var footer_height = $('#previewshare_footer').outerHeight();

		if (hdrheight == 0 || footer_height == 0) {

		}

		var nusize = $('body').height() - hdrheight - footer_height;
		var previewsize = nusize * 0.8; // 80% of space
		var previewpct = (nusize / body_height) * 100.0;
		// btarget.height(previewpct + '%');
		btarget.height(previewsize + 'px');

		var body_width = $('body').width();
		var factor = previewsize / STD_HEIGHT;
		var nuwidth = STD_WIDTH * factor;

		var wpct = (nuwidth / body_width) * 100.0;
		// btarget.width(wpct + '%');
		btarget.width(nuwidth + 'px');

		composeWeirdoid($lastweirdoid, btarget, true);
	}

	showimage = false;
	if (showimage) {

		$('#' + canvasname).hide();

		if ($.browser.msie && parseInt($.browser.version, 10) < 9) {

			$('#' + canvasdiv).empty();
			var el = document.createElement(canvasname);
			el.setAttribute("width", 220);
			el.setAttribute("height", 300);
			el.setAttribute("class", "mapping");

			$('#' + canvasdiv).append(el);

			G_vmlCanvasManager.initElement(el);
			var ctx = el.getContext('2d');
		} else {
			var drawingCanvas = document.getElementById(canvasname);
			var ctx = drawingCanvas.getContext('2d');
		}
		// var drawingCanvasBkgd = document.getElementById(bkgdname);
		// var back_height = STD_HEIGHT;
		// var back_width = STD_WIDTH;

		if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
			var back_height = 300;
			// var back_width = STD_WIDTH;
			// var back_el = document.createElement(bkgdname);
			// back_el.setAttribute("width", 150);
			// back_el.setAttribute("height", 300);
			// back_el.setAttribute("class", "mapping");
			// 
			// $('#' + canvasdiv).append(back_el);
			// G_vmlCanvasManager.initElement(back_el); //
			// var back_ctx = back_el.getContext('2d');
		} else {

			var back_height = STD_HEIGHT;
			// var back_width = drawingCanvasBkgd.width;
		}
		// back_ctx.clearRect(0, 0, back_width, back_height);
		var target_height = parseInt($('#' + canvasdiv).height());
		$('#' + canvasname).height(target_height);

		var target_width = parseInt($('#' + canvasdiv).width());
		$('#' + canvasname).width(target_width);

		ctx.clearRect(0, 0, target_width, target_height);

		var scaleBy = target_height / $lastweirdoid.bkgd.sprite.height;
		var lmargin = 170;

		queueDraw(ctx, $lastweirdoid.bkgd, scaleBy, 0);
		queueDraw(ctx, $lastweirdoid.leg, scaleBy,
				$lastweirdoid.leg.sprite.xloc);
		queueDraw(ctx, $lastweirdoid.body, scaleBy,
				$lastweirdoid.body.sprite.xloc);
		queueDraw(ctx, $lastweirdoid.head, scaleBy,
				$lastweirdoid.head.sprite.xloc);
		queueDraw(ctx, $lastweirdoid.xtra, scaleBy,
				$lastweirdoid.xtra.sprite.xloc);
		drawFromQueue();

		$('#' + canvasname).show();
	}
	if ($previewLastMessage != null) {

		$('#shared_msg_previewshare h1').html($previewLastMessage);
		$('#shared_msg_previewshare').show();
		$previewLastMessage = null;
	}

}

function random_name(selector) {
	if (selector == undefined) {
		console.log("random_name: null selector");
		return null;
	}
	var idx = Math.floor(Math.random() * selector.children().length - 1);
	var element = selector.children()[idx];
	return $(element).attr('name');

}

// pass in weirdoid and div target. Must set height and width of target.
function composeWeirdoid(weirdoid, btarget, is_centered) {
	var std_height = (weirdoid.std_height) ? weirdoid.std_height : STD_HEIGHT;
	var std_width = (weirdoid.std_width) ? weirdoid.std_width : STD_WIDTH;

	is_centered = typeof is_centered !== 'undefined' ? is_centered : false;

	// var width_to_height = (weirdoid.width_to_height)
	// ? weirdoid.width_to_height
	// : WIDTH_TO_HEIGHT;
	//
	// var yfactor = std_height * 100.0;
	// var xfactor = std_width * 100.0;

	compose_band(weirdoid.bkgd, "bkgd", btarget, std_height, std_width,
			is_centered);
	compose_band(weirdoid.leg, "leg", btarget, std_height, std_width,
			is_centered);
	compose_band(weirdoid.body, "body", btarget, std_height, std_width,
			is_centered);
	compose_band(weirdoid.head, "head", btarget, std_height, std_width,
			is_centered);
	compose_band(weirdoid.xtra, "xtra", btarget, std_height, std_width,
			is_centered);

	// add any eastereggs
	if (weirdoid.eastereggs) {
		$.each(weirdoid.eastereggs, function(i, easteregg) {

			compose_easteregg(easteregg, btarget, std_height, std_width);

		});

	}
}

function compose_easteregg(easteregg, target, std_height, std_width) {
	var divname = target.attr('id') + '_' + easteregg.divname;
	var divid = '#' + divname;

	var location_class = (easteregg.location_class != undefined && easteregg.location_class.length > 0)
			? easteregg.location_class
			: "none";
	var showit = (target.find('.' + location_class).length == 0);

	if (!showit) {
		console.log("already have an egg with this class");
		return;
	}

	console.log("Adding easteregg: " + easteregg.src + " at top_pct: "
			+ easteregg.top_pct + " left_pct: " + easteregg.left_pct);

	target.append('<div id="' + divname + '" class="easteregg '
			+ location_class + '"><img src="' + easteregg.src
			+ '"></img></div>');
	$(divid).hide();
	$(divid).css('background-color', 'transparent');
	$(divid).css('top', easteregg.top_pct + '%');
	$(divid).css('left', easteregg.left_pct + '%');
	$(divid).width(easteregg.width_pct + '%');
	$(divid).height(easteregg.height_pct + '%');
	$(divid).css("position", "absolute");

	$(divid).fadeIn('slow', function() {
		// Animation complete.
		$(this).css('background-color', 'transparent');
	});

}

var div_ctr = 0;
function compose_band(band, bandname, btarget, std_height, std_width,
		is_centered) {
	var top_pct = (band.topoffset / std_height) * 100;
	var left_pct = (band.sprite.xloc / std_width) * 100;
	var divname = 'preview_' + bandname + '_' + div_ctr;

	is_centered = typeof is_centered !== 'undefined' ? is_centered : false;

	div_ctr++;

	btarget.append('<div id="' + divname + '" class="preview_div"><img src="'
			+ band.sprite.src + '"></img></div>');

	$('#' + divname).css("top", top_pct + '%');

	if (!is_centered)
		$('#' + divname).css("left", left_pct + '%');

	var cycle_height = (band.sprite.height / std_height) * 100.0;
	$('#' + divname).height(cycle_height + '%');
}

function combine_names() {
	var fname = $("#firstname_value").html();
	var lname = $("#lastname_value").html();

	var combined = (fname) ? fname : '';
	if (lname) {
		combined += ' ' + lname;
	}
	$('#previewpage-weirdoid-name').html(combined);
}

var $vault_start_idx = 0;

function getVaultDivCount() {
	var view_width = $(window).width();
	var vaultDivCount = VAULT_DISPLAY_COUNT;
	if (view_width <= NARROW_WIDTH) {
		vaultDivCount = 1;
	}
	return vaultDivCount;
}

function drawVault(event) {
	$('#vaultcontent').empty();

	var view_width = $(window).width();
	var vaultHeight = STD_VAULT_HEIGHT;
	var vaultDivCount = getVaultDivCount();
	var gridname = "vaultgrid";
	if (view_width > NARROW_WIDTH) {
		$('#vaultcontent')
				.append(
						'<div class="ui-grid-b" id="vaultgrid" data-scroll="true"></div>');
	} else {
		vaultHeight = NARROW_VAULT_HEIGHT;
		vaultCount = 1;
		var gridname = "vault_narrow_wrapper";
		$('#vaultcontent')
				.append(
						'<div class="narrow_vault_grid" id="vault_narrow_wrapper" data-scroll="true"></div>');
	}

	$('body').addClass('ui-loading');

	var vaultCnt = 0;

	$drawingqueue = [];
	var reversedWeirdoids = new Array();
	if ($weirdoids == null) {
		console.log("$weirdoids is null, can't draw");
		$('body').removeClass('ui-loading');
	} else {
		var eidx = Math
				.min($vault_start_idx + vaultDivCount, $weirdoids.length);
		reversedWeirdoids = $weirdoids.slice(); // make a copy
		reversedWeirdoids = reversedWeirdoids.reverse().slice($vault_start_idx,
				eidx); // reverse it, then slice
		if ($vault_start_idx > 0)
			$('#btn_vault_prev').button('enable');

		else
			$('#btn_vault_prev').button('disable');

		if (eidx >= $weirdoids.length)
			$('#btn_vault_more').button('disable');

		else
			$('#btn_vault_more').button('enable');

		jQuery
				.each(
						reversedWeirdoids,
						function() {
							var savedWeirdoid = this;

							// canvas is a
							// reference to a
							// <canvas> element

							// add a new grid
							// element in vault
							// and add canvas
							// console.log("added from weirdoid array");

							var canvasName = "nmodalCanvas" + vaultCnt;

							if (view_width > NARROW_WIDTH) {

								var idx = vaultCnt % 3;

								var classname;
								switch (idx) {
									case 2 :
										classname = "ui-block-c";
										break;
									case 1 :
										classname = "ui-block-b";
										break;
									default :
										classname = "ui-block-a";
								}
							} else
								classname = "vault_cycle_div";

							vaultCnt += 1;
							var fullname = "";
							if (savedWeirdoid.hasOwnProperty("fname")) {
								if (savedWeirdoid.fname.length > 0)
									fullname = savedWeirdoid.fname + " ";
							}
							if (savedWeirdoid.hasOwnProperty("lname")) {
								if (savedWeirdoid.lname.length > 0)
									fullname += savedWeirdoid.lname;
							}

							if (fullname.length == 0)
								fullname = " ";

							var canvasdiv = canvasName + '_div';
							if (view_width <= NARROW_WIDTH) {
								$('#vault_narrow_wrapper')
										.append(
												'<div id="'
														+ canvasdiv
														+ '" class="vault_cycle_inner_div" data-theme="b"></div><div class="vault-narrow-name">'
														+ fullname + '</div>');

							} else {

								$('#vaultgrid')
										.append(
												'<div class="'
														+ classname
														+ '"><div id="'
														+ canvasdiv
														+ '" class=" vault_div" data-theme="b"></div><div class="vault-name">'
														+ fullname
														+ '</div></div>');
								$('#vaultgrid').page();
							}

							// var drawingCanvas =
							// document.getElementById(canvasName);

							$('#' + canvasdiv).data('weirdoid', savedWeirdoid);
							$('#' + canvasdiv).unbind('click').click(
									function(e) {
										$previewLastMessage = null;
										$lastweirdoid = $(this)
												.data('weirdoid');
										console.log("clicked vault weirdoid");
										$srcPage = "#vault";
										gotoPage("#previewshare");
										e.preventDefault();
									});

							// var target_height = parseInt($('#' + canvasdiv)
							// .height());
							// var target_width = parseInt($('#' +
							// canvasdiv).width());
							//

							if (view_width > NARROW_WIDTH) {
								var vaultheight = STD_VAULT_HEIGHT;
								var vaultwidth = (vaultheight / STD_HEIGHT)
										* STD_WIDTH;

								$('#' + canvasdiv).height(vaultheight + "px");
								$('#' + canvasdiv).width(vaultwidth + "px");
							}

							var btarget = $('#' + canvasdiv);
							composeWeirdoid(savedWeirdoid, btarget, true);

						});

		$('body').removeClass('ui-loading');

		// drawFromQueue();
	}
};

function readyToCreateImage() {
	// create image on server (if it doesn't already exist), retrieve image url
	console.log("Creating image for previously saved weirdoid "
			+ $toSaveWeirdoid.user_weirdoid_id);

	// call server command
	try {
		console.log("Ready to create image file on server.");
		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			myalert("You must log in before you can save your Weirdoid!");
			return false;
		}
		// send user id and weirdoid to server
		$toSaveWeirdoid.userid = $userid;
		var datastr = JSON.stringify($toSaveWeirdoid);

		$.ajax({
			url : 'server/create_weirdoid_image.php',
			type : 'post',
			dataType : 'json',
			data : {
				data : datastr
			}, // store,
			success : function(json) {
				// process the result
				if (json.errorcode == 0) {
					console.log("created image on server: " + json.serverUrl
							+ " msg: " + json.errormsg);
					// alert("Created image on server " + json.serverUrl);
					$toSaveWeirdoid.serverUrl = json.serverUrl;
					// call callback function;
					// with good response, call imgCreatedOnServer
					imgCreatedOnServer();
				} else {
					serverAlert("Error creating image", json);
					console.log("Error creating image");
					console.log(json.errormsg);
					if ($srcPage != null)
						gotoPage($srcPage);
					return;
				}
			},
			failure : function(data) {
				console.log("create image failure");
				if ($srcPage != null)
					gotoPage($srcPage);
			},
			complete : function(xhr, data) {
				if (xhr.status != 0 && xhr.status != 200)
					myalert('Error calling server to create image. Status='
							+ xhr.status + " " + xhr.statusText);
			}
		});

	} catch (e) {
		myalert("Error creating image on server: " + e.message);

	}

}

function imgCreatedOnServer() {

	if (typeof $toSaveWeirdoid.serverUrl == undefined
			|| $toSaveWeirdoid.serverUrl == null) {
		myalert("imgCreatedOnServerf: saveclick serverUrl undefined");
		if ($srcPage != null)
			gotoPage($srcPage);
		return;
	}

	// share it
	try {
		console.log("Ready to share on facebook: " + $toSaveWeirdoid.serverUrl);
		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			myalert("You must log in before you can share your Weirdoid!");
			window.setTimeout(function() {
				if ($srcPage != null)
					gotoPage($srcPage);
			}, 1000);

			return;
		}

		readyToShare($toSaveWeirdoid);

	} catch (e) {
		myalert("Error saving weirdoid to Server database: " + e.message);
		if ($srcPage != null)
			gotoPage($srcPage);
	}

}

var $previewLastMessage = null;

function readyToPostToGallery() {
	// create image on server (if it doesn't already exist), retrieve image url
	console.log("Posting previously saved weirdoid "
			+ $toSaveWeirdoid.user_weirdoid_id);

	// call server command
	try {
		console.log("Ready to post to gallery.");
		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			myalert("You must log in before you can Post to the Gallery!");
			return false;
		}
		// send user id and weirdoid to server
		$toSaveWeirdoid.userid = $userid;
		var datastr = JSON.stringify($toSaveWeirdoid);

		$
				.ajax({
					url : 'server/post_to_gallery.php',
					type : 'post',
					dataType : 'json',
					data : {
						data : datastr
					}, // store,
					success : function(json) {
						// process the result
						if (json.errorcode == 0) {
							console.log("Weirdoid poseted: " + " msg: "
									+ json.errormsg);
							$previewLastMessage = "Your Weiroid was posted to the gallery!";
							$('#shared_msg_previewshare h1').html(
									$previewLastMessage);
							$('#shared_msg_previewshare').show();

							gotoPage("#previewshare");
						} else {
							serverAlert("Error posting to gallery", json);
							console.log("Error posting to gallery");
							console.log(json.errormsg);
							if ($srcPage != null)
								gotoPage($srcPage);
							return;
						}
					},
					failure : function(data) {
						console.log("Post to gallery failure");
						if ($srcPage != null)
							gotoPage($srcPage);
					},
					complete : function(xhr, data) {
						if (xhr.status != 0 && xhr.status != 200)
							myalert('Error calling server to post to gallery. Status='
									+ xhr.status + " " + xhr.statusText);
					}
				});

	} catch (e) {
		myalert("Error posting to gallery on server: " + e.message);

	}

}

var $last_shared_weirdoid = null;
var $previewLastMessage = null;

function readyToShare(weirdoid) {
	// share on facebook

	var name = getWeirdoidName(weirdoid);
	name = (name.length > 0) ? name : 'My Weirdoid';
	shareImageOnFB("Check out my newest Weirdoid", 'http://www.weirdoids.com',
			weirdoid.serverUrl, name, 'Checkout weirdoids.com!', shareComplete);
}

function shareComplete(wasShared) {
	console.log("Back from sharing. wasShared = " + wasShared);
	if (wasShared) {
		$previewLastMessage = "Your Weirdoid was shared on Facebook!";

		console.log("Image Shared!");
		$('#shared_msg_previewshare h1').html($previewLastMessage);
		$('#shared_msg_previewshare').show();
	} else {

		myalert("Image share failed.");
	}
	gotoPage("#previewshare");
}

function afterPreviewSave(myweirdoid) {
	console.log("Saved Weirdoid on server, now in callback afterPreviewSave");
	$previewLastMessage = "Your Weirdoid was saved on Yakhq!";

	$('#saved_or_shared_msg_preview h1').html($previewLastMessage);
	$('#saved_or_shared_msg_preview').show();

	$.mobile.changePage("#previewshare", {
		transition : "fade"
	});

}

function setWeirdoidNameFromSelect(weirdoid) {
	// dont overwrite a prev selection unless something is selected
	// fname = $('#select-choice-firstname option:selected').val();
	// lname = $('#select-choice-lastname option:selected').val();
	fname = $('#firstname_value').html();
	lname = $('#lastname_value').html();

	if (weirdoid.fname == undefined || weirdoid.fname.length == 0)
		weirdoid.fname = (fname === null || fname == '') ? '' : fname;
	else if (fname != null && fname.length > 0)
		weirdoid.fname = fname;

	if (weirdoid.lname == undefined || weirdoid.lname.length == 0)
		weirdoid.lname = (lname === null || lname == '') ? '' : lname;
	else if (lname != null && lname.length > 0)
		weirdoid.lname = lname;

}

function saveBeforeShare() {
	if ($savingFromPreview) {
		setWeirdoidNameFromSelect($toSaveWeirdoid);
	}

	// is user online?
	if (navigator.onLine) {
		if ($is_logged_in) {
			saveWeirdoidInDB(onSavedWeirdoidInDB);

		} else {
			// user must log in first
			console.log("User must log in first.");
			$.mobile.changePage("#wanttoshare", {
				transition : "fade"
			});

			return false;
		}
	}
}

function getWeirdoidName(weirdoid) {
	var name = '';
	if (weirdoid.fname != undefined)
		name = weirdoid.fname;
	if (weirdoid.lname != undefined) {
		if (name.length > 0)
			name += " ";
		name += weirdoid.lname;
	}
	return name;

}

function storeLocalWeirdoid(tmpWeirdoid) {

	$toSaveWeirdoid = tmpWeirdoid;

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		console.log(" saveclick $toSaveWeirdoid undefined");
		return;
	}

	if ($savingFromPreview) {
		setWeirdoidNameFromSelect($toSaveWeirdoid);
	}

	saveWeirdoidLocal();

	return (true);

}

function saveWeirdoid(tmpWeirdoid) {

	$toSaveWeirdoid = tmpWeirdoid;

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		console.log(" saveclick $toSaveWeirdoid undefined");
		return;
	}

	if ($savingFromPreview) {
		setWeirdoidNameFromSelect($toSaveWeirdoid);
	}

	// is user online?
	if (navigator.onLine) {
		if ($is_logged_in) {
			saveWeirdoidInDB(onSavedWeirdoidInDB);

		} else {
			// user must log in first
			console.log("User must log in first.");
			$.mobile.changePage("#wanttoshare", {
				transition : "fade"
			});
			return false;
		}
	}
	// else {
	// saveWeirdoidLocal();
	// }

	return (true);

}

function onSavedWeirdoidInDB(savedok, id) {

	//
	if ($srcPage == '#previewpage') {
		if (savedok) {
			console.log("after save in database, switch to previewshare");
			gotoPage('#previewshare');
			return;
		} else {
			console
					.log("after failing to save in database, switch to src page");
			gotoPage($srcPage);
			return;
		}
	}

	if ($srcPage == '#previewshare') {
		if (savedok) {
			console.log("after save in database, create the image");
			readyToCreateImage();
			return;
		} else {
			console
					.log("previewshare: after failing to save in database, switch to src page");
			gotoPage($srcPage);
			return;
		}
	}

	console.log("onSavedWeirdoidInDB: unk $srcPage " + $srcPage);

	return;
}

function saveWeirdoidInDB(callback) {

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		myalert("saveWeirdoidInDB $toSaveWeirdoid undefined");
		return;
	}

	try {
		console.log("Ready to save in database.");
		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			myalert("You must log in before you can save your Weirdoid!");
			return false;
		}
		// send user id and weirdoid to server
		$toSaveWeirdoid.userid = $userid;
		var datastr = JSON.stringify($toSaveWeirdoid);
		$
				.ajax({
					url : 'server/save_weirdoid.php',
					type : 'post',
					dataType : 'json',
					data : {
						data : datastr
					}, // store,
					success : function(json) {
						// process the result
						if (json.errorcode == 0) {
							console.log("saved the weirdoid! "
									+ json.user_weirdoid_id);

							// myalert("Saved the weiroid. ID = "+
							// json.user_weirdoid_id);
							$previewLastMessage = "Your Weirdoid was saved on Yakhq!";

							$toSaveWeirdoid.user_weirdoid_id = json.user_weirdoid_id;
							// call callback function;
							window.setTimeout(function() {
								if (callback != null)
									callback(true, json.user_weirdoid_id);
							}, 2000);

						} else {
							serverAlert("Error saving weirdoid in DB", json);
							console.log("Error saving weirdoid in DB");
							console.log(json.errormsg);
							if (callback != null)
								callback(false, -1);
						}
					},
					failure : function(data) {
						console.log("saving weirdoid in DB failure");
						if (callback != null)
							callback(false, -1);
					},
					complete : function(xhr, data) {
						if (xhr.status != 0 && xhr.status != 200)
							myalert('Error calling server to save weirdoid. Status='
									+ xhr.status + " " + xhr.statusText);
					}
				});

	} catch (e) {
		myalert("Error saving weirdoid to Server database: " + e.message);

	}
};

function canSaveLocal() {
	if ($current_user_key == null) {
		// see if we know who user is
		if (!$is_logged_in) {
			// we need user to select among possible user keys if more than 1
			if ($local_user_keys != null) {
				if ($local_user_keys.length == 0) {
					// no keys, user cannot save locally
					return false;
				} else if ($local_user_keys.length == 0) {
					// use only user key
					$current_user_key = $local_user_keys[0];
				} else {
					// need to pick among possible keys
					// TO DO - select user
					$current_user_key = $local_user_keys[0];
				}
			} else {
				console.log("Null $local_user_keys");
				return false;
			}
		} else {
			// current_user_key is null, but logged in
			// set
			if ($userid == null) {
				console.log("No User ID, can't save local");
				return false;
			} else
				$current_user_key = "myWeirdoids_" + $userid;
		}
	} else {
		console.log("Can save local using $current_user_key "
				+ $current_user_key);
	}

	return true;
};

function saveWeirdoidsLocal() {

	// see if user saved before
	if (!canSaveLocal())
		return false;

	try {
		var saveKey = $current_user_key;
		console.log("saveWeirdoidLocal: key = " + saveKey);

		localStorage.setItem(saveKey, JSON.stringify($weirdoids)); // store

		// make sure to save key
		if ($local_user_keys == null)
			$local_user_keys = new Array();

		if ($.inArray(saveKey, $local_user_keys) > -1) {
			console.log("User key already saved");
		} else {
			$local_user_keys.push(saveKey);
			localStorage.setItem("local_user_keys", JSON
					.stringify($local_user_keys)); // store
			console.log("Saved key in local_user_keys");
		}

	} catch (e) {
		myalert("Error saving to local storage: " + e.message);
		return false;
	}
	return true;

}

function saveWeirdoidLocal() {

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		myalert("saveWeirdoidLocal $toSaveWeirdoid undefined");
		return false;
	}
	if ($.inArray($toSaveWeirdoid, $weirdoids) < 0)
		$weirdoids.push($toSaveWeirdoid);
	else
		console.log("weirdoid already in array");

	return saveWeirdoidsLocal();
};

$(window).load(
		function() {
			// 
			var dataurl = localStorage.getItem("myimg");
			$('#myimg').append(
					'<img src="' + dataurl
							+ '" style="width:100%;height:100%;" />');
			var dataurl2 = localStorage.getItem("myimg2");
			$('#myimg').append(
					'<img src="' + dataurl2
							+ '" style="width:100%;height:100%;" />');

			$('#home').waitForImages(function() {
				console.log('Home bg are loaded.');
				$.resizeHome();
				setTimeout(function() {
					console.log('got bg');
				}, 1000);
			});

			// Set a timeout...
			if (navigator.userAgent.match(/iPad/i)) {

				setTimeout(function() {
					// Hide the address bar!
					window.scrollTo(0, 100);

				}, 400);
			}
		});

var currentPack = '';
var lastLoadedPack = '';
var $packlist_key = null;

$(document)
		.ready(
				function() {
					// 

					$packlist_key = "packlist";

					// if (localStorage.getItem($packlist_key) === null) {
					// did not found key

					$('#packs').live('pageinit', function() {
						console.log("created packs");
						// $('#packlist').attr('data-role', 'listview');
						// $("#packlist").listview();
						//
						// $("#packlist").listview('refresh');

					});

					$('#packs').live('pagebeforeshow', function() {
						console.log("correcting prices for installed packs");
						checkInstalledProducts();
					});

					if ($online) {

						getProductList();

					} else {
						myalert("Not online and no packlist info available for "
								+ packlist_url + " key " + $packlist_key);
					}

					// } else {
					// console.log("found $packlist_key json in localstorage "
					// + $packlist_key);
					// processPacklist(JSON.parse(localStorage
					// .getItem($packlist_key)));
					// }

					$('#loginaccount').live('pagebeforeshow', function(event) {
						// hide errors
						$('#logged_in_msg').hide();
						$('.error').hide();

					});

					$('#previewpage').live('pagebeforeshow', function(event) {
						if ($online)
							$('btn_login').show();
						else
							$('btn_login').hide();

					});

					$('.build_button')
							.each(
									function() {
										$(this)
												.click(
														function(event) {

															console
																	.log("in bldbt click");
															if (currentPack == '') {
																$.mobile
																		.changePage(
																				"#packs",
																				{
																					transition : "fade"
																				});
																event
																		.preventDefault();
																return true;
															} else {
																// Test plugin
																$('#build')
																		.waitForImages(
																				function() {
																					console
																							.log('bldbtn: All images are loaded.');

																					setTimeout(
																							function() {
																								// load
																								// the
																								// pack,
																								// when
																								// all
																								// are
																								// loaded,
																								// transition
																								// to
																								// build
																								console
																										.log("before build show");

																								$
																										.loadPack(currentPack);

																							},
																							1000);
																				});
															}

															return true;
														});
									});

					$('#packsbtn').click(function(event) {

						console.log("in packs click");
						$.mobile.changePage("#packs", {
							transition : "fade"
						});
						event.preventDefault();
						return true;
					});

					$('#vaultbtn').click(function(event) {

						console.log("in packs vault");
						$.mobile.changePage("#vault", {
							transition : "fade"
						});
						event.preventDefault();
						return true;
					});

					$('#donebtn').click(function(event) {

						console.log("click donebtn");
						$.mobile.changePage("#previewpage", {
							transition : "fade"
						});
						event.preventDefault();
						return true;
					});

					$('#randombtn')
							.click(
									function(event) {

										console.log("click randombtn");
										$random_cycle = true;
										$random_eggs = 0;
										// for each cycle, find count of images,
										// go to random
										// one

										if ($('#cycle_legs').data('band') != undefined) {
											var band = $('#cycle_legs').data(
													'band');
											var maxval = band.images.length;

											if (maxval > 0) {

												var numRand = Math.floor(Math
														.random()
														* maxval);
												$('#cycle_legs').cycle(numRand);
											}
										}
										if ($('#cycle_heads').data('band') != undefined) {
											var band = $('#cycle_heads').data(
													'band');
											var maxval = band.images.length;

											if (maxval > 0) {

												var numRand = Math.floor(Math
														.random()
														* maxval);
												$('#cycle_heads')
														.cycle(numRand);
											}
										}
										if ($('#cycle_bodies').data('band') != undefined) {
											var band = $('#cycle_bodies').data(
													'band');
											var maxval = band.images.length;

											if (maxval > 0) {

												var numRand = Math.floor(Math
														.random()
														* maxval);
												$('#cycle_bodies').cycle(
														numRand);
											}
										}
										if ($('#cycle_xtras').data('band') != undefined) {
											var band = $('#cycle_xtras').data(
													'band');
											var maxval = band.images.length;

											if (maxval > 0) {

												var numRand = Math.floor(Math
														.random()
														* maxval);
												$('#cycle_xtras')
														.cycle(numRand);
											}
										}
										if ($('#cycle_bkgds').data('band') != undefined) {
											var band = $('#cycle_bkgds').data(
													'band');
											var maxval = band.images.length;

											if (maxval > 0) {

												var numRand = Math.floor(Math
														.random()
														* maxval);
												$('#cycle_bkgds')
														.cycle(numRand);
											}
										}
										return false;
									});

					// get orig location of home buttons
					$btn_build_top = $('#btn_build').css('top');
					$btn_vault_top = $('#btn_vault').css('top');
					$btn_packs_top = $('#btn_packs').css('top');

					$('#build')
							.live(
									'pagebeforeshow',
									function(event) {
										$('#headbtn').trigger('click');
										// $('#randombtn').trigger('click');

										$current_eastereggs = [];

										var clist_items = $('#mycarousel')
												.children();

										jQuery
												.each(
														clist_items,
														function(i, item) {
															if (item != undefined) {
																var packobj = $(
																		item)
																		.find(
																				'a');

																if (packobj != undefined) {
																	var packitem = $(
																			packobj)
																			.data(
																					'item');
																	if (packitem != undefined
																			&& packitem.id) {
																		var packitemid = packitem.id;
																		if ($
																				.inArray(
																						packitemid,
																						$loadedpacks) < 0) {

																			$(
																					packobj)
																					.addClass(
																							'notloaded_pack');
																			$(
																					packobj)
																					.attr(
																							'title',
																							'Click to load');
																		} else {

																			$(
																					packobj)
																					.removeClass(
																							'notloaded_pack');
																			$(
																					packobj)
																					.attr(
																							'title',
																							'Loaded');
																		}

																	}
																}

															}
														});

										// set all the images
										if ($.browser.msie) {

											$('.cycleimg')
													.each(
															function() {
																// list item
																var src = $(
																		this)
																		.attr(
																				'src');
																$(this)
																		.css(
																				'filter',
																				'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'
																						+ src
																						+ '", sizingMethod="scale";');
															});
										}

									});

					$('#build').live('pageshow', function(event) {

						$.resizeImages();
						$.mobile.hidePageLoadingMsg();
						$('#band_wrapper').fadeIn('fast');
					});

					$('#headbtn').click(function(e) {

						$active_cycle = $('#cycle_heads');

						console.log("in head click");

						e.preventDefault();
						return true;
					});

					$('#legbtn').click(function(e) {

						console.log("in legs click");
						$active_cycle = $('#cycle_legs');

						e.preventDefault();
						return true;
					});
					$('#bodybtn').click(function(e) {

						$active_cycle = $('#cycle_bodies');

						e.preventDefault();
						return true;
					});
					$('#xtrabtn').click(function(e) {

						$active_cycle = $('#cycle_xtras');

						e.preventDefault();
						return true;
					});

					$('#bkgdbtn').click(function(e) {

						$active_cycle = $('#cycle_bkgds');

						e.preventDefault();
						return true;
					});

					$('#bands')
							.swipeleft(
									function(e) {

										if (typeof $active_cycle == undefined
												|| $active_cycle == '') {
											console
													.log("swipeleft $active_cycle undefined");
											return;
										}
										if ($active_cycle.children().length > 0) {
											$random_cycle = false;
											$active_cycle.cycle('next');
										}
										console.log("swipeleft");

										e.preventDefault();
									});

					$('#bands')
							.swiperight(
									function(e) {
										if (typeof $active_cycle == undefined
												|| $active_cycle == '') {
											console
													.log("swiperight $active_cycle undefined");
											return;
										}

										if ($active_cycle.children().length > 0) {
											$random_cycle = false;
											$active_cycle.cycle('prev');
										}
										console.log("swiperight");
										e.preventDefault();
									});

					$('#cancelbtn').click(function(e) {

						history.back();
						e.preventDefault();
						return true;
					});

					$(window).resize(function() {
						console.log("in resize");
						$.resizeImages(null);
					});
				});

jQuery.saveCreation = function() {
	var o = $(this[0]); // It's your element

};

$drawingqueue = [];
$drawingImageQueue = [];

function queueDraw(context, weirdoid, scaleBy, lmargin) {
	var drawing = [];
	drawing.context = context;
	drawing.weirdoid = weirdoid;
	drawing.scaleBy = scaleBy;
	drawing.lmargin = lmargin;
	$drawingqueue.push(drawing);
}

function queueImageDraw(weirdoid, lmargin) {
	var drawing = [];
	drawing.context = context;
	drawing.weirdoid = weirdoid;
	drawing.lmargin = lmargin;
	$drawingImageQueue.push(drawing);
}

function drawFromImageQueue() {
	if ($drawingImageQueue.length > 0) {
		drawing = $drawingImageQueue.shift();
		drawInDiv(drawing.weirdoid, drawing.lmargin);
	} else {

		$('body').removeClass('ui-loading');
		$('#vault .vaultcanvas-hidden').removeClass('vaultcanvas-hidden');
	}
}

function drawInDiv(weirdoid, lmargin) {

	var img = new Image();

	img.sprite = weirdoid.sprite;
	img.scaleBy = scaleBy;
	img.lmargin = lmargin;

	img.onload = function() {
		var ximg = this;
		var sprite = ximg.sprite;
		var context = img.context;
		// console.log("drawinCanvas " + this.id + " " + sprite.xloc + " ");

		// if (img.sprite.dataurl != null) {

		// console.log("drawinCanvas loaded " + img.src + " h " + sprite.height
		// + " w " + sprite.width + " scaleby " + scaleBy + ' lmargin '
		// + lmargin + ' ' + img.height + ' ' + img.width);
		// console.log(sprite.width + ' ' + sprite.height + ' ' + lmargin
		// / scaleBy + ' ' + weirdoid.topoffset / scaleBy + ' '
		// + sprite.width / scaleBy + ' ' + sprite.height / scaleBy);

		if (img.lmargin == undefined || img.lmargin == null) {
			img.lmargin = 0;
			console.log("lmargin not set");
		}

		var scaleBy;

		var nu_x = Math.round(lmargin * scaleBy);
		var nu_y = Math.round(weirdoid.topoffset * scaleBy);
		var nu_w = Math.round(sprite.width * scaleBy);
		var nu_h = Math.round(sprite.height * scaleBy);
		// var nu_x = Math.round(lmargin / scaleBy);
		// var nu_y = Math.round(weirdoid.topoffset / scaleBy);
		// var nu_w = Math.round(sprite.width / scaleBy);
		// var nu_h = Math.round(sprite.height / scaleBy);
		if (ximg == null)
			myalert("null img in drawInCanvas");
		if (nu_w == undefined || nu_h == undefined || nu_w <= 0 || nu_h <= 0)
			myalert("Bad image values: offset=" + weirdoid.topoffset
					+ " scaleBy=" + scaleBy + " width=" + sprite.width
					+ " height=" + sprite.height);

		context.drawImage(ximg, 0, 0, sprite.width, sprite.height, nu_x, nu_y,
				nu_w, nu_h);
		drawFromQueue();
		// }
	};

	img.src = img.sprite.src;// weirdoid.src;

}

function drawFromQueue() {
	if ($drawingqueue.length > 0) {
		drawing = $drawingqueue.shift();
		drawInCanvas(drawing.context, drawing.weirdoid, drawing.scaleBy,
				drawing.lmargin);
	} else {

		$('body').removeClass('ui-loading');
		$('#vault .vaultcanvas-hidden').removeClass('vaultcanvas-hidden');
	}
}

function drawInCanvas(context, weirdoid, scaleBy, lmargin) {

	var img = new Image();

	img.sprite = weirdoid.sprite;
	img.scaleBy = scaleBy;
	img.lmargin = lmargin;
	img.context = context;

	img.onload = function() {
		var ximg = this;
		var sprite = ximg.sprite;
		var context = img.context;
		// console.log("drawinCanvas " + this.id + " " + sprite.xloc + " ");

		// if (img.sprite.dataurl != null) {

		// console.log("drawinCanvas loaded " + img.src + " h " + sprite.height
		// + " w " + sprite.width + " scaleby " + scaleBy + ' lmargin '
		// + lmargin + ' ' + img.height + ' ' + img.width);
		// console.log(sprite.width + ' ' + sprite.height + ' ' + lmargin
		// / scaleBy + ' ' + weirdoid.topoffset / scaleBy + ' '
		// + sprite.width / scaleBy + ' ' + sprite.height / scaleBy);

		if (img.lmargin == undefined || img.lmargin == null) {
			img.lmargin = 0;
			console.log("lmargin not set");
		}

		var scaleBy = img.scaleBy;

		var nu_x = Math.round(lmargin * scaleBy);
		var nu_y = Math.round(weirdoid.topoffset * scaleBy);
		var nu_w = Math.round(sprite.width * scaleBy);
		var nu_h = Math.round(sprite.height * scaleBy);
		// var nu_x = Math.round(lmargin / scaleBy);
		// var nu_y = Math.round(weirdoid.topoffset / scaleBy);
		// var nu_w = Math.round(sprite.width / scaleBy);
		// var nu_h = Math.round(sprite.height / scaleBy);
		if (ximg == null)
			myalert("null img in drawInCanvas");
		if (nu_w == undefined || nu_h == undefined || nu_w <= 0 || nu_h <= 0)
			myalert("Bad image values: offset=" + weirdoid.topoffset
					+ " scaleBy=" + scaleBy + " width=" + sprite.width
					+ " height=" + sprite.height)

		context.drawImage(ximg, 0, 0, sprite.width, sprite.height, nu_x, nu_y,
				nu_w, nu_h);
		drawFromQueue();
		// }
	};

	img.src = img.sprite.src;// weirdoid.src;

};

function onAfterClickPack(curr, next, opts) {
	var index = opts.currSlide;

	var cycle = opts.$cont;

	// if (typeof $active_cycle == undefined || $active_cycle == '') {
	// console.log("$active_cycle undefined");
	// return;
	// }
	if (typeof cycle == undefined || cycle == '') {
		console.log("onAfter: cycle undefined");
		return;
	}

	cycle.currSlide = index;
	cycle.data('currSlide', index);
	console.log('Build Pack slide = ' + index + ' curr ' + cycle.currSlide);

}

var egg_cnt = 0;

function onAfter(curr, next, opts) {
	var index = opts.currSlide;

	var cycle = opts.$cont;

	// if (typeof $active_cycle == undefined || $active_cycle == '') {
	// console.log("$active_cycle undefined");
	// return;
	// }
	if (typeof cycle == undefined || cycle == '') {
		console.log("onAfter: cycle undefined");
		return;
	}

	cycle.currSlide = index;
	cycle.data('currSlide', index);
	console.log('current slide = ' + index + ' curr ' + cycle.currSlide);

	var erase_prior = ($random_cycle && ($random_eggs == 0))
			|| (!$random_cycle);

	if (erase_prior) {

		$current_eastereggs = [];

		$(".easteregg").each(function() {
			console.log(" fading prior egg " + $(this).attr('id'));
			if ($(this).css('opacity') == 0) {
				console.log("removing opaque egg " + $(this).attr('id'));
				$(this).remove();
			} else {
				$(this).fadeOut('slow', function() {
					// Animation complete.
					console.log("removing prior egg " + $(this).attr('id'));
					$(this).remove();
				});
			}

		});
	}

	if ($eastereggs) {
		var target = $('#bands');
		$
				.each(
						$eastereggs,
						function(i, easteregg) {
							var randval = Math.random() * 100.0;

							var location_class = (easteregg.location_class && easteregg.location_class.length > 0)
									? easteregg.location_class
									: "none";
							egg_cnt++;

							if (easteregg.divname == undefined) {
								var divname = "eastereggdiv" + '_'
										+ location_class + '_' + egg_cnt;
								easteregg.divname = divname;
							}

							var showit = (randval <= easteregg.show_pct)
									&& (target.find('.' + location_class).length == 0);

							if (showit) {
								compose_easteregg(easteregg, target,
										STD_HEIGHT, STD_WIDTH);
								$random_eggs++;
								$current_eastereggs.push(easteregg);
							}
						});
	}
}

function weirdoid(bkgd, head, body, leg, xtra, fname, lname) {
	this.bkgd = bkgd;
	this.head = head;
	this.body = body;
	this.leg = leg;
	this.xtra = xtra;
	this.fname = fname;
	this.lname = lname;
}
function cycleSprite(src, topoffset, sprite) {
	this.src = src;
	this.topoffset = topoffset;
	this.sprite = sprite;
}

function serverAlert(error, json) {
	var alertmsg = error + "\n\r";
	if (json.errormsg)
		alertmsg += json.errormsg + '\n\r';
	if (json.errmsg_arr) {
		jQuery.each(json.errmsg_arr, function() {
			alertmsg = alertmsg.concat(this + "\n\r");
		});

	}
	myalert(alertmsg, "Error on Server");
}

function myalert(message, title) {

	var msg_html = "";
	if (title != null) {
		msg_html += "<h1>" + title + "</h1>";
	}
	if (message != null) {
		msg_html += "<p>" + message + "</p>";
	}

	// $(document).simpledialog({
	// mode: 'blank',
	// headerText: 'Alert',
	// headerClose: true,
	// blankContent :
	// msg_html
	// });
	$('#modalcontent').html(msg_html);
	//
	$.mobile.changePage("#myModal", {
		transition : "pop"
	});

}
