var $pack_key = null;

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

	// see if in localstorage
	$pack_key = "pack1_" + currentPack.id;


	if (localStorage.getItem($pack_key) === null) {
		// did not found key
		var image_manifest_url = currentPack.manifest; // "imgs/pack2_classic_manifest.txt";
		image_manifest_url = "server/readcycles.php";// + '&cycleid=' +
		// currentPack.id;

		// get the json file
		$.getJSON(image_manifest_url, function(json) {
			$.processPackJson(json);
			}).	error(function() {
				alert("error getting pack json");
			});
	} else
	{ 
		console.log("found pack json in localstorage " + $pack_key);
			$.processPackJson(JSON.parse(localStorage.getItem($pack_key)));
		}
};

jQuery.processPackJson = function(json) {

	console.log("processPackJson " + json);
	
	if (localStorage.getItem($pack_key) === null) {
	localStorage.setItem($pack_key,JSON.stringify(json));
	}

	// we'll store the search term here

	if ($('link[title="packstyles"]').exists()) {
		$('link[title="packstyles"]').attr('disabled', 'disabled');
		$('link[title="packstyles"]').remove();
	}

//	$('head').append(
//			'<link title="packstyles" href="' + currentPack.packstyles
//					+ '" rel="stylesheet" type="text/css" />');

	$('#bands').empty();
	$active_cycle = '';

	$.each(json.bands,function(i, band) {
		console.log("next band " + band.divname);
		// append to div bands
		var divid = 'wrapper_cycle_' + band.divname;
		var cycleid = 'cycle_' + band.divname;
		$("#bands").append(
						'<div id="'
								+ cycleid
								+ '" style="position:absolute; top:0px; left:0px; height: 100%; width: 100%; z-index: '
								+ band.zindex + '">');

		$.each(band.images,function(i, sprite) {
							// console.log("next image " +

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
										+ 'px; position:absolute;">'
										+ '<image id="'
										+ sprite.id
										+ '" style="width: 100%; height: 100%; " src="'
										+ sprite.dataurl
										+ '"></image></div></li>');
				$('#' + cycleid + ' div').attr(
						'bandtop', band.top);
				$('#' + cycleid + ' div').attr(
						'bandleft', band.left);
				$('#' + cycleid + ' div').attr(
						'bandheight', band.height);
				$('#' + cycleid + ' div').attr(
						'bandwidth', band.width);
			});
		
			$('#' + cycleid).append('</div>');

			$('#' + cycleid).addCycle(band.divname);
			$('#' + cycleid).data('currSlide', 0);
			$('#' + cycleid).data('band', band);
			$('#' + cycleid).cycle({
				speed : 500,
				fx : 'scrollHorz',
				timeout : 0,
				after : onAfter,
				slideResize : 0
			});
			if ($active_cycle == '')
				$active_cycle = $('#' + cycleid);

		});

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
	
	$('#build').trigger('create');

	console.log("loadpack mid");

	$('.heads, .bodies, .legs, .xtras , #btn_next_head, #btn_prev_head').waitForImages(
			function() {
				console.log('Before show, all images loaded.');
				
			},
			function(loaded, count, success) {

				console.log(loaded + ' of ' + count + ' images has '
						+ (success ? 'failed to load' : 'loaded') + '.');

			});

	$('#banks-nav-bar').waitForImages(
			function() {
				console.log('Before readyToResize, all images loaded.');
				readyToResize();
			},
			function(loaded, count, success) {

				console.log(loaded + ' of ' + count + ' images has '
						+ (success ? 'failed to load' : 'loaded') + '.');

			});

};

function readyToResize()
 {
	

	
	$.resizeImages();
	
	$('#btn_done').unbind('click');
	$('#btn_done').click(
			function(e) {
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
				case 2:
					classname = "ui-block-c";
					break;
				case 1:
					classname = "ui-block-b";
					break;
				default:
					classname = "ui-block-a";
				}

				$('#vaultGrid').append(
						'<div class="' + classname
								+ '"><div class="ui-bar" data-theme="b">'
								+ '<canvas id="' + canvasName
								+ '" height="300"></canvas></div></div>');

				var drawingCanvas = document.getElementById(canvasName);

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
				sprite.x = band.left;
				sprite.y = band.top;
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
				sprite.x = band.left;
				sprite.y = band.top;
				sprite.height = band.height;
				sprite.width = band.width;

				myhead.sprite = sprite;
				weirdoid.head = myhead;
				// drawInCanvas(drawingCanvas,
				// weirdoid.head, scaleBy, lmargin);

				// topoffset =
				// $('#cycle_heads').data('band').top;
				// context.drawImage(image,
				// sprite.x, sprite.y, sprite.width,
				// sprite.height, lmargin / scaleBy,
				// topoffset
				// / scaleBy, sprite.width /
				// scaleBy,
				// sprite.height / scaleBy);

				var context = drawingCanvas.getContext('2d');
				var image = new Image();

				imgidx = $('#cycle_bodies').data('currSlide');
				band = $('#cycle_bodies').data('band');
				sprite = band.images[imgidx];

				mybody.src = band.background;
				mybody.topoffset = band.top;
				sprite.x = band.left;
				sprite.y = band.top;
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
				sprite.x = band.left;
				sprite.y = band.top;
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
				sprite.x = band.left;
				sprite.y = band.top;
				sprite.height = band.height;
				sprite.width = band.width;
				myxtra.sprite = sprite;
				weirdoid.xtra = myxtra;
				// drawInCanvas(drawingCanvas,
				// weirdoid.xtra, scaleBy, lmargin);
				$lastweirdoid = weirdoid;

				e.preventDefault();
			});
	// $.mobile.changePage( "#build", { transition: "flip"}
	// );

};

jQuery.resizeImages = function() {
	var o = $(this[0]); // It's your element
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

	// $("#bands").trigger('create');
};
