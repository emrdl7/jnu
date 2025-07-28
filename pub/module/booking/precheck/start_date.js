;(function($) {
    'use strict';
// BookingPeriodPayConfig
    $(function() {
        const form = $('#BookingStartDatePrecheckConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    startDate: json
                });
            });
        });

    });

}(jQuery));