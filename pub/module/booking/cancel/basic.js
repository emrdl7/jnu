;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingBasicCancelConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    basic: json
                });
            });
        });

    });

}(jQuery));