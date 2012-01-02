/**
 * 
 */

var $whatsnew_items = [];

$(document)
		.ready(
				function() {
					console.log("in whatsnew ready");

					var avatar_url = "data/avatars.txt";
					$.getJSON(avatar_url, function(json) {
						// json has array of elements
						$('#avatarlist').empty();
						$.each(json, function(i, avatar) {

							if (avatar.icon != undefined) {
								$('#avatarlist').append(
										'<li><a href="#"><img src="'
												+ avatar.icon + '" /> </a>');
							}

						});
					});

					var whatsnew_url = "data/whatnew.txt";

					$('#cyclebook').empty();

					var has_banner = 0;
					var featured_book_cnt = 0;
					var featured_game_cnt = 0;

					$
							.getJSON(
									whatsnew_url,
									function(json) {
										// json has array of elements
										$
												.each(
														json,
														function(i, newitem) {

															$whatsnew_items[newitem.id] = newitem;

															var priority = (newitem.is_featured_priority == undefined)
																	? "low"
																	: newitem.is_featured_priority;
															// console.log("new
															// item table
															// builder: newitem
															// " + newitem.id
															// + " " +
															// newitem.icon + "
															// priority " +
															// priority + " name
															// " +
															// newitem.name);
															var is_featured = (priority == "top" || priority == "high");

															var release_date = new Date();
															var today = new Date();

															if (newitem.release_date != undefined) {
																release_date = new Date(
																		newitem.release_date);
															}
															var is_new_date = new Date();
															is_new_date
																	.setDate(is_new_date
																			.getDate() - 90);
															var is_new = (release_date >= is_new_date);

															// console.log("is_new_date
															// " + is_new_date +
															// " release_date "
															// + release_date +
															// " is_new " +
															// is_new);

															// new page top
															// banner logic
															if (newitem.banner_image != undefined
																	&& priority == "top"
																	&& is_new == true) {
																$('#cyclebook')
																		.append(
																				'<img itemid="'
																						+ newitem.id
																						+ '" src="'
																						+ newitem.banner_image
																						+ '" alt="" />');
																has_banner++;
															}

															// new page "new"
															// list logic
															if (newitem.icon != undefined
																	&& is_new) {
																$(
																		'#whatsnewlist')
																		.append(
																				'<li class="newitem" ><a href="#"  ><img itemid="'
																						+ newitem.id
																						+ '" src="'
																						+ newitem.icon
																						+ '" />'
																						+ newitem.name
																						+ '</a></li>');
															} else
																console
																		.log("undefined icon or not new "
																				+ newitem.name);

															// book page "new"
															// list logic
															var is_book = (newitem.item_type != undefined && newitem.item_type == "book");
															if (newitem.icon != undefined
																	&& is_book) {
																$('#bookslist')
																		.append(
																				'<li class="newitem" ><a href="#"  ><img itemid="'
																						+ newitem.id
																						+ '" src="'
																						+ newitem.icon
																						+ '" />'
																						+ newitem.name
																						+ '</a></li>');
															} else
																console
																		.log("undefined icon or not new "
																				+ newitem.name);

															if (newitem.icon != undefined
																	&& is_book
																	&& is_featured
																	&& (featured_book_cnt < 3)) {
																$(
																		'#featuredbookslist')
																		.append(
																				'<li class="newitem" ><a href="#"  ><img itemid="'
																						+ newitem.id
																						+ '" src="'
																						+ newitem.icon
																						+ '" />'
																						+ newitem.name
																						+ '</a></li>');
																featured_book_cnt++;
															} else
																console
																		.log("undefined icon or not new "
																				+ newitem.name);

															// game page "new"
															// list logic
															var is_game = (newitem.item_type != undefined && newitem.item_type == "game");
															if (newitem.icon != undefined
																	&& is_game) {
																$('#gameslist')
																		.append(
																				'<li class="newitem" ><a href="#"  ><img itemid="'
																						+ newitem.id
																						+ '" src="'
																						+ newitem.icon
																						+ '" />'
																						+ newitem.name
																						+ '</a></li>');
															} else
																console
																		.log("undefined icon or not new "
																				+ newitem.name);

															if (newitem.icon != undefined
																	&& is_game
																	&& is_featured
																	&& (featured_game_cnt < 3)) {
																$(
																		'#featuredgameslist')
																		.append(
																				'<li class="newitem" ><a href="#"  ><img itemid="'
																						+ newitem.id
																						+ '" src="'
																						+ newitem.icon
																						+ '" />'
																						+ newitem.name
																						+ '</a></li>');
																featured_game_cnt++;
															} else
																console
																		.log("undefined icon or not new "
																				+ newitem.name);

														});

										// console.log("cycle cyclebook " +
										// has_banner);

										if (has_banner > 1) {
											$("#cyclebook").cycle({

												fx : 'scrollHorz',
												speed : 1000,
												timeout : 2000
											});
										}
									});

					$('#new').live('pageshow', function(event) {
						// remove all current stuff
						$('#cyclebook').cycle('resume');

					});

					$('#new').live('pagehide', function(event) {
						// remove all current stuff
						$('#cyclebook').cycle('pause');

					});

					$('#detail').live('pageshow', function(event) {
						// remove all current stuff
						if ($('#screenshots').length > 0) {

							$('#screenshots').cycle('resume');
						}

					});

					$('#detail').live('pagehide', function(event) {
						// remove all current stuff
						if ($('#screenshots').length > 0) {

							$('#screenshots').cycle('pause');
						}

					});

					
					$('#avatarlist').click(
							function(event) {
								//
								// 
								//			
								console.log("in avatar click");
								event.preventDefault();

								img = $(event.target);
								img_id = img.attr('src');
								if (img_id == undefined) {
									alert("no new item defined for image");
									return;
								}
								else
									console.log("selected " + img_id);
								$('#avatar').val(img_id);
								$('#avatar_error').hide();
								$(img).focus();
							});
					
					$('.apps, .featuredapps, #cyclebook').click(
							function(event) {
								//
								// 
								//			
								console.log("in apps click");
								event.preventDefault();

								img = $(event.target);
								img_id = img.attr('itemid');
								if (img_id == undefined) {
									// alert("no new item defined for image");
									return;
								}

								whatsnewitem = $whatsnew_items[img_id];
								console.log("clicked new item "
										+ whatsnewitem.icon);

								$('#detail_h1').text(whatsnewitem.name);
								$('#detail_description p').text(
										whatsnewitem.description);
								$('#detail_icon').attr({
									src : whatsnewitem.icon,
									alt : "missing " + whatsnewitem.icon
								});
								$('#detail_cost_str').text(
										whatsnewitem.cost_str);

								$('#screenshots').empty();
								$.each(whatsnewitem.snapshots, function(i,
										snapshot) {
									// list_str = '<li><img src="' +
									// snapshot.url
									// + '" alt=""';
									//
									// if (snapshot.classnm != undefined
									// && snapshot.classnm != "")
									// list_str += ' class="' + snapshot.classnm
									// + '" ';
									//
									// list_str += '/></li>';

									list_str = '<img src="' + snapshot.url
											+ '" alt=""';

									if (snapshot.classnm != undefined
											&& snapshot.classnm != "")
										list_str += ' class="'
												+ snapshot.classnm + '" ';

									list_str += '/>';

									$('#screenshots').append(list_str);
								});

								// $('#screenshots').cycle('destroy');

								if (whatsnewitem.snapshots.length > 0) {

									$('#screenshots').cycle({
										speed : 'fast',
										fx : 'scrollHorz',
										timeout : 3000
									});

									// $("#screenshots").cycle({
									// fx:'scrollHorz',
									// speed: 'fast',
									// timeout: 0,
									// next: '#next2',
									// prev: '#prev2'
									// });
									//								
									//								
									// $('#screenshots').swipeleft(function(e) {
									// $("#screenshots").cycle('next');
									// screenshots();
									// });
									//											
									// $('#screenshots').swiperight(function(e)
									// {
									// $("#screenshots").cycle('prev');
									// e.preventDefault();
									// });

								}

								$.mobile.changePage("#detail", {
									transition : "fade"
								});

							});

				});