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

var iWebkit;

jQuery.processNameJson = function(json, url) {

	console.log("processNameJson " + url);

	if (localStorage.getItem(url) === null) {
		localStorage.setItem(url, JSON.stringify(json));
	}
	console.log("processNameJson " + url);

	var selector = (url == $fnames_url)
			? $("#select-choice-firstname")
			: $("#select-choice-lastname");
	$.each(json, function(i, name) {
		// console.log("next first name " + name);
		selector.append('<option value="' + name + '"> ' + name + '</option>');
	});
	console.log("select length " + selector[0].length);
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

					document.ontouchmove = function(event) {
						// event.preventDefault();
					};

					$(document).delegate(
							'#vault',
							'pageshow',
							function() {
								var mh = Math.min(1024, $(window).height());
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

					// get the json file

					$("#bldbtn,#packsbtn").button('disable').css('opacity',
							'.5');

					var packs = [];

					if ($online) {
						$.ajax({
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
						$.mobile.changePage("#loginaccount", {
							transition : "fade"
						});

						return false;
					});

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
						drawPreview(event, "previewpage");

					});

					$('#previewshare').live('pagebeforeshow', function(event) {
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
						})
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
											} else {
												$('meta[name="viewport"]')
														.attr('content',
																'height=device-height,width=device-width,initial-scale=1.0,maximum-scale=1.0');
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
						drawVault(event);
					});

					$('#saveInVaultBtn').click(function() {
						$srcPage = "#previewpage";
						$afterLoginPage = '#previewshare';
						$savingFromPreview = true;
						if (!$saved_new_weirdoid)
							storeLocalWeirdoid($lastweirdoid);
						gotoPage("#previewshare");
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
				alert("User " + name + " logged in! userid=" + $userid);

				$('.logged-in-only').attr('disabled', '');
				displayUserName(name);

				// synch up user data
				afterLogin($userid);

				chgPageAfterLoginOrShare();
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
						alert("An email was sent to you to complete the reset process.");
					} else {
						serverAlert("Pwd reset request error", json);
						console.log("Pwd reset request error");
						console.log(json.errormsg);
					}
				},
				failure : function(data) {
					alert("Pwd reset request failure");
				},
				complete : function(xhr, data) {
					if (xhr.status != 0 && xhr.status != 200)
						alert('Error calling server to make Pwd reset request. Status='
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
				alert("User " + name + " signed up! userid=" + $userid);

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
				alert('Error calling server to sign up. Status=' + xhr.status
						+ " " + xhr.statusText);
		}
	});
}

function displayUserName(uname) {
	$('#homefooterbtns').empty()
			.append('<p class="username">' + uname + '</p>');

}

function afterFBLogin(success, msg) {
	console.log("afterFBLogin: " + success + " msg: " + msg);
	history.back();

}

function chgPageAfterLoginOrShare() {

	if ($srcPage == null) {
		alert("chgPageAfterLoginOrShare: null $srcPage");
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
		alert("Null $afterLoginPage");

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
		alert("Unknown $afterLoginPage " + $afterLoginPage);
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
 * alert("Unknown $afterFBLoginPage " + $afterFBLoginPage); }
 * 
 * $afterLoginPage = null; }
 */

function afterFBLoginBeforeShare(success, msg) {
	if (success) {
		console.log("afterFBLoginBeforeShare");
		shareClickHandler(false, $toSaveWeirdoid);
	} else
		alert("Failed to log in to FB before sharing: " + msg);
}

function shareClickHandler(isFromPreview, $tmpWeirdoid) {

	$toSaveWeirdoid = $tmpWeirdoid;

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		console.log("shareClickHandler $lastweirdoid undefined");
		return;
	}

	if (!navigator.onLine) {
		// user must log in first
		alert("Not online.");
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
	console.log("drawing preview canvas " + target);

	if (typeof $lastweirdoid == undefined || $lastweirdoid == null) {
		console.log(" $lastweirdoid undefined");
		return;
	}

	canvasname = "preview-canvas";
	bkgdname = "preview-canvas-background";
	canvasdiv = "preview-canvas-div";
	
	var name = getWeirdoidName($lastweirdoid);

	if (target == "previewshare") {

		canvasname = "preview-share-canvas";
		bkgdname = "preview-share-canvas-background";
		canvasdiv = "preview-share-canvas-div";
		$('#preview-share-weirdoid-name').html(name);

	} else {
		var myselect = $('#select-choice-firstname');
		myselect[0].selectedIndex = 0;

		if (name.length == 0) {
			var idx = Math.floor(Math.random() * myselect[0].length - 1);
			$('#select-choice-firstname option').eq(idx).attr('selected',
					'selected');
		}
		myselect.selectmenu("refresh");

		myselect = $('#select-choice-lastname');
		myselect[0].selectedIndex = 0;

		if (name.length == 0) {
			idx = Math.floor(Math.random() * myselect[0].length - 1);

			$('#select-choice-lastname option').eq(idx).attr('selected',
					'selected');
		}
		myselect.selectmenu("refresh");

		$('#previewpage-weirdoid-name').html(name);
	}

	$('#' + canvasname).hide();

	if ($.browser.msie && parseInt($.browser.version, 10) < 9){ 
 
		$('#' + canvasdiv).empty();
		var el = document.createElement(canvasname);
		el.setAttribute("width", 150); 
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
//	var back_height = 1024;
//	var back_width = 768;
	
	if ($.browser.msie && parseInt($.browser.version, 10) < 9){ 
		var back_height = 1024;
		var back_width = 768;

//		var back_el = document.createElement(bkgdname);
//		back_el.setAttribute("width", 150); 
//		back_el.setAttribute("height", 300); 
//		back_el.setAttribute("class", "mapping"); 	
//		
//		$('#' + canvasdiv).append(back_el);
//		G_vmlCanvasManager.initElement(back_el);
//		
//		var back_ctx = back_el.getContext('2d');
	} else {
		var drawingCanvasBkgd = document.getElementById(bkgdname);
//		var back_ctx = drawingCanvas.getContext('2d');

		var back_height = drawingCanvasBkgd.height;
		var back_width = drawingCanvasBkgd.width;
	}

	ctx.clearRect(0, 0, back_width, back_height);
	//back_ctx.clearRect(0, 0, back_width, back_height);

	var scaleBy = Math.max(1024 / back_height, 4.5);
	var lmargin = 170;

	queueDraw(ctx, $lastweirdoid.bkgd, scaleBy, 0);

	queueDraw(ctx, $lastweirdoid.head, scaleBy, $lastweirdoid.head.sprite.xloc);
	queueDraw(ctx, $lastweirdoid.body, scaleBy, $lastweirdoid.body.sprite.xloc);
	queueDraw(ctx, $lastweirdoid.leg, scaleBy, $lastweirdoid.leg.sprite.xloc);
	queueDraw(ctx, $lastweirdoid.xtra, scaleBy, $lastweirdoid.xtra.sprite.xloc);
	drawFromQueue();

	$('#' + canvasname).show();

}

function drawVault(event) {
	$('#vaultgrid').empty();
	$vaultCnt = 0;
	$drawingqueue = [];
	var reversedWeirdoids = new Array();
	if ($weirdoids == null) {
		console.log("$weirdoids is null, can't draw");
	} else
		reversedWeirdoids = $weirdoids.slice();
	jQuery
			.each(
					reversedWeirdoids.reverse(),
					function() {
						var savedWeirdoid = this;

						// canvas is a
						// reference to a
						// <canvas> element

						// add a new grid
						// element in vault
						// and add canvas
						console.log("added from weirdoid array");

						var canvasName = "nmodalCanvas" + $vaultCnt;
						var idx = $vaultCnt % 3;

						$vaultCnt += 1;

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
						var fullname = "";
						if (savedWeirdoid.hasOwnProperty("fname")) {
							if (savedWeirdoid.fname.length > 0)
								fullname = savedWeirdoid.fname + " ";
						}
						if (savedWeirdoid.hasOwnProperty("lname")) {
							if (savedWeirdoid.lname.length > 0)
								fullname += savedWeirdoid.lname;
						}

						var canvasdiv = canvasName + '_div';
						
						$('#vaultgrid')
								.append(
										'<div class="'
												+ classname
												+ '"><div id="' + canvasdiv + '" class="ui-bar vault-canvas-div vaultcanvas-hidden" data-theme="b">'
												+ '<canvas id="'
												+ canvasName
												+ '" height=300" class="vaultcanvas"></canvas>'
												+  '</div><div class="vault-name">' + fullname + '</div></div>');

						// var drawingCanvas =
						// document.getElementById(canvasName);

						$('#' + canvasName).data('weirdoid', savedWeirdoid);
						$('#' + canvasName).unbind('click').click(function(e) {
							$lastweirdoid = $(this).data('weirdoid');
							console.log("clicked vault weirdoid");
							$srcPage = "#vault";
							gotoPage("#previewshare");
							e.preventDefault();
						});

						var scaleBy = 3.5;
						// var lmargin = 170;

						// pass context
						if ($.browser.msie && parseInt($.browser.version, 10) < 9){ 
							 
							$('#' + canvasdiv).empty();
							var el = document.createElement(canvasName);
							el.setAttribute("width", 150); 
							el.setAttribute("height", 300); 
							el.setAttribute("class", "mapping"); 	
							
							$('#' + canvasdiv).append(el);
							
							G_vmlCanvasManager.initElement(el);
							var context = el.getContext('2d');
						} else {
							var drawingCanvas = document
									.getElementById(canvasName);
							var context = drawingCanvas.getContext('2d');
						}

						queueDraw(context, savedWeirdoid.bkgd, scaleBy, 0);
						queueDraw(context, savedWeirdoid.head, scaleBy,
								savedWeirdoid.head.sprite.xloc);
						queueDraw(context, savedWeirdoid.body, scaleBy,
								savedWeirdoid.body.sprite.xloc);
						queueDraw(context, savedWeirdoid.leg, scaleBy,
								savedWeirdoid.leg.sprite.xloc);
						queueDraw(context, savedWeirdoid.xtra, scaleBy,
								savedWeirdoid.xtra.sprite.xloc);

					});
	drawFromQueue();
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
			alert("You must log in before you can save your Weirdoid!");
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
					alert('Error calling server to create image. Status='
							+ xhr.status + " " + xhr.statusText);
			}
		});

	} catch (e) {
		alert("Error creating image on server: " + e.message);

	}

}

function imgCreatedOnServer() {

	if (typeof $toSaveWeirdoid.serverUrl == undefined
			|| $toSaveWeirdoid.serverUrl == null) {
		alert("imgCreatedOnServerf: saveclick serverUrl undefined");
		if ($srcPage != null)
			gotoPage($srcPage);
		return;
	}

	// share it
	try {
		console.log("Ready to share on facebook: " + $toSaveWeirdoid.serverUrl);
		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			alert("You must log in before you can share your Weirdoid!");
			if ($srcPage != null)
				gotoPage($srcPage);
			return;
		}

		readyToShare($toSaveWeirdoid);

	} catch (e) {
		alert("Error saving weirdoid to Server database: " + e.message);
		if ($srcPage != null)
			gotoPage($srcPage);
	}

}

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
		console.log("Image Shared!");
	} else {
		alert("Image share failed.");
	}
	gotoPage("#previewshare");
}

function afterPreviewSave(myweirdoid) {
	console.log("Saved Weirdoid on server, now in callback afterPreviewSave");
	$.mobile.changePage("#previewshare", {
		transition : "fade"
	});

}

function setWeirdoidNameFromSelect(weirdoid) {
	// dont overwrite a prev selection unless something is selected
	fname = $('#select-choice-firstname option:selected').val();
	lname = $('#select-choice-lastname option:selected').val();

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
		alert("saveWeirdoidInDB $toSaveWeirdoid undefined");
		return;
	}

	try {
		console.log("Ready to save in database.");
		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			alert("You must log in before you can save your Weirdoid!");
			return false;
		}
		// send user id and weirdoid to server
		$toSaveWeirdoid.userid = $userid;
		var datastr = JSON.stringify($toSaveWeirdoid);
		$.ajax({
			url : 'server/save_weirdoid.php',
			type : 'post',
			dataType : 'json',
			data : {
				data : datastr
			}, // store,
			success : function(json) {
				// process the result
				if (json.errorcode == 0) {
					console.log("saved the weirdoid!");
					alert("Saved the weiroid. ID = " + json.user_weirdoid_id);
					$toSaveWeirdoid.user_weirdoid_id = json.user_weirdoid_id;
					// call callback function;
					if (callback != null)
						callback(true, json.user_weirdoid_id);
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
					alert('Error calling server to save weirdoid. Status='
							+ xhr.status + " " + xhr.statusText);
			}
		});

	} catch (e) {
		alert("Error saving weirdoid to Server database: " + e.message);

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
		alert("Error saving to local storage: " + e.message);
		return false;
	}
	return true;

}

function saveWeirdoidLocal() {

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		alert("saveWeirdoidLocal $toSaveWeirdoid undefined");
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
						alert("Not online and no packlist info available for "
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
						$('.error').hide();

					});

					$('#previewpage').live('pagebeforeshow', function(event) {
						if ($online)
							$('btn_login').show();
						else
							$('btn_login').hide();

					});

					$('#bldbtn').click(function(event) {

						console.log("in bldbt click");
						if (currentPack == '') {
							$.mobile.changePage("#packs", {
								transition : "fade"
							});
							event.preventDefault();
							return true;
						} else {
							// Test plugin
							$('#build').waitForImages(function() {
								console.log('bldbtn: All images are loaded.');
								setTimeout(function() {
									// load the pack, when all are loaded,
									// transition to
									// build
									console.log("before build show");
									$.loadPack(currentPack);
									// $.mobile.changePage("#build", {
									// transition : "flip"
									// });
								}, 1000);
							});
						}

						return true;
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
										$active_cycle.cycle('next');
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

										$active_cycle.cycle('prev');
										console.log("swiperight");
										e.preventDefault();
									});

					$(window).resize(function() {
						console.log("in resize");
						$.resizeImages();
					});
				});

jQuery.saveCreation = function() {
	var o = $(this[0]); // It's your element

};

$drawingqueue = [];

function queueDraw(context, weirdoid, scaleBy, lmargin) {
	var drawing = [];
	drawing.context = context;
	drawing.weirdoid = weirdoid;
	drawing.scaleBy = scaleBy;
	drawing.lmargin = lmargin;
	$drawingqueue.push(drawing);
}

function drawFromQueue() {
	if ($drawingqueue.length > 0) {
		drawing = $drawingqueue.shift();
		drawInCanvas(drawing.context, drawing.weirdoid, drawing.scaleBy,
				drawing.lmargin);
	} else
		$('#vault .vaultcanvas-hidden').removeClass('vaultcanvas-hidden');
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

		var nu_x = Math.round(lmargin / scaleBy);
		var nu_y = Math.round(weirdoid.topoffset / scaleBy);
		var nu_w = Math.round(sprite.width / scaleBy);
		var nu_h = Math.round(sprite.height / scaleBy);
		if (ximg == null)
			alert("null img in drawInCanvas");
		if (nu_w == undefined || nu_h == undefined || nu_w <= 0 || nu_h <= 0)
			alert("Bad image values: offset=" + weirdoid.topoffset
					+ " scaleBy=" + scaleBy + " width=" + sprite.width
					+ " height=" + sprite.height)

		context.drawImage(ximg, 0, 0, sprite.width, sprite.height, nu_x, nu_y,
				nu_w, nu_h);
		drawFromQueue();
		// }
	};

	img.src = img.sprite.src;// weirdoid.src;


};

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

	// $active_cycle.currSlide = index;
	// $active_cycle.data('currSlide', index);
	// console
	// .log('current slide = ' + index + ' curr '
	// + $active_cycle.currSlide);

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
	alert(alertmsg);
}