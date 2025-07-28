;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingBasicRefundConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    basic: json
                });
            });
        });



        if(form.find("input[name='jsonValue']").val() != undefined) {
            const data = JSON.parse(form.find("input[name='jsonValue']").val());
            if(data.periodGroupPays) {
                for (const groupKey in data.periodGroupPays) {
                    const groupData = data.periodGroupPays[groupKey];
                    form.find('.panel-body-form').append($("#groupsTmpl").render({groupId:groupKey.replace("G_","")  , periodGroupPays :groupData}));
                }
            }
        }



        $(document).on('click', '.js-refund-add', function ( e ) {
            let refundIndex = form.find('.panel-body-form .js-refund-list .refund-list').length;
            if(refundIndex) {
                refundIndex = form.find('.panel-body-form .js-refund-list .refund-list').last().data('refund-index')+1;
            }

            let refundId = "refund"+refundIndex;
            form.find('.panel-body-form .js-refund-list').append($("#refundTmpl").render({refundId:refundId,refundIndex:refundIndex,refund:""}));
        });

        $(document).on('click', '.js-add-refund-pay', function ( e ) {
            let refundIndex = $(this).data('refund-index');
            $(this).prev(".refund-pay-list").append('<p><span class="form-check-inline" ><input type="text" class="form-control width-100" name="refund['+refundIndex+'][day][]">일전 취소시 <input type="text" class="form-control width-100" name="refund['+refundIndex+'][refund][]">% 환불</span> <button type="button" class="btn btn-xs btn-warning js-remove-refund-pay">삭제</button></p>')
        });
        $(document).on('click', '.js-remove-refund', function ( e ) {
            $(this).closest(".refund-list").remove();
        });

        $(document).on('click', '.js-remove-refund-pay', function ( e ) {
            $(this).closest("p").remove();
        });



    });

}(jQuery));