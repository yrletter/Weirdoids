/**
 * 
 */
$(document)
		.ready(
				function() {

					var docroot = "http://yrcreative.com/clients/yakbooks/weirdoids/";
					//var docroot = "http://yak.com/yakbooks/weirdoids/";

					// get the images
					$
							.ajax({
								url : 'server/get_recent_weirdoids.php',
								type : 'post',
								dataType : 'json',
								data : {

								}, // store,
								success : function(json) {
									// process the result
									if (json.errorcode == 0) {
										console
												.log("Retrieved list of images in gallery");
										jQuery
												.each(
														json.gallery,
														function() {
															// create image
															nxtimg = this;
															$('#homewrap')
																	.append(
																			'<div>');
															$('#homewrap')
																	.append(
																			'<img src="'
																					+ docroot
																					+ nxtimg["url"]
																					+ '" class="gallery-image" ><br>');

															var wholename = "";
															if (nxtimg.fname
																	&& nxtimg.fname.length > 0)
																wholename += nxtimg.fname;
															if (nxtimg.lname
																	&& nxtimg.lname.length > 0) {
																if (wholename.length > 0) {
																	wholename += ' ';
																}
																wholename += nxtimg.lname;
															}
															if (wholename.length > 0)
																$('#homewrap').append('<div class="gallery-name">'+ wholename + '</div>');
															if (nxtimg.daysago
																	&& nxtimg.daysago > 0) {
																$('#homewrap')
																		.append(
																				'<div class="gallery-age">'
																						+ nxtimg.daysago
																						+ ' days ago by '
																						+ nxtimg.yaklogin
																						+ '</div>');
															} else if (nxtimg.hrsago) {
																$('#homewrap')
																		.append(
																				'<div class="gallery-age">'
																						+ nxtimg.hrsago
																						+ ' hours ago by '
																						+ nxtimg.yaklogin
																						+ '</div>');
															} else if (nxtimg.minsago) {
																$('#homewrap')
																		.append(
																				'<div class="gallery-age">'
																						+ nxtimg.minsago
																						+ ' minutes ago by '
																						+ nxtimg.yaklogin
																						+ '</div>');
															}
															$('#homewrap')
																	.append(
																			'</div>');
														});
										return;
									}
								},
								failure : function(data) {
									console.log("Gallery retrieval failure");
									if ($srcPage != null)
										gotoPage($srcPage);
								},
								complete : function(xhr, data) {
									if (xhr.status != 0 && xhr.status != 200)
										alert('Error calling server to Gallery retrieval. Status='
												+ xhr.status
												+ " "
												+ xhr.statusText);
								}
							});

				});