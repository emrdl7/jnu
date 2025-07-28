;(function($) {
'use strict';
// BookingPeriodPayConfig
$(function() {
	const form = $('#BookingPeriodPayConfigForm');

	$(form).find(".js-add-ok").on('click', function () {
		submitConfigForm(form, function(json) {
			return JSON.stringify({
				periodPay: json
			});
		});
	});
});

}(jQuery));