;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingStayDcConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    stay: json
                });
            });
        });

    });

}(jQuery));