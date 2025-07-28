;(function($) {
    'use strict';
// BookingDayPrecheckConfig
    $(function() {
        const form = $('#BookingDayGroupPrecheckConfigForm');
        $(form).find(".js-add-ok").on('click', function () {
            dayGorupSave();
        });

        $(document).on('click', '.js-day-group-del', function ( e ) {
            $(this).closest("div.form-group.row").remove();
            dayGorupSave();
        });

        function dayGorupSave() {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    dayGroup: json
                });
            });
        }

        if(form.find("input[name='jsonValue']").val() != undefined) {
            const data = JSON.parse(form.find("input[name='jsonValue']").val());
            if(data.dayGroup) {
                for (const groupKey in data.dayGroup) {
                    const groupData = data.dayGroup[groupKey];
                    form.find('.panel-body-form').append($("#dayGroupsTmpl").render({groupId:groupKey,groupIndex:groupKey.replace("dayGroup","")  , dayGroup :groupData}));
                    for (var i = 0 ;i < groupData.day.length; i++) {
                        $("input[name='"+groupKey+"[day][]'][value='"+groupData.day[i]+"']").prop("checked", true);
                    }
                }
            }
        }

        $('#BookingDayGroupPrecheckConfigForm .select').on('hidden.bs.select', function (e) {
            e.stopPropagation();

            const selectedValues = $(this).val();

            const selectedTexts = [];
            if (selectedValues) {
                selectedValues.forEach(value => {
                    const text = $(this).find(`option[value="${value}"]`).text();
                    selectedTexts.push(text);
                });
            }

            $(this).val("").selectpicker('refresh');

            let groupIndex = form.find('.panel-body-form .form-group').length;
            if(groupIndex) {
                groupIndex = form.find('.panel-body-form .form-group').last().data('group-index')+1;
            }

            let groupId = "dayGroup"+groupIndex;
            const  groupData = [];
            groupData['groupNm'] = selectedTexts.join(",");
            groupData['groupId'] = selectedValues.join(",");


            form.find('.panel-body-form').append($("#dayGroupsTmpl").render({groupId:groupId, groupIndex : groupIndex, dayGroup :groupData}));

        });


    });

}(jQuery));