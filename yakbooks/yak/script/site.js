$(document).ready(function() {

	$('#btn_book').click(function(event) {

		$.mobile.changePage("#book", {
			transition : "slide"
		});
		event.preventDefault();
		return true;

	});

	$('#btn_title').click(function(event) {

		$.mobile.changePage("#title", {
			transition : "slide"
		});
		event.preventDefault();
		return true;

	});



//	$('#cyclebook').swipeleft(function(e) {
//		$("#cyclebook").cycle('next');
//		e.preventDefault();
//	});
//
//	$('#cyclebook').swiperight(function(e) {
//		$("#cyclebook").cycle('prev');
//		e.preventDefault();
//	});

});