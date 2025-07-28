;(function($) {
    'use strict';
// BookingDayPrecheckConfig
    $(function() {
        const form = $('#BookingDayPrecheckConfigForm');
        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    day: json
                });
            });
        });

    });

}(jQuery));