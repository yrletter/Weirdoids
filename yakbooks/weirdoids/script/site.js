$(document).ready(
		function() {
			/*
			 * 			$("#cycle_heads").addCycle("heads");
			$("#cycle_heads").addCycle("bodies");
			$("#cycle_heads").addCycle("legs");
			$("#cycle_heads").addCycle("bkgds");
			$("#cycle_heads").addCycle("xtras");
			$("#cycle_heads").cycle(
					{
						timeout : 0,
						fx : 'scrollHorz',
						prev : '#prev_head',
						next : '#next_head',

						pagerAnchorBuilder : function(idx, slide) {
							// return selector string for existing anchor
							return '#cycle_heads-nav a:eq(' + idx + ')';
						},
						after : function(currSlideElement, nextSlideElement,
								options, forwardFlag) {
							$("#cycle_heads-nav a").removeClass("activeSlide");
							$(
									"#cycle_heads-nav a:eq("
											+ options.currSlide + ")")
									.addClass("activeSlide");
							var slideClass = $(nextSlideElement).attr("class");
							if ($("#cycle_heads li." + slideClass
									+ " span.video").length) {
								$('#cycle_heads').cycle('pause');
							} else {
								$('#cycle_heads').cycle('resume');
							}
						}
					});
*/		});


/*$(document)
		.ready(
				function() {

					$("#cycle_bodies")
							.cycle(
									{
										timeout : 0,
										fx : 'scrollHorz',
										prev : '#prev_bodies',
										next : '#next_bodies',

										pagerAnchorBuilder : function(idx,
												slide) {
											// return selector string for
											// existing anchor
											return '#cycle_bodies-nav a:eq('
													+ idx + ')';
										},
										after : function(currSlideElement,
												nextSlideElement, options,
												forwardFlag) {
											$("#cycle_bodies-nav a")
													.removeClass("activeSlide");
											$(
													"#cycle_bodies-nav a:eq("
															+ options.currSlide
															+ ")").addClass(
													"activeSlide");
											var slideClass = $(nextSlideElement)
													.attr("class");
											if ($("#cycle_bodies li."
													+ slideClass
													+ " span.video").length) {
												$('#cycle_bodies').cycle(
														'pause');
											} else {
												$('#cycle_bodies').cycle(
														'resume');
											}
										}
									});
				});

$(document)
		.ready(
				function() {

					$("#cycle_legs")
							.cycle(
									{
										timeout : 0,
										fx : 'scrollHorz',
										prev : '#prev_legs',
										next : '#next_legs',

										pagerAnchorBuilder : function(idx,
												slide) {
											// return selector string for
											// existing anchor
											return '#cycle_legs-nav a:eq('
													+ idx + ')';
										},
										after : function(currSlideElement,
												nextSlideElement, options,
												forwardFlag) {
											$("#cycle_legs-nav a").removeClass(
													"activeSlide");
											$(
													"#cycle_legs-nav a:eq("
															+ options.currSlide
															+ ")").addClass(
													"activeSlide");
											var slideClass = $(nextSlideElement)
													.attr("class");
											if ($("#cycle_legs li."
													+ slideClass
													+ " span.video").length) {
												$('#cycle_legs').cycle('pause');
											} else {
												$('#cycle_legs')
														.cycle('resume');
											}
										}
									});
				});

$(document).ready(
		function() {

			$("#cycle_bkgds").cycle(
					{
						timeout : 0,
						fx : 'scrollHorz',
						prev : '#prev_bkgds',
						next : '#next_bkgds',

						pagerAnchorBuilder : function(idx, slide) {
							// return selector string for existing anchor
							return '#cycle_bkgds-nav a:eq(' + idx + ')';
						},
						after : function(currSlideElement, nextSlideElement,
								options, forwardFlag) {
							$("#cycle_bkgds-nav a").removeClass("activeSlide");
							$(
									"#cycle_bkgds-nav a:eq("
											+ options.currSlide + ")")
									.addClass("activeSlide");
							var slideClass = $(nextSlideElement).attr("class");
							if ($("#cycle_bkgds li." + slideClass
									+ " span.video").length) {
								$('#cycle_bkgds').cycle('pause');
							} else {
								$('#cycle_bkgds').cycle('resume');
							}
						}
					});
		});

$(document).ready(
		function() {

			$("#cycle_xtras").cycle(
					{
						timeout : 0,
						fx : 'scrollHorz',
						prev : '#prev_xtras',
						next : '#next_xtras',

						pagerAnchorBuilder : function(idx, slide) {
							// return selector string for existing anchor
							return '#cycle_xtras-nav a:eq(' + idx + ')';
						},
						after : function(currSlideElement, nextSlideElement,
								options, forwardFlag) {
							$("#cycle_xtras-nav a").removeClass("activeSlide");
							$(
									"#cycle_xtras-nav a:eq("
											+ options.currSlide + ")")
									.addClass("activeSlide");
							var slideClass = $(nextSlideElement).attr("class");
							if ($("#cycle_xtras li." + slideClass
									+ " span.video").length) {
								$('#cycle_xtras').cycle('pause');
							} else {
								$('#cycle_xtras').cycle('resume');
							}
						}
					});
		});

*/

jQuery.fn.addCycle = function(basename) {
	var o = $(this[0]) // It's your element
	var cyclename = '#cycle_' + basename;
	$(cyclename).cycle(
					{
						timeout : 0,
						fx : 'scrollHorz',
/*						prev : '#prev_' + basename,
						next : '#next_' + basename,
*/
						pagerAnchorBuilder : function(idx, slide) {
							// return selector string for existing anchor
							return cyclename + '-nav a:eq(' + idx + ')';
						},
						after : function(currSlideElement, nextSlideElement,
								options, forwardFlag) {
							$(cyclename + "-nav a").removeClass("activeSlide");
							$(
									cyclename + "-nav a:eq("
											+ options.currSlide + ")")
									.addClass("activeSlide");
							var slideClass = $(nextSlideElement).attr("class");
							if ($(cyclename + " li." + slideClass
									+ " span.video").length) {
								$(cyclename).cycle('pause');
							} else {
								$(cyclename).cycle('resume');
							}
						}
					});
};

jQuery.fn.exists = function(){return jQuery(this).length>0;};

