/**
 * 
 */
$(document).ready(function() {

	// hide error message
	$('.error').hide();

	// bind an event handler to the submit event for your login form
	$('#btn_login').click(function(e) {

		$('.error').hide();

		var name = $("#name").val();
		if (name == "") {
			$("label#name_error").show();
			$("#name").focus();
			return false;
		}
		// var email = $("#email").val();
		// if (email == "") {
		// $("label#email_error").show();
		// $("input#email").focus();
		// return false;
		// }

		var password = $("#password").val();
		if (password == "") {
			$("label#password_error").show();
			$("input#password").focus();
			return false;
		}

		// cache the form element for use in this function
		var $this = $(this);

		// prevent the default submission of the form
		e.preventDefault();

		$.ajax({
			url : 'controllers/login-exec.php',
			type : 'post',
			dataType : 'json',
			data : $('#loginform').serialize(),
			success : function(json) {
				// process the result
				if (json.errorcode == 0) {
					console.log("logged in!");
					$.mobile.changePage("#myaccount", {
						transition : "fade"
					});
				} else {
					serverAlert("Login failure", json);
					console.log("Login failure");
					console.log(json.errormsg);
				}
			},
			failure : function(data) {
				console.log("login failure");
			}
		});
	});

	// bind an event handler to the submit event for your login form
	var $child_fname = null;
	var $child_avatar = null;

	$('#btn_signup_kid').click(function(e) {

		// cache the form element for use in this function
		var $this = $(this);

		$('.error').hide();

		$('.error').hide();
		var name = $("#child_name").val();
		if (name == "") {
			$("label#child_name_error").show();
			$("#child_name").focus();
			return false;
		} else {
			$('#child_hidden_fname').val(name);
			$child_fname = name;
		}
		
		var avatar = $("#avatar").val();
		if (avatar == "") {
			$("label#avatar_error").show();
			$("#avatarlist").focus();
			return false;
		}
		
		$.mobile.changePage("#signupkidpg2", {
			transition : "fade"
		});
	});

	$('#btn_signup_kid2').click(function(e) {

		// cache the form element for use in this function
		var $this = $(this);

		$('.error').hide();

		var password = $("#child_password").val();
		if (password == "") {
			$("label#child_password_error").show();
			$("input#child_password").focus();
			return false;
		}

		var cpassword = $("#child_cpassword").val();
		if (cpassword != password) {
			$("label#child_cpassword_error").text("Passwords don't match!");
			$("label#child_cpassword_error").show();
			$("input#child_cpassword").focus();
			return false;
		}

		var child_yakname = $("#child_yakname").val();
		if (child_yakname == "") {
			$("label#child_yakname_error").show();
			$("input#child_yakname").focus();
			return false;
		}
		var password = $("#child_yaklogin").val();
		if (password == "") {
			$("label#child_yaklogin_error").show();
			$("input#child_yaklogin").focus();
			return false;
		}

		var child_parent_email = $("#child_parent_email").val();
		if (child_parent_email == "") {
			$("label#child_parent_email_error").show();
			$("input#child_parent_email").focus();
			return false;
		}
		var byear = $('#select-choice-year-kid2 :selected').val();
		var bmonth = $('#select-choice-month-kid2 :selected').val();
		var bday = $('#select-choice-day-kid2 :selected').val();
		var bdatestr = bday + '/' + bmonth + '/' + byear;

		if (!checkdate(bdatestr)) {
			$("label#child_birthday_error").show();
			return false;
		} else
			$("#child_birthday").val(byear + '-' + bmonth + '-' + bday);

		var child_email = $("#child_email").val();
		if (child_email == "") {
			$("label#child_email_error").show();
			$("input#child_email").focus();
			return false;
		}

		// prevent the default submission of the form
		e.preventDefault();

		$.ajax({
			url : 'controllers/signup_child.php',
			type : 'post',
			dataType : 'json',
			data : $('#signup_kid_form2').serialize(),
			success : function(json) {
				// process the result
				if (json.errorcode == 0) {
					console.log("logged in!");
					$.mobile.changePage("#myaccount", {
						transition : "fade"
					});
				} else {
					serverAlert("Kid signup user failure", json);
					console.log("Kid signup failure");
					console.log(json.errormsg);
				}
			},
			failure : function(data) {
				serverAlert("http: Kid signup user failure", json);
				console.log("login failure");
			}
		});
	});

	// bind an event handler to the submit event for your login form
	$('#btn_signup_adult').click(function(e) {

		// cache the form element for use in this function
		var $this = $(this);

		$('.error').hide();
		var name = $("#adult_name").val();
		if (name == "") {
			$("label#adult_name_error").show();
			$("#adult_name").focus();
			return false;
		}
		var email = $("#email").val();
		if (email == "") {
			$("label#email_error").text("This field is required.");
			$("label#email_error").show();
			$("input#email").focus();
			return false;
		} else if (!isValidEmailAddress(email)) {
			$("label#email_error").text("Invalid email address.");
			$("label#email_error").show();
			$("input#email").focus();
			return false;
		}

		var password = $("#adult_password").val();
		if (password == "") {
			$("label#adult_password_error").show();
			$("input#adult_password").focus();
			return false;
		}

		var cpassword = $("#adult_cpassword").val();
		if (cpassword == "") {
			$("label#adult_cpassword_error").text("This field is required.");
			$("label#adult_cpassword_error").show();
			$("input#adult_cpassword").focus();
			return false;
		}

		var cpassword = $("#adult_cpassword").val();
		if (cpassword != password) {
			$("label#adult_cpassword_error").text("Passwords don't match!");
			$("label#adult_cpassword_error").show();
			$("input#adult_cpassword").focus();
			return false;
		}

		var agree_terms = $('#agree_terms').prop("checked");

		if (!agree_terms) {
			$("div#agree_terms_error").text("Must agree to terms and conditions!");
			$("div#agree_terms_error").show();
			$("input#agree_terms").focus();
			return false;
		}

		// prevent the default submission of the form
		e.preventDefault();

		$.ajax({
			url : 'controllers/signup_parent.php',
			type : 'post',
			dataType : 'json',
			data : $('#signup_adult_form').serialize(),
			success : function(json) {
				// process the result
				if (json.errorcode == 0) {
					console.log("logged in!");
					$.mobile.changePage("#signupgrownuppg2", {
						transition : "fade"
					});
				} else {
					serverAlert("Create user failure", json);
					console.log("Create user failure");
					console.log(json.errormsg);
				}
			},
			failure : function(json) {
				console.log("login failure");
			}
		});
	});

	$('#btn_signup_adult2').click(function(e) {

		// cache the form element for use in this function
		var $this = $(this);

		/*
		 * child_fname child_lname child_yakname child_yaklogin
		 * select-choice-month select-choice-day select-choice-year child_email
		 * child_gender
		 */
		$('.error').hide();
		var fname = $("#child_fname").val();
		if (fname == "") {
			$("label#child_fname_error").show();
			$("#child_fname").focus();
			return false;
		}
		var lname = $("#child_lname").val();
		if (lname == "") {
			$("label#child_lname_error").show();
			$("#child_lname").focus();
			return false;
		}

		var email = $("#child_email").val();
		if (email != '' && !isValidEmailAddress(email)) {
			$("label#child_email_error").text("Invalid email address.");
			$("label#child_email_error").show();
			$("input#child_email").focus();
			return false;
		}

		var child_yakname = $("#child_yakname").val();
		if (child_yakname == "") {
			$("label#child_yakname_error").show();
			$("#child_yakname").focus();
			return false;
		}
		var child_yaklogin = $("#child_yaklogin").val();
		if (child_yaklogin == "") {
			$("label#child_yaklogin_error").show();
			$("#child_yaklogin").focus();
			return false;
		}

		// to do
		/*
		 * child_gender
		 */

		var byear = $('#select-choice-year2 :selected').val();
		var bmonth = $('#select-choice-month2 :selected').val();
		var bday = $('#select-choice-day2 :selected').val();
		var bdatestr = bday + '/' + bmonth + '/' + byear;

		if (!checkdate(bdatestr)) {
			$("label#child_bday_error").show();
			return false;
		} else
			$("#child_bday_date").val(byear + '-' + bmonth + '-' + bday);

		// var cpassword = $("#adult_cpassword").val();
		// if (cpassword != password) {
		// $("label#adult_cpassword_error").text("Passwords don't match!");
		// $("label#adult_cpassword_error").show();
		// $("input#adult_cpassword").focus();
		// return false;
		// }

		// var agree_terms = $('#agree_terms').prop("checked");
		//
		// if (!agree_terms) {
		// $("div#agree_terms_error").text("Must agree to terms and
		// conditions!");
		// $("div#agree_terms_error").show();
		// $("input#agree_terms").focus();
		// return false;
		// }

		// prevent the default submission of the form
		e.preventDefault();

		$.ajax({
			url : 'controllers/signup_parent2.php',
			type : 'post',
			dataType : 'json',
			data : $('#signup_adult_form2').serialize(),
			success : function(json) {
				// process the result
				if (json.errorcode == 0) {
					console.log("Inserted child!");
					$.mobile.changePage("#signupgrownuppg3", {
						transition : "fade"
					});
				} else {
					serverAlert("Create child failure", json);
					console.log("Create child failure");
					console.log(json.errormsg);
				}
			},
			failure : function(data) {
				console.log("login failure");
			}
		});
	});

	$('#btn_signup_adult_verify').click(function(e) {

		// cache the form element for use in this function
		var $this = $(this);

		/*
		 * child_fname child_lname child_yakname child_yaklogin
		 * select-choice-month select-choice-day select-choice-year child_email
		 * child_gender
		 */
		$('.error').hide();
		var fname = $("#parent_fname").val();
		if (fname == "") {
			$("label#parent_fname_error").show();
			$("#parent_fname").focus();
			return false;
		}
		var lname = $("#parent_lname").val();
		if (lname == "") {
			$("label#parent_lname_error").show();
			$("#parent_lname").focus();
			return false;
		}

		var phone = $("#parent_phone").val();
		if (phone == "") {
			$("label#parent_phone_error").show();
			$("#parent_phone").focus();
			return false;
		}

		var address1 = $("#parent_address1").val();
		if (address1 == "") {
			$("label#parent_address1_error").show();
			$("#parent_address1").focus();
			return false;
		}

		var city = $("#parent_city").val();
		if (city == "") {
			$("label#parent_city_error").show();
			$("#parent_city").focus();
			return false;
		}

		var state = $("#parent_state").val();
		if (state == "") {
			$("label#parent_state_error").show();
			$("#parent_state").focus();
			return false;
		}

		var country = $("#parent_country").val();
		if (country == "") {
			$("label#parent_country_error").show();
			$("#parent_country").focus();
			return false;
		}

		var postal = $("#parent_postal").val();
		if (postal == "") {
			$("label#parent_postal_error").show();
			$("#parent_postal").focus();
			return false;
		}

		var verification_method = $("#parent_verification_method :checked").val();
		verification_method = 'creditcard';
		if (verification_method == "") {
			$("label#parent_verification_method_error").show();
			$("#parent_verification_method").focus();
			return false;
		} else if (verification_method == 'creditcard') {
			var cc_number = $("#parent_cc_number").val();
			if (cc_number == "") {
				$("label#parent_cc_number_error").show();
				$("#parent_cc_number").focus();
				return false;
			}

			var cc_type = $("#parent_cc_type :checked").val();
			if (cc_type == "") {
				$("label#parent_cc_type_error").show();
				$("#parent_cc_type").focus();
				return false;
			}

			var cc_cvv = $("#parent_cc_cvv").val();
			if (cc_cvv == "") {
				$("label#parent_cc_cvv_error").show();
				$("#parent_cc_cvv").focus();
				return false;
			}

			var byear = $('#parent_cc_expiration_date_year :selected').val();
			var bmonth = $('#parent_cc_expiration_date_month :selected').val();
			var bday = '01';
			var bdatestr = bday + '/' + bmonth + '/' + byear;

			if (!checkdate(bdatestr)) {
				$("label#parent_cc_expiration_date_error").show();
				return false;
			} else
				$("#parent_cc_expiration_date").val(byear + '-' + bmonth + '-' + bday);
		}

		// to do, verify other verification type

		// prevent the default submission of the form
		e.preventDefault();

		$.ajax({
			url : 'controllers/signup_parent_verify.php',
			type : 'post',
			dataType : 'json',
			data : $('#signup_adult_form3').serialize(),
			success : function(json) {
				// process the result
				if (json.errorcode == 0) {
					console.log("Inserted child!");
					$.mobile.changePage("#signupgrownuppg4", {
						transition : "fade"
					});
				} else {
					serverAlert("Verification data update failure", json);
					console.log("Verification data update failure");
					console.log(json.errormsg);
				}
			},
			failure : function(data) {
				console.log("http: Verification data update failure");
			}
		});
	});

});

function checkdate(value) {
	var validformat = /^\d{2}\/\d{2}\/\d{4}$/; // Basic check for format
	// validity

	if (!validformat.test(value))
		return false;

	var dayfield = value.split("/")[0];
	var monthfield = value.split("/")[1];
	var yearfield = value.split("/")[2];
	var dayobj = new Date(yearfield, monthfield - 1, dayfield);
	if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield))
		return false;
	else
		return true;
};

function serverAlert(error, json) {
	var alertmsg = error + "\n\r";
	if (json.errormsg)
		alertmsg += json.errormsg + '\n\r';
	if (json.errmsg_arr) {
		jQuery.each(json.errmsg_arr, function() {
			alertmsg = alertmsg.concat(this + "\n\r");
		});

	}
	alert(alertmsg);
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(
			/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
};