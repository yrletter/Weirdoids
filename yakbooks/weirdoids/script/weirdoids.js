var $active_cycle;
var $vaultCnt = 0;
var firstNameVar = null;
var lastNameVar = null;
var $weirdoids = [];

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

					// get the json file
					var fnames_url = "data/firstnames_json.txt";
					var packs = [];
					$.getJSON(fnames_url, function(json) {
						// this is where we can loop through the results in the
						// json object
						$.each(json, function(i, name) {
							// console.log("next first name " + name);
							$("#firstnamelist").append(
									'<li data-icon="false"> <a href="#"> <h3>'
											+ name + '</h3> </a></li>');
							$("#lastnamelist").append(
									'<li data-icon="false"> <a href="#"> <h3>'
											+ name + '</h3> </a></li>');
						});

						$('#previewpage').live('pageshow', function(event) {
							$("#lastnamelistdiv").scrollTop(1800);
						});
					});

					$('#clearcachebtn').click(function(e) {
						console.log("clearing cache");
						localStorage.removeItem('myWeirdoids');
						$weirdoids = new Array();
						$('#vaultGrid').empty();
						e.preventDefault();
						return true;
					});
					
					$weirdoids = JSON
							.parse(localStorage.getItem('myWeirdoids')); //
					if ($weirdoids != null) {
						console.log("retreived weirdoids = "
								+ $weirdoids.length);
					} else
						$weirdoids = new Array();

					$('#vault').live('pagebeforeshow',function(event) {
										// draw all the saved weirdoids
						$('#vaultGrid').empty();
						$vaultCnt = 0;
						jQuery.each($weirdoids,	function() {
							var savedWeirdoid = this;

							// canvas is a
							// reference to a
							// <canvas> element

							// add a new grid
							// element in vault
							// and add canvas
							console.log("added from weirdoid array");
							
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

							$('#vaultGrid')
									.append(
											'<div class="'
													+ classname
													+ '"><div class="ui-bar" data-theme="b">'
													+ '<canvas id="'
													+ canvasName
													+ '" height="300"></canvas></div></div>');

							var drawingCanvas = document
									.getElementById(canvasName);

							var scaleBy = 3.5;
							var lmargin = 170;
							drawInCanvas(drawingCanvas,
									savedWeirdoid.bkgd, scaleBy, 0);
							drawInCanvas(drawingCanvas,
									savedWeirdoid.head, scaleBy,
									lmargin);
							drawInCanvas(drawingCanvas,
									savedWeirdoid.body, scaleBy,
									lmargin);
							drawInCanvas(drawingCanvas,
									savedWeirdoid.leg, scaleBy,
									lmargin);
							drawInCanvas(drawingCanvas,
									savedWeirdoid.xtra, scaleBy,
									lmargin);
						});
					});
				});

$(window).load(function() {
	// 

});

var currentPack = '';
var lastLoadedPack = '';

$(document).ready(
		function() {
			// 

			var packlist_url = "imgs/packlist.txt";
			var packs = [];

			// get the json file
			$.getJSON(packlist_url, function(json) {
				// this is where we can loop through the results in the
				// json object

				$.each(json.packs, function(i, pack) {
					console.log("next pack " + pack.id);
					packs[pack.id] = pack;

					// append to div packs
					// var divid = 'wrapper_cycle_' + band.divname;
					// var cycleid = 'cycle_' + band.divname;
					$("#packlist").append(
							'<li passed-parameter="' + pack.id
									+ '"><a href="#"> <img src="'
									+ pack.thumbnail + '" />' + '<h3>'
									+ pack.heading1 + '</h3><p>'
									+ pack.heading2 + '</p> </a></li>');
				});

				/*
				 * $('#packs').live('pagebeforeshow', function(event) {
				 * 
				 * $('#packlist').listview('refresh'); });
				 */// $("#packlist").listview('refresh');
				$('#packlist').delegate(
						'li',
						'click',
						function(e) {
							passedParameter = $(this).get(0).getAttribute(
									'passed-parameter');
							console.log('clicked list ' + passedParameter);
							console.log(packs[passedParameter]);
							currentPack = packs[passedParameter];
							// $.loadPack(currentPack);
							e.preventDefault();
							$('#bldbtn').trigger('click');
						});

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
					// $.loadPack(currentPack);
					// Test plugin
					$('#band_wrapper').waitForImages(function() {
						console.log('All images are loaded.');
						$.mobile.changePage("#build", {
							transition : "flip"
						});
					});
				}

				return true;
			});

			$('#build').live('pagebeforeshow', function(event) {
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
					$('#band_wrapper').waitForImages(function() {
						console.log('All images are loaded.');
					});
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

		});

jQuery.loadPack = function(newPack) {
	var o = $(this[0]); // It's your element

	if (newPack == '') {
		return;
	}
	console.log("newPack " + newPack.id + " currentPack " + currentPack.id
			+ ' lastLoadedPack ' + lastLoadedPack.id);

	if (newPack.id == lastLoadedPack.id) {
		console.log("Old pack already loaded");
		return;
	}
	currentPack = newPack;
	lastLoadedPack = newPack;

	console.log("in loadpack " + currentPack.id);

	var image_manifest_url = currentPack.manifest; // "imgs/pack2_classic_manifest.txt";
	// we'll store the search term here

	if ($('link[title="packstyles"]').exists()) {
		$('link[title="packstyles"]').attr('disabled', 'disabled');
		$('link[title="packstyles"]').remove();
	}

	$('head').append(
			'<link title="packstyles" href="' + currentPack.packstyles
					+ '" rel="stylesheet" type="text/css" />');

	$('#bands').empty();

	// get the json file
	$.getJSON(image_manifest_url,
			function(json) {
				// this is where we can loop through the results in the
				// json object
				$.each(json.packs.bands, function(i, band) {
					console.log("next band " + band.divname);
					// append to div bands
					var divid = 'wrapper_cycle_' + band.divname;
					var cycleid = 'cycle_' + band.divname;
					$("#bands").append(
							'<div id="wrapper_cycle_' + band.divname
									+ '" style="z-index: ' + band.zindex
									+ '"> <ul id="cycle_' + band.divname
									+ '">');

					$.each(band.images, function(i, sprite) {
						// console.log("next image " + sprite.text);
						var inlinestyle = 'background-position: -'
								+ sprite.x + 'px -' + sprite.y + 'px; '
								+ ' height: ' + sprite.height
								+ 'px; width: ' + sprite.width
								+ 'px; background-image: url('
								+ band.background + '); '
								+ band.imagestyle;

						$('#' + cycleid).append('<li><a href="#"></a><div class='
												+ band.divname
												+ ' id="' + sprite.text
												+ '" style="'
												+ inlinestyle
												+ '"></div></li>');
					});
					$('#' + cycleid).append('</ul></div>');

					$('#' + cycleid).addCycle(band.divname);
					$('#' + cycleid).data('currSlide', 0);
					$('#' + cycleid).data('band', band);
					$('#' + cycleid).cycle({
						speed : 1000,
						fx : 'scrollHorz',
						timeout : 0,
						after : onAfter
					});

				});

				console.log("bkgd " + json.packs.bkgds.divname);
				var bkgd = json.packs.bkgds;
				console.log("next bkgd  " + bkgd.divname);
				var divid = 'wrapper_cycle_' + bkgd.divname;
				var cycleid = 'cycle_' + bkgd.divname;
				$("#bands").append(
						'<div id="wrapper_cycle_' + bkgd.divname
								+ '" style="z-index: ' + bkgd.zindex
								+ '"> <ul id="cycle_' + bkgd.divname
								+ '">');

				$.each(	bkgd.images,function(i, sprite) {
					// console.log("next image " +
					// sprite.text);
					$('head')
							.append(
									'<style type="text/css"> #'
											+ sprite.text
											+ '	{background-position: -'
											+ sprite.x
											+ 'px -'
											+ sprite.y
											+ 'px; '
											+ ' height: '
											+ sprite.height
											+ 'px; width: '
											+ sprite.width
											+ 'px; background-image: url('
											+ bkgd.background
											+ '); }</style>');
					$('#' + cycleid).append(
							'<li><a href="#"></a><div class='
									+ bkgd.divname
									+ ' id="'
									+ sprite.text
									+ '"></div></li>');
				});

				$('#' + cycleid).append('</ul></div>');
				$('#' + cycleid).addCycle(bkgd.divname);
				$('#' + cycleid).data('currSlide', 0);
				$('#' + cycleid).data('band', bkgd);
				$('#' + cycleid).cycle({
					speed : 1000,
					fx : 'scrollHorz',
					timeout : 0,
					after : onAfter
				});

				$active_cycle = $('#cycle_heads');
				console.log("clicking headbtn");
				$('#headbtn').trigger('click');

				if (navigator.userAgent.match(/Android/i)
						|| navigator.userAgent.match(/webOS/i)
						|| navigator.userAgent.match(/iPhone/i)
						|| navigator.userAgent.match(/iPad/i)) {
					console.log('on iPad');

				} else {

					$('#btn_next_head').unbind('click');
					$('#btn_next_head').click(function(e) {
						$active_cycle.cycle('next');
						console.log("clicknext");
						e.preventDefault();
					});

					$('#btn_prev_head').unbind('click');
					$('#btn_prev_head').click(function(e) {
						$active_cycle.cycle('prev');
						console.log("clickprev");
						e.preventDefault();
					});

				}

				$('#btn_done').unbind('click');
				$('#btn_done')
						.click(
								function(e) {
									console
											.log('#cycle_heads current slide = '
													+ $('#cycle_heads')
															.data(
																	'currSlide')
													+ ' divname '
													+ $('#cycle_heads')
															.data(
																	'band').divname);

									// canvas is a reference to a
									// <canvas> element

									// add a new grid element in vault
									// and add canvas
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

									$('#vaultGrid')
											.append(
													'<div class="'
															+ classname
															+ '"><div class="ui-bar" data-theme="b">'
															+ '<canvas id="'
															+ canvasName
															+ '" height="300"></canvas></div></div>');

									var drawingCanvas = document
											.getElementById(canvasName);

									var scaleBy = 3.5;
									var lmargin = 170;

									var weirdoid = new Object();
									var mybkgd = new Object();
									var myhead = new Object();
									var mybody = new Object();
									var myleg = new Object();
									var myxtra = new Object();

									var imgidx = $('#cycle_bkgds')
											.data('currSlide');
									var sprite = $('#cycle_bkgds')
											.data('band').images[imgidx];

									mybkgd.src = $('#cycle_bkgds')
											.data('band').background;
									mybkgd.topoffset = $('#cycle_bkgds')
											.data('band').top;
									mybkgd.sprite = sprite;
									weirdoid.bkgd = mybkgd;
									//drawInCanvas(drawingCanvas, weirdoid.bkgd, scaleBy, 0);

									imgidx = $('#cycle_heads').data(
											'currSlide');
									sprite = $('#cycle_heads').data(
											'band').images[imgidx];

									myhead.src = $('#cycle_heads')
											.data('band').background;
									myhead.topoffset = $('#cycle_heads')
											.data('band').top;
									myhead.sprite = sprite;
									weirdoid.head = myhead;
									//drawInCanvas(drawingCanvas, weirdoid.head, scaleBy, lmargin);

									// topoffset =
									// $('#cycle_heads').data('band').top;
									// context.drawImage(image,
									// sprite.x, sprite.y, sprite.width,
									// sprite.height, lmargin / scaleBy,
									// topoffset
									// / scaleBy, sprite.width /
									// scaleBy,
									// sprite.height / scaleBy);

									var context = drawingCanvas
											.getContext('2d');
									var image = new Image();

									imgidx = $('#cycle_bodies').data(
											'currSlide');
									sprite = $('#cycle_bodies').data(
											'band').images[imgidx];

									mybody.src = $('#cycle_bodies')
											.data('band').background;
									mybody.topoffset = $(
											'#cycle_bodies').data(
											'band').top;
									mybody.sprite = sprite;
									weirdoid.body = mybody;
									//drawInCanvas(drawingCanvas,weirdoid.body, scaleBy,lmargin);

									imgidx = $('#cycle_legs').data(
											'currSlide');
									sprite = $('#cycle_legs').data(
											'band').images[imgidx];

									myleg.src = $('#cycle_legs').data(
											'band').background;
									myleg.topoffset = $('#cycle_legs')
											.data('band').top;
									myleg.sprite = sprite;
									weirdoid.leg = myleg;
									//drawInCanvas(drawingCanvas, weirdoid.leg, scaleBy, lmargin);

									imgidx = $('#cycle_xtras').data(
											'currSlide');
									sprite = $('#cycle_xtras').data(
											'band').images[imgidx];

									myxtra.src = $('#cycle_xtras')
											.data('band').background;
									myxtra.topoffset = $('#cycle_xtras')
											.data('band').top;
									myxtra.sprite = sprite;
									weirdoid.xtra = myxtra;
									//drawInCanvas(drawingCanvas, weirdoid.xtra, scaleBy, lmargin);

							
									$weirdoids.push(weirdoid);
									try {
										localStorage.setItem("myWeirdoids",
														JSON.stringify($weirdoids)); // store  the item in the database
									} catch (e) {
										if (e == QUOTA_EXCEEDED_ERR) {
											alert("Quota exceeded!");
										}
									}

									e.preventDefault();
								});
				// $.mobile.changePage( "#build", { transition: "flip"}
				// );
			});

};

jQuery.saveCreation = function() {
	var o = $(this[0]); // It's your element

};

function drawInCanvas(drawingCanvas, weirdoid, scaleBy, lmargin) {
	var context = drawingCanvas.getContext('2d');
	var img = new Image();
	img.src = weirdoid.src;
	var sprite = weirdoid.sprite;

	console.log("drawinCanvas " + img.src + " " + sprite.x);

	context.drawImage(img, sprite.x, sprite.y, sprite.width, sprite.height,
			lmargin / scaleBy, weirdoid.topoffset / scaleBy, sprite.width
					/ scaleBy, sprite.height / scaleBy);

};

function onAfter(curr, next, opts) {
	var index = opts.currSlide;

	if (typeof $active_cycle == 'undefined') {
		console.log("$active_cycle undefined");
		return;
	}
	$active_cycle.currSlide = index;
	$active_cycle.data('currSlide', index);
	console.log('current slide = ' + index + ' curr ' + $active_cycle.currSlide);

	 //get the current value of cycles
//	 console.log('#cycle_heads current slide = ' +  $('#cycle_heads').data('currSlide') + ' divname ' +
//			 $('#cycle_heads').data('band').divname);
//	 console.log('#cycle_bodies current slide = ' + $('#cycle_bodies').data('currSlide') + ' divname ' +
//			 $('#cycle_bodies').data('band').divname);
//	 console.log('#cycle_legs current slide = ' + $('#cycle_legs').data('currSlide') + ' divname ' +
//			 $('#cycle_legs').data('band').divname);
//	 console.log('#cycle_xtras current slide = ' +
//	 $('#cycle_xtras').data('currSlide') + ' divname ' +
//	 $('#cycle_xtras').data('band').divname);
//	 console.log('#cycle_bkgds current slide = ' +
//	 $('#cycle_bkgds').data('currSlide') + ' divname ' +
//	 $('#cycle_bkgds').data('band').divname);
}

function weirdoid(bkgd, head, body, leg, xtra) {
	this.bkgd = bkgd;
	this.head = head;
	this.body = body;
	this.leg = leg;
	this.xtra = xtra;
}
function cycleSprite(src, topoffset, sprite) {
	this.src = src;
	this.topoffset = topoffset;
	this.sprite = sprite;
}
