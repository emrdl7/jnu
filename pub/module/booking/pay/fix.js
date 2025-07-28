;(function($) {
'use strict';
// BookingPeriodPayConfig
$(function() {
	const form = $('#BookingFixPayConfigForm');

	$(form).find(".js-add-ok").on('click', function () {
		submitConfigForm(form, function(json) {
			return JSON.stringify({
				pay: parseInt(json.pay)
			});
		});
	});

});

}(jQuery));