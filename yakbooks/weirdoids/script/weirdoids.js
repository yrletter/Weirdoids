var $active_cycle;
var $vaultCnt = 0;
var firstNameVar = null;
var lastNameVar = null;
var $weirdoids = [];
var $lastweirdoid = null;
var $toSaveWeirdoid = null;
var $savingFromPreview = false;
var $saveSuccessFunction = null;

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
};

$(document)
		.ready(
				function() {
					console.log("in ready w");

					// localStorage.clear();

					document.ontouchmove = function(event) {
						// event.preventDefault();
					};

					console.log("browser " + navigator.userAgent);
					if (navigator.userAgent.match(/Android/i)
							|| navigator.userAgent.match(/webOS/i)
							|| navigator.userAgent.match(/iPhone/i)
							|| navigator.userAgent.match(/iPad/i)) {
						console.log('in match');
						$('.browser-nav-btn').remove();

					}

					window.addEventListener("offline", function(e) {
						console.log("offline");
						$online = navigator.onLine;
						// OR you can set attr to ""
						$('.online-only').attr('disabled', 'disabled');
					});

					window.addEventListener("online", function(e) {
						console.log("online");
						$online = navigator.onLine;

						// enable online functionality
						// log in buttons

						// To enable
						$('.online-only').removeAttr('disabled');
					});

					// get the json file

					$("#bldbtn,#packsbtn").button('disable').css('opacity',
							'.5');

					var packs = [];

					if ($online) {
						$.getJSON($fnames_url, function(json) {
							console.log("getting fname json " + $fnames_url);
							$.processNameJson(json, $fnames_url);
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
						shareClickHandler(true, $lastweirdoid);
						return false;
					});

					$('#btn_login_with_fb').click(function(e) {
						console.log("btn_login_with_fb clicked");
						return true;
					});
					
					$('#home_login_btn').click(function(e) {
						console.log("home login button clicked");
						$.mobile.changePage("#loginaccount", {
							transition : "fade"
						});

						//displayUserName("Bob Wiley");
						return false;
					});
					

					$('#home_signup_btn').click(function(e) {
						console.log("home signup button clicked");
						$.mobile.changePage("#signup_pg", {
							transition : "fade"
						});

						//displayUserName("Bob Wiley");
						return false;
					});

					$('#previewpage').live('pagebeforeshow', function(event) {
						drawPreview(event);

					});

					$('#clearcachebtn').click(function(e) {
						console.log("clearing cache");
						localStorage.removeItem('myWeirdoids');
						$weirdoids = new Array();
						$('#vaultGrid').empty();
						e.preventDefault();
						return true;
					});

					$('#btn_login').click(
							function(e) {

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
								var $this = $(this);

								// prevent the default submission of the form
								e.preventDefault();

								$is_logged_in = false;
								$('.logged-in-only').attr('disabled', '');

								$.ajax({
									url : '../yak/controllers/login-exec.php',
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
											alert("User " + name
													+ " logged in! userid="
													+ $userid);

											$('.logged-in-only').attr(
													'disabled', '');
											history.back();
										} else {
											serverAlert("Login failure", json);
											console.log("Login failure");
											console.log(json.errormsg);
										}
									},
									failure : function(data) {
										console.log("login failure");
									}
								});
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
					var getKey = '';

					$weirdoids = new Array();

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
							getKey = $local_user_keys[0];
						} else {
							alert("Zero length $local_user_keys");
						}

						$weirdoids = eval('(' + localStorage.getItem(getKey)
								+ ')');

						if ($weirdoids != null) {
							console.log("retreived weirdoids = "
									+ $weirdoids.length);
						} else {
							console.log("No weirdoids in localStorage for "
									+ getKey);
						}
					} else {
						console.log("No record of $local_user_keys");
					}
					// $weirdoids =
					// JSON.parse(localStorage.getItem('myWeirdoids')); //

					$('#vault').live('pagebeforeshow', function(event) {
						// draw all the saved weirdoids
						drawVault(event);
					});

					$('.savebtns').each(function(index) {

						$(this).unbind('click');

						$(this).click(function() {
							$savingFromPreview = true;
							$saveSuccessFunction = null;
							saveWeirdoid($lastweirdoid);
						});
					});
				});

function displayUserName (uname) {
	$('#homefooterbtns').empty().append('<p class="username">' + uname + '</p>');
	
}

function shareClickHandler(isFromPreview, $tmpWeirdoid) {

	$toSaveWeirdoid = $tmpWeirdoid;

	if (typeof $toSaveWeirdoid == 'undefined' || $toSaveWeirdoid == null) {
		console.log("shareClickHandler $lastweirdoid undefined");
		return;
	}

	// if not logged into fb, do so now
	if (!$is_on_facebook) {

		alert("User must log on to Facebook first.");
		return;
	}
	if (!navigator.onLine) {
		// user must log in first
		alert("Not online.");
		return;
	}

	// was weirdoid previously saved on server?
	if (typeof $toSaveWeirdoid.user_weirdoid_id == 'undefined'
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

function drawPreview(event) {
	//
	// draw the current
	//
	console.log("drawing preview canvas");

	var myselect = $('#select-choice-firstname');
	myselect[0].selectedIndex = 0;
	myselect.selectmenu("refresh");
	myselect = $('#select-choice-lastname');
	myselect[0].selectedIndex = 0;
	myselect.selectmenu("refresh");

	if (typeof $lastweirdoid == 'undefined' || $lastweirdoid == null) {
		console.log(" $lastweirdoid undefined");
		return;
	}
	$('#preview-canvas').hide();

	var drawingCanvas = document.getElementById("preview-canvas");

	var ctx = drawingCanvas.getContext('2d');
	ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

	var drawingCanvasBkgd = document
			.getElementById("preview-canvas-background");

	var ctx = drawingCanvasBkgd.getContext('2d');
	ctx.clearRect(0, 0, drawingCanvasBkgd.width, drawingCanvasBkgd.height);

	var scaleBy = Math.max(1024 / drawingCanvasBkgd.height, 4.5);
	var lmargin = 170;

	drawInCanvas(drawingCanvasBkgd, $lastweirdoid.bkgd, scaleBy, 0);

	drawInCanvas(drawingCanvas, $lastweirdoid.head, scaleBy,
			$lastweirdoid.head.sprite.x);
	drawInCanvas(drawingCanvas, $lastweirdoid.body, scaleBy,
			$lastweirdoid.body.sprite.x);
	drawInCanvas(drawingCanvas, $lastweirdoid.leg, scaleBy,
			$lastweirdoid.leg.sprite.x);
	drawInCanvas(drawingCanvas, $lastweirdoid.xtra, scaleBy,
			$lastweirdoid.xtra.sprite.x);

	$('#preview-canvas').show();

}

function drawVault(event) {
	$('#vaultGrid').empty();
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
						$('#vaultGrid')
								.append(
										'<div class="'
												+ classname
												+ '"><div class="ui-bar vaultcanvas-hidden" data-theme="b">'
												+ '<canvas id="' + canvasName
												+ '" height=300"></canvas>'
												+ fullname + '</div></div>');

						var drawingCanvas = document.getElementById(canvasName);

						var scaleBy = 3.5;
						// var lmargin = 170;

						queueDraw(drawingCanvas, savedWeirdoid.bkgd, scaleBy, 0);
						queueDraw(drawingCanvas, savedWeirdoid.head, scaleBy,
								savedWeirdoid.head.sprite.x);
						queueDraw(drawingCanvas, savedWeirdoid.body, scaleBy,
								savedWeirdoid.body.sprite.x);
						queueDraw(drawingCanvas, savedWeirdoid.leg, scaleBy,
								savedWeirdoid.leg.sprite.x);
						queueDraw(drawingCanvas, savedWeirdoid.xtra, scaleBy,
								savedWeirdoid.xtra.sprite.x);

					});
	drawFromQueue();
};

function readyToCreateImage() {
	// create image on server (if it doesn't already exist), retrieve image url
	console.log("Creating image for previously saved weirdoid "
			+ $toSaveWeirdoid.user_weirdoid_id);

	// call server command
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
					alert("Created image on server " + json.serverUrl);
					$toSaveWeirdoid.serverUrl = json.serverUrl;
					// call callback function;
					// with good response, call imgCreatedOnServer
					imgCreatedOnServer();
				} else {
					serverAlert("Error saving weirdoid", json);
					console.log("Login saving weirdoid");
					console.log(json.errormsg);
				}
			},
			failure : function(data) {
				console.log("saving weirdoid failure");
			}
		});

	} catch (e) {
		alert("Error saving weirdoid to Server database: " + e.message);

	}

}

function imgCreatedOnServer() {

	if (typeof $toSaveWeirdoid.serverUrl == 'undefined'
			|| $toSaveWeirdoid.serverUrl == null) {
		alert("imgCreatedOnServerf: saveclick serverUrl undefined");
		return;
	}

	// share it
	try {
		console.log("Ready to share on facebook: " + $toSaveWeirdoid.serverUrl);
		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			alert("You must log in before you can share your Weirdoid!");
			return;
		}

		readyToShare($toSaveWeirdoid.serverUrl);

	} catch (e) {
		alert("Error saving weirdoid to Server database: " + e.message);

	}

}

function readyToShare(serverUrl) {
	// share on facebook
	shareImageOnFB("Check out my newest Weirdoid", 'http://www.weirdoid.com',
			serverUrl, 'weirdoid', 'Checkout weirdoid.com!', shareComplete);
}

function shareComplete(wasShared) {
	console.log("Back from sharing. wasShared = " + wasShared);
	if (wasShared)
		alert("Image Shared!");
	else
		alert("Image share failed.");
}

function saveBeforeShare() {
	if ($savingFromPreview) {
		fname = $('#select-choice-firstname option:selected').val();
		lname = $('#select-choice-lastname option:selected').val();
		$toSaveWeirdoid.fname = (fname === null || fname == '') ? '' : fname;
		$toSaveWeirdoid.lname = (lname === null || lname == '') ? '' : lname;
	}

	// is user online?
	if (navigator.onLine) {
		if ($is_logged_in) {
			saveWeirdoidInDB(onSavedWeirdoidInDB);

		} else {
			// user must log in first
			alert("User must log in first.");
			return false;
		}
	}
}

function saveWeirdoid($tmpWeirdoid) {

	$toSaveWeirdoid = $tmpWeirdoid;

	if (typeof $toSaveWeirdoid == 'undefined' || $toSaveWeirdoid == null) {
		console.log(" saveclick $toSaveWeirdoid undefined");
		return;
	}

	if ($savingFromPreview) {
		fname = $('#select-choice-firstname option:selected').val();
		lname = $('#select-choice-lastname option:selected').val();
		$toSaveWeirdoid.fname = (fname === null || fname == '') ? '' : fname;
		$toSaveWeirdoid.lname = (lname === null || lname == '') ? '' : lname;
	}

	// is user online?
	if (navigator.onLine) {
		if ($is_logged_in) {
			saveWeirdoidInDB(onSavedWeirdoidInDB);

		} else {
			// user must log in first
			alert("User must log in first.");
		}
	} else {
		saveWeirdoidLocal();
	}

	return (true);

}

function onSavedWeirdoidInDB() {

	if (saveWeirdoidLocal()) {
		// if callback
		if ($saveSuccessFunction != null)
			$saveSuccessFunction();
	}

}

function saveWeirdoidInDB(callback) {

	if (typeof $toSaveWeirdoid == 'undefined' || $toSaveWeirdoid == null) {
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
						callback(json.user_weirdoid_id);
				} else {
					serverAlert("Error saving weirdoid", json);
					console.log("Login saving weirdoid");
					console.log(json.errormsg);
				}
			},
			failure : function(data) {
				console.log("saving weirdoid failure");
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
				$current_user_key = $userid;
		}
	} else {
		console.log("Can save local using $current_user_key "
				+ $current_user_key);
	}

	return true;
};

function saveWeirdoidLocal() {

	// see if user saved before
	if (!canSaveLocal())
		return false;

	if (typeof $toSaveWeirdoid == 'undefined' || $toSaveWeirdoid == null) {
		alert("saveWeirdoidLocal $toSaveWeirdoid undefined");
		return false;
	}

	$weirdoids.push($toSaveWeirdoid);
	try {
		var saveKey = "myWeirdoids_" + $current_user_key;
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

$(document).ready(
		function() {
			// 

			$packlist_key = "packlist";

			// if (localStorage.getItem($packlist_key) === null) {
			// did not found key

			$('#packs').live('pagecreate', function() {
				console.log("created packs");
				$('#packlist').attr('data-role', 'listview');
				$("#packlist").listview();

				$("#packlist").listview('refresh');

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
							// load the pack, when all are loaded, transition to
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

			$('#randombtn').click(function(event) {

				console.log("click randombtn");

				// for each cycle, find count of images, go to random
				// one
				if ($('#cycle_legs').data('band') != undefined) {
					var band = $('#cycle_legs').data('band');
					var maxval = band.images.length;

					if (maxval > 0) {

						var numRand = Math.floor(Math.random() * maxval);
						$('#cycle_legs').cycle(numRand);
					}
				}
				if ($('#cycle_heads').data('band') != undefined) {
					var band = $('#cycle_heads').data('band');
					var maxval = band.images.length;

					if (maxval > 0) {

						var numRand = Math.floor(Math.random() * maxval);
						$('#cycle_heads').cycle(numRand);
					}
				}
				if ($('#cycle_bodies').data('band') != undefined) {
					var band = $('#cycle_bodies').data('band');
					var maxval = band.images.length;

					if (maxval > 0) {

						var numRand = Math.floor(Math.random() * maxval);
						$('#cycle_bodies').cycle(numRand);
					}
				}
				if ($('#cycle_xtras').data('band') != undefined) {
					var band = $('#cycle_xtras').data('band');
					var maxval = band.images.length;

					if (maxval > 0) {

						var numRand = Math.floor(Math.random() * maxval);
						$('#cycle_xtras').cycle(numRand);
					}
				}
				if ($('#cycle_bkgds').data('band') != undefined) {
					var band = $('#cycle_bkgds').data('band');
					var maxval = band.images.length;

					if (maxval > 0) {

						var numRand = Math.floor(Math.random() * maxval);
						$('#cycle_bkgds').cycle(numRand);
					}
				}
				return false;
			});

			// get orig location of home buttons
			$btn_build_top = $('#btn_build').css('top');
			$btn_vault_top = $('#btn_vault').css('top');
			$btn_packs_top = $('#btn_packs').css('top');

			$('#build').live('pagebeforeshow', function(event) {
				$('#headbtn').trigger('click');
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

			$('#bands').swipeleft(
					function(e) {

						if (typeof $active_cycle == 'undefined'
								|| $active_cycle == '') {
							console.log("swipeleft $active_cycle undefined");
							return;
						}
						$active_cycle.cycle('next');
						console.log("swipeleft");

						e.preventDefault();
					});

			$('#bands').swiperight(
					function(e) {
						if (typeof $active_cycle == 'undefined'
								|| $active_cycle == '') {
							console.log("swiperight $active_cycle undefined");
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

function queueDraw(drawingCanvas, weirdoid, scaleBy, lmargin) {
	var drawing = [];
	drawing.drawingCanvas = drawingCanvas;
	drawing.weirdoid = weirdoid;
	drawing.scaleBy = scaleBy;
	drawing.lmargin = lmargin;
	$drawingqueue.push(drawing);
}

function drawFromQueue() {
	if ($drawingqueue.length > 0) {
		drawing = $drawingqueue.shift();
		drawInCanvas(drawing.drawingCanvas, drawing.weirdoid, drawing.scaleBy,
				drawing.lmargin);
	} else
		$('#vault .vaultcanvas-hidden').removeClass('vaultcanvas-hidden');
}

function drawInCanvas(drawingCanvas, weirdoid, scaleBy, lmargin) {
	var context = drawingCanvas.getContext('2d');
	var img = new Image();

	img.sprite = weirdoid.sprite;

	img.onload = function() {
		var img = this;
		var sprite = img.sprite;
		// console.log("drawinCanvas " + this.id + " " + sprite.x + " ");

		// if (img.sprite.dataurl != null) {
		var sprite = img.sprite;

		// console.log("drawinCanvas loaded " + img.src + " h " + sprite.height
		// + " w " + sprite.width + " scaleby " + scaleBy + ' lmargin '
		// + lmargin + ' ' + img.height + ' ' + img.width);
		// console.log(sprite.width + ' ' + sprite.height + ' ' + lmargin
		// / scaleBy + ' ' + weirdoid.topoffset / scaleBy + ' '
		// + sprite.width / scaleBy + ' ' + sprite.height / scaleBy);

		var nu_x = Math.round(lmargin / scaleBy);
		var nu_y = Math.round(weirdoid.topoffset / scaleBy);
		var nu_w = Math.round(sprite.width / scaleBy);
		var nu_h = Math.round(sprite.height / scaleBy);
		context.drawImage(img, 0, 0, sprite.width, sprite.height, nu_x, nu_y,
				nu_w, nu_h);
		drawFromQueue();
		// }
	};

	img.src = img.sprite.src;// weirdoid.src;

	// if (img.sprite.dataurl != null) {
	// var sprite = img.sprite;
	// console.log("drawinCanvas " + img.src + " h " + sprite.height + " w " +
	// sprite.width + " scaleby " + scaleBy + ' lmargin ' + lmargin);
	// console.log( sprite.width + ' ' + sprite.height+ ' ' + lmargin/ scaleBy+
	// ' ' + weirdoid.topoffset / scaleBy+ ' ' +
	// sprite.width / scaleBy+ ' ' + sprite.height / scaleBy);
	//		
	// img.src = img.sprite.dataurl;// weirdoid.src;
	// context.drawImage(img, 0, 0, sprite.width, sprite.height, lmargin
	// / scaleBy, weirdoid.topoffset / scaleBy,
	// sprite.width / scaleBy, sprite.height / scaleBy);
	// }

};

function onAfter(curr, next, opts) {
	var index = opts.currSlide;

	if (typeof $active_cycle == 'undefined' || $active_cycle == '') {
		console.log("$active_cycle undefined");
		return;
	}
	$active_cycle.currSlide = index;
	$active_cycle.data('currSlide', index);
	console
			.log('current slide = ' + index + ' curr '
					+ $active_cycle.currSlide);

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