var $pack_key = null;
var $loadedpacks = null;
var $items = [];
var $eastereggs = [];

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
			transition : "fade"
		});
		return;
	}

	if (newPack.id == lastLoadedPack.id) {
		console.log("Old pack already loaded");
		$.mobile.changePage("#build", {
			transition : "fade"
		});
		return;
	}

	$('#band_wrapper').hide();
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
				
				if (json.errorcode == 0) {
					console.log("Read the pack file!");
					$loadedpacks.push(currentPack.id);
					$.processPackJson(json.bands, currentPack.id);
				} else {
					$.mobile.hidePageLoadingMsg();
					serverAlert("Read pack failure", json);
					console.log("Read pack failure");
					console.log(json.errormsg);
				}
			},
			url : image_manifest_url,
			complete : function(xhr, data) {
				$.mobile.hidePageLoadingMsg();
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
			var prev_installed = ($.inArray(curpack.id, $loadedpacks) >= 0);

			if (userHasPurchased(packid) || prev_installed) {
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

						$
								.each(
										family.items,
										function(i, item) {
											console.log("next item " + item.id);
											$items["familyid"] = family.familyid;
											$items[item.id] = item;

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

										});
						// $("#packlist").listview("refresh");
						loadCarousel($items);

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

function unload_pack(pack) {
	// iterate through all cycles, delete those that are in this pack
	$('.cycle_element').each(function() {

		var packid = $(this).attr('packid');

		if (packid == pack.id) {
			// find parent
			$(this).remove();
		}

	});

	// remove from loaded packs
	$loadedpacks.splice($.inArray(pack.id, $loadedpacks), 1);
	if (currentPack.id == pack.id) {
		currentPack = '';
		lastLoadedPack = '';
	}

	if ($loadedpacks.length == 0) {
		console.log("removed last pack from builder");
	}

}

function process_easteregg(easteregg) {
	console.log("Adding an easter egg: src= " + easteregg.src + " pct = " + easteregg.easteregg);
	$eastereggs.push(easteregg);
	
}

function process_band(i, band, packid, pack_easteregg_ids) {
	console.log("next band " + band.divname);
	// append to div bands
	var divid = band.divname + "_w";
	var cycleid = 'cycle_' + band.divname;
	var view_width = $('body').width();

	// if ($("#" + divid + " #" + cycleid).length > 0)
	if ($("#bands #" + cycleid).length > 0)
		console.log("cycle already exists");
	else {
		console.log("no pre-existing cycle");

		// $("#bands").append('<div class="cyclediv" id="' + cycleid + '">');
		$("#bands").append(
				'<div id ="' + divid + '" class="scalable_wrapper" ><div id="'
						+ cycleid + '" class="scalable_div">');
		$('#' + cycleid).css("z-index", band.zindex);
		$('#' + cycleid).css("margin", "0px auto");

		$('#' + cycleid).width(view_width);

		$('#' + divid).css('margin-top', band.top + "px");
		$('#' + divid).css('position', 'absolute');
		$('#' + divid).attr('bandtop', band.top);

	}

	$.each(band.images, function(i, sprite) {
		// console.log("next image " +

		var src = sprite.src;
		var easteregg = (sprite.easteregg) ? sprite.easteregg : 1.0;
		var easteregg_id = (sprite.easteregg_id) ? sprite.easteregg_id : -1;

		if (check_show_easteregg(easteregg, easteregg_id, pack_easteregg_ids)) {

			$('#' + cycleid).append(
					'<div class="cycle_element" packid="' + packid
							+ '" ><img id="' + sprite.id
							+ '" class="cycleimg" src="' + sprite.src // dataurl
							+ '"></image></div>');

		}

	});

	$('#' + cycleid).attr('bandtop', band.top);
	$('#' + cycleid).attr('bandleft', band.left);
	$('#' + cycleid).attr('bandheight', band.height);
	$('#' + cycleid).attr('bandwidth', band.width);

	$('#' + cycleid).append('</div></div>');
	$('#' + cycleid + " div").width(view_width + "px");
	$('#' + cycleid + " div").css("height", band.height);
	$('#' + cycleid).data('currSlide', 0);

	// if cycle previously had images saved, then just append new ones, else
	if ($('#' + cycleid).data('band') == undefined) {
		$('#' + cycleid).data('band', band);
	} else {
		$oldband = $('#' + cycleid).data('band');
		$.merge($oldband.images, band.images);
		$('#' + cycleid).data('band', $oldband);
	}

	if ($('#' + cycleid).children().length > 0) {
		var slidecnt = $('#' + cycleid).children().length;
		$('#' + cycleid).cycle({
			speed : 500,
			fx : 'scrollHorz',
			timeout : 0,
			cleartype : false,
			cleartypeNoBg : true,
			after : onAfter,
			startingSlide : Math.floor(Math.random() * slidecnt),
			slideResize : 0
		});
		if ($active_cycle == '')
			$active_cycle = $('#' + cycleid);
	}

};

function check_show_easteregg(easteregg, easteregg_id, pack_easteregg_ids) {
	var showit = true;

	if ($.inArray(easteregg_id, pack_easteregg_ids) >= 0) {
		return true;
	}

	if (easteregg < 1.0) {
		var randval = Math.random();
		showit = (randval <= easteregg);

	}

	if (!showit)
		console.log("Skipping easteregg image " + easteregg);
	else if (easteregg < 1.0) {
		console.log("showing easteregg image " + easteregg);
		pack_easteregg_ids.push(easteregg_id);
	}

	return showit;
}
jQuery.processPackJson = function(json, packid) {

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

	
	var pack_easteregg_ids = [];
	
	$.each(json.bands, function(i, band) {
		process_band(i, band, packid, pack_easteregg_ids);
	});

	if (json.eastereggs) {
		$.each(json.eastereggs, function(i, easteregg) {
			process_easteregg(easteregg);
		});
	}
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
			if ($active_cycle.children().length > 0) {
				$random_cycle = false;
				$active_cycle.cycle('next');
			}
			console.log("clicknext");
			e.preventDefault();
		});

		$('#btn_prev_head').unbind('click');
		$('#btn_prev_head').click(function(e) {
			if ($active_cycle.children().length > 0) {
				$random_cycle = false;
				$active_cycle.cycle('prev');
			}
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

};

function readyToResize() {

	$.resizeImages(afterResizeImages);
}

function afterResizeImages() {
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

				// if ($.browser.msie) {
				// var el = document.createElement(canvasName);
				// G_vmlCanvasManager.initElement(el);
				// var context = el.getContext('2d');
				// } else {
				// var drawingCanvas = document.getElementById(canvasName);
				// var context = drawingCanvas.getContext('2d');
				// }

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


				// save easter eggs

				weirdoid.eastereggs = $current_eastereggs;
				weirdoid.std_width = STD_WIDTH;
				weirdoid.std_height = STD_HEIGHT;
				weirdoid.width_to_height = WIDTH_TO_HEIGHT;
				
				$lastweirdoid = weirdoid;

				$.mobile.changePage("#previewpage", {
					transition : "fade"
				});

				e.preventDefault();
				return true;
			});

	$.mobile.hidePageLoadingMsg();

	$.mobile.changePage("#build", {
		transition : "fade"
	});

};

jQuery.resizeHome = function() {
	console.log("resize home page " + $.mobile.activePage);
	return;
	// background image auto adjusts, but we need to move images accordingly

	var divheight = $('#home').outerHeight();
	if (divheight == 0)
		return;

	var scaleFactor = Math.max(Math.abs(Math.min(divheight / STD_HEIGHT, 1)), 0.5);
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
	// $('#btn_vault').attr('origtop', $('#btn_vault').css('top'));
	// $('#btn_packs').attr('origtop', $('#btn_packs').css('top'));
	// $('#btn_build').attr('origtop', $('#btn_build').css('top'));
	// $.resizeHome();
});

jQuery.resizeImages = function(callback) {

	var o = $(this[0]); // It's your element

	// $.resizeHome();

	console.log("resizeImages ");
	var buildheight = $('#build').outerHeight();
	console.log("#buildheight height " + buildheight);
	
	var bandheight = $('#bands').outerHeight();
	console.log("#bands height " + bandheight);
	
	//console.log("banks-nav-bar height " + $('#banks-nav-bar').outerHeight());
	//var bankheight = $('#banks-nav-bar').outerHeight();
	var hdrheight = $('#buildhdr').outerHeight()
			+ parseInt($('#buildhdr').css("border-top-width"))
			+ parseInt($('#buildhdr').css("border-bottom-width"));
	
	var buildbar_height = $('#buildbar').outerHeight();
	
	var body_height = $('body').height();

	console.log("resizeImages: hdr:" + hdrheight + " buildbar:" + buildbar_height + " body: " + body_height);

	if (hdrheight == 0 || hdrheight == 0 || buildbar_height == 0 || body_height == 0) {
		if (callback != undefined && callback != null) {
			callback();
		}
		console.log("bad vals");
		return;
	}

	var nu_bands_height = body_height - hdrheight - buildbar_height;

	
	$('#band_wrapper').height(Math.min(STD_HEIGHT, nu_bands_height));
	$('#band_wrapper').css("min-height", Math.min(STD_HEIGHT, nu_bands_height));

	var divwidth = $("#bands").outerWidth();
	var wfactor = Math.min(divwidth / STD_WIDTH, 1);

	var hfactor = Math.min(nu_bands_height / STD_HEIGHT, 1);

	var factor = Math.min(wfactor, hfactor);

	console.log("resizeImages hfactor " + hfactor + " nu_bands_height " + nu_bands_height
			+ " body_height " + body_height);
	
	var hpct = (nu_bands_height/body_height) * 100;
	console.log("calculated band pct = " + hpct);

	var width_to_height = STD_WIDTH/STD_HEIGHT;
	var nu_width = width_to_height * $('#band_wrapper').height();
	var body_width = $('body').width();
		
	var wpct = (nu_width / body_width) * 100.0;
	console.log("new wrapper width: " + nu_width + " body_width: " + body_width + " wpct" + wpct);
	$("#band_wrapper").width(wpct + '%');
	
	//$("#band_wrapper").width(nu_width);
	
	$(".scalable_wrapper").each(function() {
		// console.log("scalable div ");

		var band = $(this).attr('band');
		var normtop = $(this).attr('bandtop');
		var normleft = $(this).attr('bandleft');
		var h = Math.min(normtop * hfactor, normtop);
		
		// set margin top as pct
		var toppct = 
		$(this).css('margin-top', h + "px");
	});

	$(".scalable_div").each(function() {
		// console.log("scalable div ");

		var band = $(this).attr('band');
		var normtop = $(this).attr('bandtop');
		var normleft = $(this).attr('bandleft');

		// $(this).css('margin-top', normtop * hfactor);
		// $(this).css('margin-left', normleft * wfactor);

		var normwidth = $(this).attr('bandwidth');
		var normheight = $(this).attr('bandheight');

		var w = Math.min(normwidth * hfactor, $('#band_wrapper').width());
		var h = Math.min(normheight * hfactor, $('#band_wrapper').height());

		$(this).width("100%");
		$(this).height(h);

		// set new width of each image
		$(this).find("img").each(function() {
			$(this).height(h);
			$(this).width(w);
		});
	});
	
	$(".cycle_element").each(function() {
		$(this).width("100%");
	});

	if (callback != undefined && callback != null)
		callback();

	// $('#btn_build').css('top', $btn_build_top * hfactor);
	// $('#btn_packs').css('top', $btn_packs_top * hfactor);
	// $('#btn_vault').css('top', $btn_vault_top * hfactor);

	// $("#bands").trigger('create');
};

function myWaitForImages(finishedCallback, eachCallback) {
	var eventNamespace = 'myWaitForImages';
	var allImgs = $('#build').find('img');
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

function loadCarousel(items) {
	// Simply add all items at once and set the size accordingly.
	var itemcnt = 0;

	jQuery.each(items, function(i, item) {
		if (item != undefined) {
			var packid = 'build_packid_' + item.id;
			$('#mycarousel').append(mycarousel_getItemHTML(item, packid));
			if ($.inArray(item.id, $loadedpacks) < 0) {

				$('#' + packid).addClass('notloaded_pack');
			} else
				$('#' + packid).removeClass('notloaded_pack');

			$('#' + packid).data('item', item);
			itemcnt++;
		}
	});

	jQuery('#mycarousel').jcarousel({
		scroll : 1,
		size : itemcnt
	});

	$('.build_pack').click(function(e) {
		var item = $(this).data('item');
		console.log("clicked build pack: item = " + item.id);
		e.preventDefault();

		// see if newPack in loadedpacks
		if ($.inArray(item.id, $loadedpacks) < 0) {
			console.log("Pack not previously loaded");
			currentPack = item;
			// if (userHasPurchased(currentPack.id) || currentPack.cost == 0) {
			// // all loading done in build screen click handler
			// $('#bldbtn').trigger('click');
			// } else {

			beginPackPurchase(item, $userid);
			// }

			return;
		} else {
			// pack already loaded. Now what?
			console.log("Pack already loaded");
			console.log("unloading pack");
			unload_pack(item);
			$(this).addClass('notloaded_pack');

			return;

		}

	});
};

function mycarousel_getItemHTML(item, packid) {

	return '<li><a href="#" id="' + packid + '" class="build_pack"><img src="'
			+ item.thumbnail + '"  alt="' + item.heading1 + '" /></a></li>';
};
