var $active_cycle;
var $vaultCnt = 0;
var firstNameVar = null;
var lastNameVar = null;
var $weirdoids = [];
var $lastweirdoid = null;

$(document)
		.ready(
				function() {
					console.log("in ready");

					console.log("browser " + navigator.userAgent);
					if (navigator.userAgent.match(/Android/i)
							|| navigator.userAgent.match(/webOS/i)
							|| navigator.userAgent.match(/iPhone/i)
							|| navigator.userAgent.match(/iPad/i)) {
						console.log('in match');
						$('.browser-nav-btn').remove();

					} else {

					}
					document.ontouchmove = function(event){
					    event.preventDefault();
					}
					// get the json file
					var fnames_url = "data/firstnames_json.txt";
					var packs = [];
					$.getJSON(fnames_url, function(json) {
						// this is where we can loop through the results in the
						// json object
						$.each(json, function(i, name) {
							// console.log("next first name " + name);
							$("#select-choice-firstname").append(
									'<option value="' + name + '"> ' + name
											+ '</option>');
						});

					});

					var lnames_url = "data/last_names_json.txt";
					var packs = [];
					$.getJSON(lnames_url, function(json) {
						// this is where we can loop through the results in the
						// json object
						$.each(json, function(i, name) {
							// console.log("next first name " + name);
							$("#select-choice-lastname").append(
									'<option value="' + name + '"> ' + name
											+ '</option>');

						});

					});
					$('#previewpage').live(
							'pagebeforeshow',
							function(event) {
								//
								// draw the current
								//
								console.log("drawing preview canvas");

								var drawingCanvas = document
										.getElementById("preview-canvas");

								var scaleBy = 3.5;
								var lmargin = 170;
								drawInCanvas(drawingCanvas, $lastweirdoid.bkgd,
										scaleBy, 0);
								drawInCanvas(drawingCanvas, $lastweirdoid.head,
										scaleBy, lmargin);
								drawInCanvas(drawingCanvas, $lastweirdoid.body,
										scaleBy, lmargin);
								drawInCanvas(drawingCanvas, $lastweirdoid.leg,
										scaleBy, lmargin);
								drawInCanvas(drawingCanvas, $lastweirdoid.xtra,
										scaleBy, lmargin);

							});

					$('#clearcachebtn').click(function(e) {
						console.log("clearing cache");
						localStorage.removeItem('myWeirdoids');
						$weirdoids = new Array();
						$('#vaultGrid').empty();
						e.preventDefault();
						return true;
					});

					//$weirdoids = JSON.parse(localStorage.getItem('myWeirdoids')); //
					var obj = eval('('+localStorage.getItem('myWeirdoids') + ')');

					if ($weirdoids != null) {
						console.log("retreived weirdoids = "
								+ $weirdoids.length);
					} else
						$weirdoids = new Array();

					$('#vault')
							.live(
									'pagebeforeshow',
									function(event) {
										// draw all the saved weirdoids
										$('#vaultGrid').empty();
										$vaultCnt = 0;
										jQuery
												.each(
														$weirdoids.reverse(),
														function() {
															var savedWeirdoid = this;

															// canvas is a
															// reference to a
															// <canvas> element

															// add a new grid
															// element in vault
															// and add canvas
															console
																	.log("added from weirdoid array");

															var canvasName = "nmodalCanvas"
																	+ $vaultCnt;
															var idx = $vaultCnt % 3;

															$vaultCnt += 1;

															var classname;

															switch (idx) {
															case 2:
																classname = "ui-block-c";
																break;
															case 1:
																classname = "ui-block-b";
																break;
															default:
																classname = "ui-block-a";
															}
															var fullname = "";
															if (savedWeirdoid.hasOwnProperty("fname")) {
																if (savedWeirdoid.fname
																		.length > 0)
																	fullname = savedWeirdoid.fname	+ " ";
															}
															if (savedWeirdoid.hasOwnProperty("lname")) {
																if (savedWeirdoid.lname.length > 0)
																	fullname += savedWeirdoid.lname;
															}
															$('#vaultGrid')
																	.append(
																			'<div class="'
																					+ classname
																					+ '"><div class="ui-bar" data-theme="b">'
																					+ '<canvas id="'
																					+ canvasName
																					+ '" height="300"></canvas>'
																					+ fullname
																					+ '</div></div>');

															var drawingCanvas = document
																	.getElementById(canvasName);

															var scaleBy = 3.5;
															var lmargin = 170;
															drawInCanvas(
																	drawingCanvas,
																	savedWeirdoid.bkgd,
																	scaleBy, 0);
															drawInCanvas(
																	drawingCanvas,
																	savedWeirdoid.head,
																	scaleBy,
																	lmargin);
															drawInCanvas(
																	drawingCanvas,
																	savedWeirdoid.body,
																	scaleBy,
																	lmargin);
															drawInCanvas(
																	drawingCanvas,
																	savedWeirdoid.leg,
																	scaleBy,
																	lmargin);
															drawInCanvas(
																	drawingCanvas,
																	savedWeirdoid.xtra,
																	scaleBy,
																	lmargin);

														});
									});
					$('#saveInVaultBtn').unbind('click');
					$('#saveInVaultBtn').click(
							function(e) {
								$lastweirdoid.fname = $('#select-choice-firstname option:selected').val(); 
								$lastweirdoid.lname = $('#select-choice-lastname option:selected').val(); 

								$weirdoids.push($lastweirdoid);
								try {
									localStorage.setItem("myWeirdoids", JSON
											.stringify($weirdoids)); // store
									// the
									// item
									// in
									// the
									// database
								} catch (e) {
									if (e == QUOTA_EXCEEDED_ERR) {
										alert("Quota exceeded!");
									}
								}
							});

					try{
						localStorage.setItem("myimg","data:image/png;base64,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");
						localStorage.setItem("myimg2","data:image/png;base64,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");
					} catch (e) {
						if (e == QUOTA_EXCEEDED_ERR) {
							alert("Quota exceeded!");
						}
						else
							alert("localStorage error " + e);
					}
				});

$(window).load(function() {
	// 
	var dataurl = localStorage.getItem("myimg");
	$('#myimg').append('<img src="' + dataurl + '" style="width:100%;height:100%;" />');
	var dataurl2 = localStorage.getItem("myimg2");
	$('#myimg').append('<img src="' + dataurl2 + '" style="width:100%;height:100%;" />');
});

var currentPack = '';
var lastLoadedPack = '';
var $packlist_key = null;

$(document)
		.ready(
				function() {
					// 

					$packlist_key = "pack1_" + currentPack.id;


					if (localStorage.getItem($packlist_key) === null) {
						// did not found key
						var image_manifest_url = currentPack.manifest; // "imgs/pack2_classic_manifest.txt";
						var packlist_url = "http://192.168.1.8/yakbooks/weirdoids/server/readpacks.php"; //"imgs/packlist.txt";
						// currentPack.id;

						// get the json file
						$.getJSON(packlist_url, function(json) {
							processPacklist(json);
							}).	error(function(jqXHR, textStatus, errorThrown) {
						        console.log("error getting packlist" + textStatus);
						        console.log("incoming Text " + jqXHR.responseText);
						    });
					} else
					{ 
						console.log("found $packlist_key json in localstorage " + $packlist_key);
						processPacklist(JSON.parse(localStorage.getItem($packlist_key)));
						}
					
					

					$('#bldbtn').click(function(event) {

						console.log("in bldbt click");
						if (currentPack == '') {
							$.mobile.changePage("#packs", {
								transition : "fade"
							});
							event.preventDefault();
							return true;
						} else {
							// $.loadPack(currentPack);
							// Test plugin
							$('#build').waitForImages(function() {
								console.log('All images are loaded.');
								setTimeout(function() {
									$.mobile.changePage("#build", {
										transition : "flip"
									});
								}, 1000);
							});
						}

						return true;
					});

					$('#build')
							.live(
									'pagebeforeshow',
									function(event) {
										// remove all current stuff
										if (currentPack == '') {
											$.mobile.changePage("#packs", {
												transition : "flip"
											});
											return false;
										} else {
											console.log("before build show");
											$.loadPack(currentPack);
											// Test plugin
										}

										// read in the manifest and load page

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

					$('#bands').swipeleft(function(e) {

						$active_cycle.cycle('next');
						console.log("swipeleft");

						e.preventDefault();
					});

					$('#bands').swiperight(function(e) {
						$active_cycle.cycle('prev');
						console.log("swiperight");
						e.preventDefault();
					});

					$(window).resize(function() {
						console.log("in resize");
						  $.resizeImages();
						});
				});


function processPacklist(json)
{
	var packs = [];

	if (localStorage.getItem($packlist_key) === null) {
		localStorage.setItem($packlist_key,JSON.stringify(json));
		}

	$.each(	json.packs,	function(i, pack) {
		console
				.log("next pack "
						+ pack.id);
		packs[pack.id] = pack;

		// append to div
		// packs
		// var divid =
		// 'wrapper_cycle_'
		// + band.divname;
		// var cycleid =
		// 'cycle_' +
		// band.divname;
		$("#packlist")
				.append(
						'<li passed-parameter="'
								+ pack.id
								+ '"><a href="#"> <img src="'
								+ pack.thumbnail
								+ '" />'
								+ '<h3>'
								+ pack.heading1
								+ '</h3><p>'
								+ pack.heading2
								+ '</p> </a></li>');
	});

/*
* $('#packs').live('pagebeforeshow',
* function(event) {
* 
* $('#packlist').listview('refresh');
* });
*/// $("#packlist").listview('refresh');
$('#packlist')
.delegate(
	'li',
	'click',
	function(e) {
		passedParameter = $(
				this)
				.get(0)
				.getAttribute(
						'passed-parameter');
		console
				.log('clicked list '
						+ passedParameter);
		console
				.log(packs[passedParameter]);
		currentPack = packs[passedParameter];
		// $.loadPack(currentPack);
		e.preventDefault();
		$('#bldbtn')
				.trigger(
						'click');
	});

};

jQuery.saveCreation = function() {
	var o = $(this[0]); // It's your element

};



function drawInCanvas(drawingCanvas, weirdoid, scaleBy, lmargin) {
	var context = drawingCanvas.getContext('2d');
	var img = new Image();

	img.sprite = weirdoid.sprite;

	img.onload = function() {
		var img = this;
		var sprite = img.sprite;
		console.log("drawinCanvas " + this.id + " " + sprite.x + " ");

//		context.drawImage(img, 0,0, sprite.width, sprite.height,
//				lmargin / scaleBy, weirdoid.topoffset / scaleBy, sprite.width
//						/ scaleBy, sprite.height / scaleBy);
	};
	
	img.src = img.sprite.src;//weirdoid.src;
	if (img.sprite.dataurl != null)
		{
			var sprite = img.sprite;
			img.src = img.sprite.dataurl;//weirdoid.src;
			context.drawImage(img, 0,0, sprite.width, sprite.height,
					lmargin / scaleBy, weirdoid.topoffset / scaleBy, sprite.width
							/ scaleBy, sprite.height / scaleBy);
		}
	

};

function onAfter(curr, next, opts) {
	var index = opts.currSlide;

	if (typeof $active_cycle == 'undefined' ||  $active_cycle == '') {
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
