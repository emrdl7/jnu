;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingHolidayBookPrecheckConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    holidayBook: json.holidayBook
                });
            });
        });


    });

}(jQuery));