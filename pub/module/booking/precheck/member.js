;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingMemberPrecheckConfigForm');
        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    member: json
                });
            });
        });

    });

}(jQuery));