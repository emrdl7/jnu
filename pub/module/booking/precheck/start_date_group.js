;(function($) {
    'use strict';
// BookingPeriodPayConfig
    $(function() {
        const form = $('#BookingStartDateGroupPrecheckConfigForm');

        $(form).find(".js-add-ok").on('click', function () {
            startDateGroupSave();
        });

        $(document).on('click', '.js-day-group-del', function ( e ) {
            $(this).closest("div.form-group.row").remove();
            startDateGroupSave();
        })

        function startDateGroupSave() {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    startDateGroup: json
                });
            });
        }




        if(form.find("input[name='jsonValue']").val() != undefined) {
            const data = JSON.parse(form.find("input[name='jsonValue']").val());
            const select = ['startMonth','startMonthTime','openMonth','startWeek','startWeekTime','openWeek','startLastWeek','startLastWeekTime','openLastMonth'];
            if(data.startDateGroup) {
                for (const groupKey in data.startDateGroup) {
                    const groupData = data.startDateGroup[groupKey];
                    form.find('.panel-body-form').append($("#startDateGroupTmpl").render({groupId:groupKey,groupIndex:groupKey.replace("dayGroup","")  , startDateGroup :groupData}));

                    $("input[name='"+groupKey+"[start]'][value='"+groupData.start+"']").prop("checked", true);

                    for(let i = 0; i < select.length; i++ ) {
                        $("select[name='"+groupKey+"["+select[i]+"]'] option[value='"+groupData[select[i]]+"']").prop("selected", true);
                    }

                }
            }
        }



        $('#BookingStartDateGroupPrecheckConfigForm .select').on('hidden.bs.select', function (e) {
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


            form.find('.panel-body-form').append($("#startDateGroupTmpl").render({groupId:groupId, groupIndex : groupIndex, startDateGroup :groupData}));


        });

    });


}(jQuery));