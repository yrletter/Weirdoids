$(document).ready(function() {
	
	$('.hascycle').live('pageshow', function(event, toPage) {
		// get current page
		ulselector = '#' + $('.ui-page-active').attr('id') + ' #slideshow ul';
		ssselector = '#' + $('.ui-page-active').attr('id') + ' #slideshow';
		nxtselector = '#' + $('.ui-page-active').attr('id') + ' #next';
		prevselector = '#' + $('.ui-page-active').attr('id') + ' #next';

		$('#slideshow').cycle('destroy');
		$(ulselector).cycle({
			fx : 'scrollHorz',
			speed : 'fast',
			timeout : 0,
			next : nxtselector,
			prev : prevselector
		});

		$(ssselector).swipeleft(function(e) {
			$(ssselector).cycle('next');
			e.preventDefault();
		});

		$(ssselector).swiperight(function(e) {
			$(ssselector).cycle('prev');
			e.preventDefault();
		});
	});
});