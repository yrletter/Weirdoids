// manage user data in localstorage and server

// when we switch to a new user, we have to go get that data: packs, saved
// weirdoids

var $missingRemote = new Array();

function afterLogin(userid) {

	// see if we need to switch user
	console.log("in afterLogin");
	
	if ($local_user_id != userid) {
		// must get local data for this user
		console.log("afterLogin: changed user. Former = " + $local_user_id
				+ " New = " + userid);
		getLocalWeirdoids(getNewUserKey(userid), userid);

	}
	if ($.cookies.test()) {
		$.cookies.set('last_user_id', userid);
	}

	synchProdKeys();
	
	// read in all the weirdoids on server for this user
	var serverWeirdoids = new Array();

	$.ajax({
		url : 'server/get_weirdoids.php',
		type : 'post',
		dataType : 'json',
		data : {
			user_id : userid
		},
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("Read the weirdoids!");

				serverWeirdoids = json.weirdoids;

				// synch up user data
				afterRetrieval(serverWeirdoids);

			} else {
				serverAlert("Error retrieving weirdoids", json);
				console.log("Error retrieving weirdoids");
				console.log(json.errormsg);
			}
		},
		failure : function(data) {
			console.log("Failure retrieving weirdoids");
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to retrieve weirdoids. Status='
						+ xhr.status + " " + xhr.statusText);
		}
	});
}

function afterRetrieval(serverWeirdoids) {

	// check to see if any remote weirdoids not saved locally
	console.log("in afterRetrieval");
	
	var needToSaveLocal = false;
	if (serverWeirdoids == undefined)
		serverWeirdoids = new Array();
	
	jQuery
			.each(
					serverWeirdoids,
					function() {
						var serverWeirdoid = this;
						var foundit = false;
						jQuery
								.each(
										$weirdoids,
										function() {
											var localWeirdoid = this;
											if (localWeirdoid.user_weirdoid_id
													&& serverWeirdoid.user_weirdoid_id
													&& serverWeirdoid.user_weirdoid_id == localWeirdoid.user_weirdoid_id) {
												//console.log("Found remote weirdoid in localstorage: " + localWeirdoid.user_weirdoid_id);
												foundit = true;
												return false;
											}
										});

						if (!foundit) {
							console
									.log("Did not find remote weirdoid in localstorage: user_weirdoid_id = "
											+ serverWeirdoid.user_weirdoid_id);
							$weirdoids.push(serverWeirdoid);
							needToSaveLocal = true;
						}

					});

	// check to see if any local weirdoids not saved on server
	$missingRemote = new Array();
	jQuery
			.each(
					$weirdoids,
					function() {
						var localWeirdoid = this;
						var foundit = false;
						jQuery
								.each(
										serverWeirdoids,
										function() {
											var serverWeirdoid = this;
											if (localWeirdoid.user_weirdoid_id
													&& (serverWeirdoid.user_weirdoid_id == localWeirdoid.user_weirdoid_id)) {
												//console.log("Found local weirdoid in remote list: " + localWeirdoid.user_weirdoid_id);
												foundit = true;
												return false;
											}
										});
						if (!foundit) {
							console
									.log("Did not find local weirdoid in remote list: user_weirdoid_id = "
											+ localWeirdoid.user_weirdoid_id);
							$missingRemote.push(localWeirdoid);
						}
					});

	// if needToSaveRemote, add weirdoids to server
	if ($missingRemote.length > 0) {
		console.log("Need to save " + $missingRemote.length
				+ " weirdoids to server.");

		// save list on server
		saveRemote(true, -1);
	} else {

		// replace local if changes made
		if (needToSaveLocal) {
			console.log("lists not in synch");
			saveWeirdoidsLocal();
		} else
			console.log("lists in synch");
	}
}

function saveRemote(wassaved, lastid) {

	if (wassaved && lastid > 0) {
		// saved, possibly again, the weirdoid
		// reset the user_weirdoid_id in the list
		 cidx = $.inArray($toSaveWeirdoid, $weirdoids);
		 if ( cidx > -1) {
			 wrd = $weirdoids[cidx];
			 wrd.user_weirdoid_id = lastid;
		 }		
	}
	if ($missingRemote.length > 0) {
		$toSaveWeirdoid = $missingRemote.pop();
		saveWeirdoidInDB(saveRemote);
	} else {
		console.log("Done saveRemote");
		saveWeirdoidsLocal();
	}

}