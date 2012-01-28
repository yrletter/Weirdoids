<!doctype html>
<?php 
	if (!isset($_GET['manifestfile']))
	{
		echo('<html>');
	}
	else
	{
		echo('<html manifest="'.$_GET['manifestfile'].'">');
	}

?>
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="Description" content="" />

<meta name="viewport"
	content="height=device-height,width=device-width,initial-scale=1.0,maximum-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<link rel="apple-touch-icon" href="imgs/apple-touch-icon.png" />


<title>Weirdoids Proto1</title>



<link rel="icon" type="image/png" href="images/favicon.png" />


<!--  link rel="stylesheet"
	href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" /-->
<!-- script src="http://code.jquery.com/jquery-1.6.4.min.js"></script-->
<!-- script src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script-->

<link rel="stylesheet" href="css/jquery.mobile-1.0.min.css" />
<script src="script/jquery-1.6.4.min.js"></script>
<script src="script/jquery.mobile-1.0.min.js"></script>

<script src="script/jquery-ui-1.8.16.custom.min.js"
	type="text/javascript"></script>
<script src="script/jquery.cycle.all.js" type="text/javascript"></script>
<link href="css/reveal.css" rel="stylesheet" type="text/css" />
<script src="script/jquery.reveal.js" type="text/javascript"></script>
<script src="script/jquery.waitforimages.js" type="text/javascript"></script>
<link href="css/rstyles.css" rel="stylesheet" type="text/css" />




<script src="script/site.js" type="text/javascript"></script>
<script src="script/loadPack.js" type="text/javascript"></script>
<script src="script/weirdoids.js" type="text/javascript"></script>



</head>

<body>

	<div id="wrapper">




		<div id="home" data-role="page">
			<div id="homediv1"
				style="max-height: 1024px; height: 100%; width: 100%; position: absolute; max-width: 768px;">
				<img id="homebg" alt="alt" src="imgs/bkgd_home.jpg" class="bg">
				<div id="btn_build">
					<a href="#" id="bldbtn" data-role="button">BUILD</a>
				</div>

				<div id="btn_vault">
					<a href="#vault" data-role="button">VAULT</a>
				</div>

				<div id="btn_packs">
					<a href="#packs" data-role="button">PACKS</a>
				</div>
			</div>
		</div>

		<div id="build" data-role="page">


			<div id="btn_done">
				<a href="#previewpage" data-role="button">DONE </a>
			</div>


			<div data-role="header" class="nav-glyphish-example" id="buildhdr">
				<div id="banks-nav-bar" data-role="navbar"
					class="nav-glyphish-example" data-grid="d">
					<ul>
						<li><a href="#" id="headbtn" data-iconpos="notext"
							data-icon="custom"></a></li>
						<li><a href="#" id="bodybtn" data-iconpos="notext"
							data-icon="custom"></a></li>
						<li><a href="#" id="legbtn" data-iconpos="notext"
							data-icon="custom"></a></li>
						<li><a href="#" id="xtrabtn" data-iconpos="notext"
							data-icon="custom"></a></li>
						<li><a href="#" id="bkgdbtn" data-iconpos="notext"
							data-icon="custom"></a></li>
					</ul>
				</div>
			</div>




			<div id="band_wrapper"
				style="height: 100%; width: 100%; postion: absolute;">
				<div id="btn_prev_head" class="browser-nav-btn">
					<a href="#" id="prev_heads"></a>
				</div>
				<div id="btn_next_head" class="browser-nav-btn">
					<a href="#" id="next_heads" class="browser-nav-btn"></a>
				</div>

				<div id="bands"></div>
			</div>



		</div>

		<div id="packs" data-role="page" data-title="Select a Pack">
			<h1>Select a Pack</h1>

			<div id="preview">
				<ul data-role="listview" id="packlist" data-theme="e">

				</ul>
				<p></p>
				<a href="#home" data-role="button">Cancel</a>
				<p></p>
				<div id="buybtn">
					<a href="#" data-reveal-id="myModal" data-role="button">Click
						to Buy</a>
				</div>
			</div>

			<div id="myModal" class="reveal-modal">
				<h1>Purchase Pack</h1>



				<p>
				<p>
				<p>

					<a class="close-reveal-modal">&#215;</a>
			</div>
		</div>

		<div id="vault" data-role="page">


			<div data-role="header" data-position="inline">
				<a href="#home">Done</a>
				<h1>VAULT</h1>
				<a href=# data-icon="delete" id="clearcachebtn">Clear Cache</a>
			</div>
			<!-- /header -->

			<div data-role="content">


				<div class="ui-grid-b" id="vaultGrid" data-scroll="true"></div>
				<!-- /grid-a -->

			</div>
			<!-- /content -->


		</div>

		<div id="previewpage" data-role="page">
			<div data-role="header" data-position="inline">
				<h1>My Weirdoid</h1>
				<a href="#vault" id="saveInVaultBtn">Done</a> <a href="#"
					data-rel="back" data-icon="delete" id="cancelsave">Cancel</a>
			</div>
			<!-- /header -->

			<div data-role="content">
				<div>
					<canvas id="preview-canvas" height="300"></canvas>
				</div>
				<form id="form1">


					<div class="ui-grid-a" id="nameGrid" style="padding: 20px 10px;">
						<div class="ui-block-a">
							<label for="select-choice-0">First Name</label> <select
								name="select-choice-0" id="select-choice-firstname">
							</select>
						</div>
						<div class="ui-block-b">
							<label for="select-choice-1">Last Name</label> <select
								name="select-choice-1" id="select-choice-lastname"></select>
						</div>

					</div>
					<!-- /grid-a -->

				</form>
			</div>
			<!-- /content -->

		</div>
	</div>


</body>
</html>