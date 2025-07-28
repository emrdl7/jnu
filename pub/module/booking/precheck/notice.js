;(function($) {
    'use strict';
// BookingPeriodPayConfig
    $(function() {
        const form = $('#BookingNoticePrecheckConfigForm');
        form.find('input').on('blur', function() {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    notice: json.notice
                });
            });
        });
    });

}(jQuery));