;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingTimeExchargeConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    time: json
                });
            });
        });


    });

}(jQuery));