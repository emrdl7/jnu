;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingSlotsBookConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    slots: json
                });
            });
        });

    });

}(jQuery));