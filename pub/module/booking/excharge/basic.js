;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingBasicExchargeConfigForm');


        $(document).on('click', '.js-excharge-del', function ( e ) {
            $(this).closest("div.form-group.row").remove();
            exchargeSave();
        });

        $(form).find(".js-add-ok").on('click', function () {
            exchargeSave();
        });

        if(form.find("input[name='jsonValue']").val() != undefined) {
            const data = JSON.parse(form.find("input[name='jsonValue']").val());
            if(data.basic) {
                for (const key in data.basic) {
                    const excharge = data.basic[key];
                    form.find('.panel-body-form').append($("#exchargeTmpl").render({groupId:key,groupIndex:key.replace("excharge",""), excharge :excharge}));
                    initDaterange();

                }
            }
        }

        $(document).on('click', '.js-excharge-add', function ( e ) {
            let groupIndex = form.find('.panel-body-form .form-group').length;
            if(groupIndex) {
                groupIndex = form.find('.panel-body-form .form-group').last().data('group-index')+1;
            }

            let groupId = "excharge"+groupIndex;
            form.find('.panel-body-form').append($("#exchargeTmpl").render({groupId:groupId,groupIndex:groupIndex,excharge:""}));

            initDaterange();

        });

        function exchargeSave() {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    basic: json
                });
            });
        }

    });

}(jQuery));