;(function($) {
    'use strict';
// BookingPeriodPayConfig
    $(function() {
        const form = $('#BookingBookUnitPrecheckConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    unit: json
                });
            });
        });


        $(document).on('click', 'input[name="timeUseType[]"]', function ( e ) {
           if($(this).prop("checked")) {
               $(".js-time-range-"+$(this).val()).show();
           } else {
               $(".js-time-range-"+$(this).val()).hide();
           }
        })

    });

}(jQuery));