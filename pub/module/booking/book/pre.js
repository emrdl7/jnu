;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingPreBookConfigForm');
        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    pre: json
                });
            });
        });
    });

}(jQuery));