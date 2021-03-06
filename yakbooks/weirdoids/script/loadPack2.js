var $pack_key = null;
var $loadedpacks = null;
var $items = [];

var blank = new Image();
blank.src = 'imgs/blank.gif';

jQuery.loadPack = function(newPack) {
	var o = $(this[0]); // It's your element

	if (newPack == '') {
		return;
	}
	console.log("newPack " + newPack.id + " currentPack " + currentPack.id
			+ ' lastLoadedPack ' + lastLoadedPack.id);

	// 
	if ($loadedpacks == null)
		$loadedpacks = [];

	// see if newPack in loadedpacks
	if ($.inArray(newPack.id, $loadedpacks) > -1) {
		console.log("Pack previously loaded");
		$.mobile.changePage("#build", {
			transition : "flip"
		});
		return;
	}

	if (newPack.id == lastLoadedPack.id) {
		console.log("Old pack already loaded");
		$.mobile.changePage("#build", {
			transition : "flip"
		});
		return;
	}

	$.mobile.showPageLoadingMsg();

	currentPack = newPack;
	lastLoadedPack = newPack;

	console.log("in loadpack " + currentPack.id);

	// see if in localstorage
	$pack_key = "pack1_" + currentPack.id;

	var cycleid = currentPack.id;

	// if (localStorage.getItem($pack_key) === null) {
	// did not found key
	var image_manifest_url = currentPack.manifest; // "imgs/pack2_classic_manifest.txt";

	image_manifest_url = "server/read_p1.php"; // + '&cycleid=' +

	if ($online) {
		// currentPack.id;
		console.log("getting pack " + image_manifest_url);

		var request = $.ajax({
			cache : false,
			data : ({
				cycleid : currentPack.id,
				packfamilyid : currentPack.familyid,
				packfile : currentPack.packfile
			}),
			success : function(json) {
				// do something now that the data is loaded
				$.mobile.hidePageLoadingMsg();
				if (json.errorcode == 0) {
					console.log("Read the pack file!");
					$loadedpacks.push(currentPack.id);
					$.processPackJson(json.bands);
				} else {
					serverAlert("Read pack failure", json);
					console.log("Read pack failure");
					console.log(json.errormsg);
				}
			},
			url : image_manifest_url,
			complete : function(xhr, data) {
				if (xhr.status != 0 && xhr.status != 200)
					alert('Error calling server to read pack. Status='
							+ xhr.status + " " + xhr.statusText);
			}
		});

		request.fail(function(jqXHR, textStatus, excObject) {
			$.mobile.hidePageLoadingMsg();
			alert("get pack Request failed: " + textStatus);
		});

	} else {
		$.mobile.hidePageLoadingMsg();
		alert("Not online and no pack info available for " + image_manifest_url
				+ " key " + $pack_key);
	}
};

function checkInstalledProducts() {
	console.log("checkInstalledProducts");

	// iterate through all listitems
	$('.packprice').each(function() {
		// list item
		packid = $(this).attr('passed-parameter');
		curpack = $items[packid];
		if (curpack == null) {
			alert("Pack referenced in packlist missing in $items: " + packid);
		} else {
			// look for pack id in user prodkeys
			if (userHasPurchased(packid)) {
				$(this).html('Installed');
			} else {
				$(this).html(curpack.cost_str);
			}
		}
	});

}
function processProductList(json) {
	$items = [];

	if (localStorage.getItem($packlist_key) === null) {
		localStorage.setItem($packlist_key, JSON.stringify(json));
	}

	$
			.each(
					json.families,
					function(i, family) {
						console.log("processProductList: family "
								+ family.familyid + " " + family.familyname);

						// $("#packlist").append(
						// '<li data-role="list-divider" role="heading">'
						// + family.familyname + '</li>');
						$
								.each(
										family.items,
										function(i, item) {
											console.log("next item " + item.id);
											$items["familyid"] = family.familyid;
											$items[item.id] = item;
											// <li>
											// <div
											// class="packprice">$1.99</div>
											// <div class="packdesc">Free
											// Original Starter Set</div> <a
											// href="#"><img
											// src="imgs/icon_pack1.png" />
											// </a></li>
											//										
											var nuli = '<li class="packprice-li" passed-parameter="'
													+ item.id
													+ '"><div class="packprice" passed-parameter="'
													+ item.id
													+ '">xxx</div><div class="packdesc">'
													+ item.heading1
													+ '</div><a href="#" id="btn_get_pack"  data-role="button" passed-parameter="'
													+ item.id
													+ '"><img src="'
													+ item.thumbnail
													+ '"></a></li>';
											// console.log("nuli:" + nuli);

											$("#packlist").append(nuli);
											// console.log("packlist count: " +
											// $("#packlist").length + " " +
											// $("#packlist").children().length);
											// $("#packlist")
											// .append(
											// '<li class="catalog-list-item"
											// passed-parameter="'
											// + item.id
											// + '"><div
											// class="catalog-item"><img
											// class="inline preview-thumbnail"
											// src="'
											// + item.thumbnail
											// + '" />'
											// + '<h3>'
											// + item.item_type
											// + ' - '
											// + item.heading1
											// + '</h3>'
											// + item.heading2
											// + '</div>'
											// + '<div id="cost_str_div">'
											// + '<a href="#" id="btn_get_pack"
											// data-role="button"
											// passed-parameter="'
											// + item.id
											// + '">'
											// + item.cost_str
											// + '</a></div>'
											// + '</li>');
										});
						// $("#packlist").listview("refresh");

						$("#bldbtn,#packsbtn").button('enable').css('opacity',
								'1');
					});

	/*
	 * $('#packs').live('pagebeforeshow', function(event) {
	 * 
	 * $('#packlist').listview('refresh'); });
	 */// $("#packlist").listview('refresh');
	$.each($('#packlist a'), function() {
		$(this).click(function(e) {
			passedParameter = $(this).get(0).getAttribute('passed-parameter');
			console.log('clicked list ' + passedParameter);
			console.log($items[passedParameter]);
			currentPack = $items[passedParameter];

			if (userHasPurchased(currentPack.id) || currentPack.cost == 0) {
				// all loading done in build screen click handler
				$('#bldbtn').trigger('click');
			} else {
				// begin purchase process
				console.log("begin purchase flow");

				if (!$is_logged_in || $userid == null) {
					// we need user to select among possible user keys if more
					// than 1
					alert("You must log in before you can buy new Packs!");
					$srcPage = "#packs";
					$afterLoginPage = "#packs";
					$.mobile.changePage("#loginaccount", {
						transition : "fade"
					});

					return false;
				}

				beginPackPurchase(currentPack, $userid);
			}
			return false;
			// if (currentPack.cost == undefined) {
			// alert("No cost found for currentPack");
			// } else if (currentPack.cost > 0) {
			// console.log("Current pack not installed and costs "
			// + currentPack.cost);
			// $.mobile.changePage("#buypreview", {
			// transition : "flip"
			// });
			// return false;
			// } else {
			// e.preventDefault();
			// $('#bldbtn').trigger('click');
			//
			// }
		});
	});

};

function getProductList() {
	// var packlist_url = "server/readpacks2.php"; // "imgs/packlist.txt";
	var packlist_url = "server/read_catalog.php"; // "imgs/packlist.txt";
	// currentPack.id;

	// get the json file
	console.log("getting catalog " + packlist_url);
	var request = $.ajax({
		cache : false,
		success : function(json) {
			// do something now that the data is loaded
			if (json.errorcode == 0) {
				console.log("Read catalog!");
				processProductList(json.catalog);
			} else {
				serverAlert("Read catalog failure", json);
				console.log("Read catalog failure");
				console.log(json.errormsg);
			}
		},
		url : packlist_url,
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to get catalog. Status='
						+ xhr.status + " " + xhr.statusText);
		}
	});

	request.fail(function(jqXHR, textStatus, errorThrown) {
		alert("get catalog Request failed: " + textStatus + " " + errorThrown);
		console.log("incoming Text " + jqXHR.responseText);
	});

}

function process_band(i, band) {
	console.log("next band " + band.divname);
	// append to div bands
	var divid = 'wrapper_cycle_' + band.divname;
	var cycleid = 'cycle_' + band.divname;

	//if ($("#" + divid + " #" + cycleid).length > 0)
		if ($("#bands #" + cycleid).length > 0)
		console.log("cycle already exists");
	else {
		console.log("no pre-existing cycle");

		$("#bands").append('<div class="cyclediv" id="' + cycleid + '">');
		$('#' + cycleid).css("z-index", band.zindex);

	}

	$
			.each(
					band.images,
					function(i, sprite) {
						// console.log("next image " +

						var src = sprite.src;
						if ($.browser.msie) {

						}

						$('#' + cycleid)
								.append(
										'<div  class="scalable_div" style=" margin-top: '
												+ band.top
												+ 'px; margin-left: '
												+ band.left
												+ 'px; height: '
												+ band.height
												+ 'px; width: '
												+ band.width
												+ 'px; position:absolute;background-color:transparent;">'
												+ '<image id="' + sprite.id
												+ '" class="cycleimg" src="'
												+ sprite.src // dataurl
												+ '"></image></div>');
						$('#' + cycleid + ' div').attr('bandtop', band.top);
						$('#' + cycleid + ' div').attr('bandleft', band.left);
						$('#' + cycleid + ' div').attr('bandheight',
								band.height);
						$('#' + cycleid + ' div').attr('bandwidth', band.width);

						if ($.browser.msie) {

							$('#' + sprite.id).each(function() {
								if (!this.complete) {
									this.onload = function() {
										// fixPng(this);
									};
								} else {
									// fixPng(this);
								}
							});

						}
					});

	$('#' + cycleid).append('</div>');

	// $('#' + cycleid).addCycle(band.divname);
	$('#' + cycleid).data('currSlide', 0);

	// if cycle previously had images saved, then just append new ones, else
	if ($('#' + cycleid).data('band') == undefined) {
		$('#' + cycleid).data('band', band);
	} else {
		$oldband = $('#' + cycleid).data('band');
		$.merge($oldband.images, band.images);
		$('#' + cycleid).data('band', $oldband);
	}

	$('#' + cycleid).cycle({
		speed : 500,
		fx : 'scrollHorz',
		timeout : 0,
		cleartype : false,
		cleartypeNoBg : true,
		after : onAfter,
		slideResize : 0
	});
	if ($active_cycle == '')
		$active_cycle = $('#' + cycleid);

};

jQuery.processPackJson = function(json) {

	console.log("processPackJson ");

	if (localStorage.getItem($pack_key) === null) {
		localStorage.setItem($pack_key, JSON.stringify(json));
	}

	// we'll store the search term here

	if ($('link[title="packstyles"]').length > 0) {
		$('link[title="packstyles"]').attr('disabled', 'disabled');
		$('link[title="packstyles"]').remove();
	}

	// $('head').append(
	// '<link title="packstyles" href="' + currentPack.packstyles
	// + '" rel="stylesheet" type="text/css" />');

	// $('#bands').empty();
	$active_cycle = '';

	$.each(json.bands, function(i, band) {
		process_band(i, band);
	});

	// console.log("clicking headbtn");
	// $('#headbtn').trigger('click');

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

	$('#build').trigger('create');

	console.log("loadpack mid");

	var containers = $('.scalable_div');

	// $(containers).waitForImages(
	myWaitForImages(function() {
		console.log('Before show, all images loaded.');
		readyToResize();
	}, function(loaded, count, success) {

		console.log("Loaded " + loaded + ' of ' + count + ' images has '
				+ (!success ? 'failed to load' : 'loaded') + '.');

	});

	/*
	 * $('#banks-nav-bar').waitForImages( function() { console.log('Before
	 * readyToResize, all images loaded.'); readyToResize(); }, function(loaded,
	 * count, success) {
	 * 
	 * console.log($(this).attr("id") + " " + loaded + ' of ' + count + ' images
	 * has ' + (!success ? 'failed to load' : 'loaded') + '.');
	 * 
	 * });
	 */
};

function readyToResize() {

	$.resizeImages();

	$('#donebtn').unbind('click');
	$('#donebtn').click(
			function(e) {

				// console.log("in packs vault");

				console.log('#cycle_heads current slide = '
						+ $('#cycle_heads').data('currSlide') + ' divname '
						+ $('#cycle_heads').data('band').divname);

				// canvas is a reference to a
				// <canvas> element

				// add a new grid element in vault
				// and add canvas
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

				$('#vaultgrid').append(
						'<div class="' + classname
								+ '"><div class="ui-bar" data-theme="b">'
								+ '<canvas id="' + canvasName
								+ '" height="300"></canvas></div></div>');

//				if ($.browser.msie) {
//					var el = document.createElement(canvasName);
//					G_vmlCanvasManager.initElement(el);
//					var context = el.getContext('2d');
//				} else {
//					var drawingCanvas = document.getElementById(canvasName);
//					var context = drawingCanvas.getContext('2d');
//				}

				var scaleBy = 3.5;
				var lmargin = 170;

				var weirdoid = new Object();
				weirdoid.fname = "";
				weirdoid.lname = "";

				var mybkgd = new Object();
				var myhead = new Object();
				var mybody = new Object();
				var myleg = new Object();
				var myxtra = new Object();

				var imgidx = $('#cycle_bkgds').data('currSlide');
				var band = $('#cycle_bkgds').data('band');
				var sprite = band.images[imgidx];

				mybkgd.src = band.background;
				mybkgd.topoffset = band.top;
				sprite.xloc = band.left;
				sprite.yloc = band.top;
				sprite.height = band.height;
				sprite.width = band.width;

				mybkgd.sprite = sprite;
				weirdoid.bkgd = mybkgd;
				// drawInCanvas(drawingCanvas,
				// weirdoid.bkgd, scaleBy, 0);

				imgidx = $('#cycle_heads').data('currSlide');
				band = $('#cycle_heads').data('band');
				sprite = band.images[imgidx];

				myhead.src = band.background;
				myhead.topoffset = band.top;
				sprite.xloc = band.left;
				sprite.yloc = band.top;
				sprite.height = band.height;
				sprite.width = band.width;

				myhead.sprite = sprite;
				weirdoid.head = myhead;

				var image = new Image();

				imgidx = $('#cycle_bodies').data('currSlide');
				band = $('#cycle_bodies').data('band');
				sprite = band.images[imgidx];

				mybody.src = band.background;
				mybody.topoffset = band.top;
				sprite.xloc = band.left;
				sprite.yloc = band.top;
				sprite.height = band.height;
				sprite.width = band.width;
				mybody.sprite = sprite;
				weirdoid.body = mybody;
				// drawInCanvas(drawingCanvas,weirdoid.body,
				// scaleBy,lmargin);

				imgidx = $('#cycle_legs').data('currSlide');
				band = $('#cycle_legs').data('band');
				sprite = band.images[imgidx];

				myleg.src = band.background;
				myleg.topoffset = band.top;
				sprite.xloc = band.left;
				sprite.yloc = band.top;
				sprite.height = band.height;
				sprite.width = band.width;
				myleg.sprite = sprite;
				weirdoid.leg = myleg;
				// drawInCanvas(drawingCanvas, weirdoid.leg,
				// scaleBy, lmargin);

				imgidx = $('#cycle_xtras').data('currSlide');
				band = $('#cycle_xtras').data('band');
				sprite = band.images[imgidx];

				myxtra.src = band.background;
				myxtra.topoffset = band.top;
				sprite.xloc = band.left;
				sprite.yloc = band.top;
				sprite.height = band.height;
				sprite.width = band.width;
				myxtra.sprite = sprite;
				weirdoid.xtra = myxtra;
				// drawInCanvas(drawingCanvas,
				// weirdoid.xtra, scaleBy, lmargin);
				$lastweirdoid = weirdoid;

				$.mobile.changePage("#previewpage", {
					transition : "fade"
				});

				e.preventDefault();
				return true;
			});
	// $.mobile.changePage( "#build", { transition: "flip"}
	// );
	$.mobile.hidePageLoadingMsg();

	$.mobile.changePage("#build", {
		transition : "flip"
	});

};

jQuery.resizeHome = function() {
	console.log("resize home page " + $.mobile.activePage);
	return;
	// background image auto adjusts, but we need to move images accordingly

	var divheight = $('#home').outerHeight();
	if (divheight == 0)
		return;

	var scaleFactor = Math.max(Math.abs(Math.min(divheight / 1024, 1)), 0.5);
	console.log("scalefactor " + scaleFactor + '  divheight ' + divheight);

	$('#btn_vault').css('top',
			parseInt($('#btn_vault').attr('origtop')) * scaleFactor);
	$('#btn_packs').css('top',
			parseInt($('#btn_packs').attr('origtop')) * scaleFactor);
	$('#btn_build').css('top',
			parseInt($('#btn_build').attr('origtop')) * scaleFactor);
};

$(window).load(function() {
	// 
//	$('#btn_vault').attr('origtop', $('#btn_vault').css('top'));
//	$('#btn_packs').attr('origtop', $('#btn_packs').css('top'));
//	$('#btn_build').attr('origtop', $('#btn_build').css('top'));
	// $.resizeHome();
});

jQuery.resizeImages = function() {
	return;
	
	var o = $(this[0]); // It's your element

	// $.resizeHome();

	console.log("resizeImages ");
	var buildheight = $('#build').outerHeight();
	var bandheight = $('#bands').outerHeight();
	console.log("build height " + bandheight);
	console.log("banks-nav-bar height " + $('#banks-nav-bar').outerHeight());
	var bankheight = $('#banks-nav-bar').outerHeight();
	var hdrheight = $('#buildhdr').outerHeight();

	if (bankheight == 0 || bandheight == 0)
		return;

	$('#band_wrapper').height(Math.min(1024, buildheight) - bankheight);// -
	// $('#btn_done').height());

	var divwidth = $("#bands").outerWidth();
	var wfactor = Math.min(divwidth / 768, 1);
	var hfactor = Math.min(bandheight / 1024, 1);
	var factor = Math.min(wfactor, hfactor);

	console.log("resizeImages divwidth " + divwidth + ' factor ' + factor);
	console.log("resizeImages band_wrapper " + $('#band_wrapper').width() + ' '
			+ $('#band_wrapper').height());

	$(".scalable_div").each(function() {
		// console.log("scalable div ");
		var band = $(this).attr('band');
		var normtop = $(this).attr('bandtop');
		var normleft = $(this).attr('bandleft');

		$(this).css('margin-top', normtop * hfactor);
		$(this).css('margin-left', normleft * wfactor);

		var normwidth = $(this).attr('bandwidth');
		var normheight = $(this).attr('bandheight');

		var w = Math.min(normwidth * wfactor, $('#band_wrapper').width());
		var h = Math.min(normheight * hfactor, $('#band_wrapper').height());
		$(this).width(w);
		$(this).height(h);
	});

//	$('#btn_build').css('top', $btn_build_top * hfactor);
//	$('#btn_packs').css('top', $btn_packs_top * hfactor);
//	$('#btn_vault').css('top', $btn_vault_top * hfactor);

	// $("#bands").trigger('create');
};

function myWaitForImages(finishedCallback, eachCallback) {
	var eventNamespace = 'myWaitForImages';
	var allImgs = $('.scalable_div').find('img');
	var allImgsLength = allImgs.length, allImgsLoaded = 0;

	// If no images found, don't bother.
	if (allImgsLength == 0) {
		finishedCallback();
	};

	$.each(allImgs, function(i, img) {

		var image = new Image;

		// Handle the image loading and error with the same callback.
		$(image).bind(
				'load.' + eventNamespace + ' error.' + eventNamespace,
				function(event) {
					allImgsLoaded++;

					// If an error occurred with loading the image, set the
					// third argument accordingly.
					eachCallback.call(img.element, allImgsLoaded,
							allImgsLength, event.type == 'load');

					if (allImgsLoaded == allImgsLength) {
						finishedCallback();
						return false;
					};

				});

		image.src = img.src;
	});
}

function fixPng(png) {
	// get src

	var src = png.src;
	if (!src.match(/png$/))
		return;

	// set width and height
	if (!png.style.width) {
		png.style.width = $(png).width();
	}
	if (!png.style.height) {
		png.style.height = $(png).height();
	}
	// replace by blank image
	png.onload = function() {
	};
	png.src = blank.src;
	// set filter (display original image)
	png.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"
			+ src + "',sizingMethod='scale')";
}
