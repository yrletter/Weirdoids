
var $online = navigator.onLine;
var $is_logged_in = false;
var $is_on_facebook = false;
var $is_trial_only = false;

$(document).ready(
		function() {
			console.log("in appstate.js");

			console.log("browser " + navigator.userAgent);
			if (navigator.userAgent.match(/Android/i)
					|| navigator.userAgent.match(/webOS/i)
					|| navigator.userAgent.match(/iPhone/i)
					|| navigator.userAgent.match(/iPad/i)) {
				console.log('in match');
				$('.browser-nav-btn').remove();

			}
			
			window.addEventListener("offline", function(e) {
				console.log("offline");
				$online = navigator.onLine;
				// OR you can set attr to "" 
				$('.online-only').attr('disabled', 'disabled');
			});

			window.addEventListener("online", function(e) {
				console.log("online");
				$online = navigator.onLine;
				
				// enable online functionality
				// log in buttons

				// To enable 
				$('.online-only').removeAttr('disabled');
			});

		});
