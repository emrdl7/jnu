;(function($) {
    'use strict';
// BookingPeriodPayConfig
    $(function() {
        const form = $('#BookingDeadlinePrecheckConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    deadline: parseInt(json.deadline)
                });
            });
        });

    });

}(jQuery));