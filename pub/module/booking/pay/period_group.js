;(function($) {
    'use strict';
    $(function() {
        const form = $('#BookingPeriodGroupPayConfigForm'), gruopList = form.find('.groups');

        $(document).on('click', '.js-group-period-del', function ( e ) {
            $(this).closest("div.form-group.row").remove();
            groupPeriodSave();
        });

        $(form).find(".js-add-ok").on('click', function () {
            groupPeriodSave();
        });

        function groupPeriodSave() {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    periodGroupPays: json
                });
            });
        }

        if(form.find("input[name='jsonValue']").val() != undefined) {
            const data = JSON.parse(form.find("input[name='jsonValue']").val());
            if(data.periodGroupPays) {
                for (const groupKey in data.periodGroupPays) {
                    const groupData = data.periodGroupPays[groupKey];
                    form.find('.panel-body-form').append($("#groupsTmpl").render({groupId:groupKey,groupIndex:groupKey.replace("pricePeriodGroup","")  , periodGroupPays :groupData}));
                    if( groupData.day) {
                        for (var i = 0 ;i < groupData.day.length; i++) {
                            $("input[name='"+groupKey+"[day][]'][value='"+groupData.day[i]+"']").prop("checked", true);
                        }
                    }


                }
            }
        }

        $('#BookingPeriodGroupPayConfigForm .select').on('hidden.bs.select', function (e) {
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

            let groupId = "pricePeriodGroup"+groupIndex;
            const  groupData = [];
            groupData['groupNm'] = selectedTexts.join(",");
            groupData['groupId'] = selectedValues.join(",");
            form.find('.panel-body-form').append($("#groupsTmpl").render({groupId:groupId, groupIndex : groupIndex, periodGroupPays :groupData}));

        });


    });

}(jQuery));