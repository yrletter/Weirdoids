$(document)
		.ready(
				function() {
					
					// look for key in localstorage
					
					var appkey = localStorage.getItem('weirdoids');
					if (appkey == null)
						{
							// call weirdoids without key
						}
					else
						{
							// call with key
							window.location.replace("http://192.168.1.8/yakbooks/weirdoids/index.html?appkey=".appkey);

						}
				});