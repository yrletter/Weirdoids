/**
 * 
 */

$(document).ready(
		function() {
			console.log("in dateselects");

			var theDate = new Date();
			var theYear = theDate.getFullYear();

			$('.childyearselect').empty().append('<option>Year</option>');
			for (i = theYear; i > (theYear - 17); i--) {
				$('.childyearselect').append(
						'<option value="' + i + '">' + i + '</option>');
			}

			$('.yearselect').empty().append('<option>Year</option>');
			for (i = theYear; i > (theYear - 90); i--) {
				$('.yearselect').append(
						'<option value="' + i + '">' + i + '</option>');
			}

			$('.ccyearselect').empty().append('<option>Year</option>');
			for (i = theYear + 8; i >= theYear; i--) {
				$('.ccyearselect').append(
						'<option value="' + i + '">' + i + '</option>');
			}
			
			$('.monthselect').empty().append(
					'<option>Month</option><option value="01">January</option>'
							+ '<option value="02">February</option>'
							+ '<option value="03">March</option>'
							+ '<option value="04">April</option>'
							+ '<option value="05">May</option>'
							+ '<option value="06">June</option>'
							+ '<option value="07">July</option>'
							+ '<option value="08">August</option>'
							+ '<option value="09">September</option>'
							+ '<option value="10">Octover</option>'
							+ '<option value="11">November</option>'
							+ '<option value="12">December</option>');

			$('.dayselect').empty().append('<option>Day</option>');
			for (i = 1; i <= 31; i++) {
				var i_str = i.toString();
				$('.dayselect').append(
						'<option value="' + padLeft(i_str, 2, '0') + '">' + i
								+ '</option>');
			}

			$('.stateselect').empty().append('<option value="AL">Alabama</option>' +
			'<option value="AK">Alaska</option>' +
			'<option value="AZ">Arizona</option>' +
			'<option value="AR">Arkansas</option>' +
			'<option value="CA">California</option>' +
			'<option value="CO">Colorado</option>' +
			'<option value="CT">Connecticut</option>' +
			'<option value="DE">Delaware</option>' +
			'<option value="FL">Florida</option>' +
			'<option value="GA">Georgia</option>' +
			'<option value="HI">Hawaii</option>' +
			'<option value="ID">Idaho</option>' +
			'<option value="IL">Illinois</option>' +
			'<option value="IN">Indiana</option>' +
			'<option value="IA">Iowa</option>' +
			'<option value="KS">Kansas</option>' +
			'<option value="KY">Kentucky</option>' +
			'<option value="LA">Louisiana</option>' +
			'<option value="ME">Maine</option>' +
			'<option value="MD">Maryland</option>' +
			'<option value="MA">Massachusetts</option>' +
			'<option value="MI">Michigan</option>' +
			'<option value="MN">Minnesota</option>' +
			'<option value="MS">Mississippi</option>' +
			'<option value="MO">Missouri</option>' +
			'<option value="MT">Montana</option>' +
			'<option value="NE">Nebraska</option>' +
			'<option value="NV">Nevada</option>' +
			'<option value="NH">New Hampshire</option>' +
			'<option value="NJ">New Jersey</option>' +
			'<option value="NM">New Mexico</option>' +
			'<option value="NY">New York</option>' +
			'<option value="NC">North Carolina</option>' +
			'<option value="ND">North Dakota</option>' +
			'<option value="OH">Ohio</option>' +
			'<option value="OK">Oklahoma</option>' +
			'<option value="OR">Oregon</option>' +
			'<option value="PA">Pennsylvania</option>' +
			'<option value="RI">Rhode Island</option>' +
			'<option value="SC">South Carolina</option>' +
			'<option value="SD">South Dakota</option>' +
			'<option value="TN">Tennessee</option>' +
			'<option value="TX">Texas</option>' +
			'<option value="UT">Utah</option>' +
			'<option value="VT">Vermont</option>' +
			'<option value="VA">Virginia</option>' +
			'<option value="WA">Washington</option>' +
			'<option value="WV">West Virginia</option>' +
			'<option value="WI">Wisconsin</option>' +
			'<option value="WY">Wyoming</option>');

		});

function padLeft(s, len, c) {
	c = c || '0';
	while (s.length < len)
		s = c + s;
	return s;
}