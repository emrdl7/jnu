;(function($) {
    'use strict';
// BookingPeriodPayConfig
    $(function() {

        const form = $('#BookingAramusehallPrecheckConfigForm');

        $(document).on('click', '.js-aramusehall-del', function ( e ) {
            $(this).closest("tr").remove();
            let groupId = $(this).data('group-id');
            $('div.aramusehall-form[data-group-id="'+groupId+'"]').remove();

            aramusehallSave();
        });

        $(document).on('click', '.js-aramusehall-add', function ( e ) {
            $('#aramusehallModal').data('act','add');
            let groupIndex = form.find('.js-aramusehall-list .aramusehall-form').length;
            if(groupIndex) {
                groupIndex = form.find('.js-aramusehall-list .aramusehall-form').last().data('group-index')+1;
            }
            let groupId = "aramusehall"+groupIndex;

            $("#aramusehallModal .modal-body").html($("#aramusehallTmpl").render({groupId:groupId,groupIndex:groupIndex,aramusehall:""}));
            $("#aramusehallModal").modal();
            initModalDatePicker();
        });
        $(document).on('click', '.js-aramusehall-edit', function ( e ) {
            $('#aramusehallModal').data('act','edit');
            let groupId = $(this).data('group-id');
            let clone = $('div.aramusehall-form[data-group-id="'+groupId+'"]').clone().prop('outerHTML');

            $('.js-aramusehall-detail div.aramusehall-form[data-group-id="'+groupId+'"]').remove();

            $("#aramusehallModal .modal-body").html(clone);
            $("#aramusehallModal").modal();
            initModalDatePicker();
            applyModalRadioStates(); // 사용안함 시 예약기간 비활성화

        });

        $(document).on('click', '.js-aramusehall-copy', function ( e ) {
            $('#aramusehallModal').data('act','copy');
            let groupId = $(this).data('group-id');
            let clone = $('div.aramusehall-form[data-group-id="'+groupId+'"]').clone();

            let groupIndex = form.find('.js-aramusehall-list .aramusehall-form').last().data('group-index')+1;
            let newGroupId = "aramusehall"+groupIndex;

            clone.attr('data-group-id', newGroupId).attr('data-group-index',groupIndex);
            let cloneHtml = clone.prop('outerHTML');
            cloneHtml = cloneHtml.replace(new RegExp(groupId, 'g'), newGroupId);

            $("#aramusehallModal .modal-body").html(cloneHtml);
            $("#aramusehallModal").modal();
            initModalDatePicker();

        });

        $('#aramusehallModal').on('hide.bs.modal', function (e) {

            if($('#aramusehallModal').data('act') =='edit') {
                form.find('.js-aramusehall-detail').append($("#aramusehallModal .modal-body").html());
            } else if($('#aramusehallModal').data('act') =='copy') {
                $("#aramusehallModal .modal-body").html('');
            }
        });

        if(form.find("input[name='jsonValue']").val() !='') {
            const data = JSON.parse(form.find("input[name='jsonValue']").val());
            for (const key in data.aramusehall) {
                const aramusehall = data.aramusehall[key];
                console.log(aramusehall);
                form.find('.js-aramusehall-list tbody').append($("#aramusehallListTmpl").render({groupId:key,groupIndex:key.replace("aramusehall",""), aramusehall :aramusehall}));
                form.find('.js-aramusehall-detail').append($("#aramusehallTmpl").render({groupId:key,groupIndex:key.replace("aramusehall",""), aramusehall :aramusehall}));
            }
            initModalDatePicker();
        }

        $(document).on('click', '.js-aramusehall-add-ok', function ( e ) {
            aramusehallSave();

        });
// 사용안함 시 예약기간 비활성화
        function applyModalRadioStates() {
            let $modalBody = $("#aramusehallModal .modal-body");

            $modalBody.find('input[name$="[rBook]"]:checked').each(function() {
                toggleRBookFieldsInModal($(this), $modalBody);
            });
            $(document).off('change.aramusehallModalRBook').on('change.aramusehallModalRBook', '#aramusehallModal .modal-body input[name$="[rBook]"]', function(){
                toggleRBookFieldsInModal($(this), $modalBody);
            });


            $modalBody.find('input[name$="[sBook]"]:checked').each(function() {
                toggleSBookFieldsInModal($(this), $modalBody);
            });
            $(document).off('change.aramusehallModalSBook').on('change.aramusehallModalSBook', '#aramusehallModal .modal-body input[name$="[sBook]"]', function(){
                toggleSBookFieldsInModal($(this), $modalBody);
            });
        }

        function toggleRBookFieldsInModal($radio, $container) {
            const groupId = $radio.attr('name').split('[')[0];
            const $start = $container.find('[name="'+ groupId +'[rBookStartPeriod]"]');
            const $end   = $container.find('[name="'+ groupId +'[rBookEndPeriod]"]');

            if($radio.val() === 'N') {
                $start.prop('disabled', true).val('');
                $end.prop('disabled', true).val('');
            } else {
                $start.prop('disabled', false);
                $end.prop('disabled', false);
            }
        }
        function toggleSBookFieldsInModal($radio, $container) {
            const groupId = $radio.attr('name').split('[')[0];
            const $start = $container.find('[name="'+ groupId +'[sBookStartPeriod]"]');
            const $end   = $container.find('[name="'+ groupId +'[sBookEndPeriod]"]');

            if($radio.val() === 'N') {
                $start.prop('disabled', true).val('');
                $end.prop('disabled', true).val('');
            } else {
                $start.prop('disabled', false);
                $end.prop('disabled', false);
            }
        }

        $('input[name$="[rBook]"]:checked').each(function() {
            toggleRBookFields($(this));
        });
        $(document).on('change', 'input[name$="[rBook]"]', function(){
            toggleRBookFields($(this));
        });
        function toggleRBookFields($radio){
            const groupId = $radio.attr('name').split('[')[0];
            const $start = form.find('[name="'+ groupId +'[rBookStartPeriod]"]');
            const $end   = form.find('[name="'+ groupId +'[rBookEndPeriod]"]');
            if($radio.val() === 'N') {
                $start.prop('disabled', true).val('');
                $end.prop('disabled', true).val('');
            } else {
                $start.prop('disabled', false);
                $end.prop('disabled', false);
            }
        }

        $(document).on('change', 'input[name$="[sBook]"]', function(){
            toggleSBookFields($(this));
        });
        function toggleSBookFields($radio){
            const groupId = $radio.attr('name').split('[')[0];
            const $start = form.find('[name="'+ groupId +'[sBookStartPeriod]"]');
            const $end   = form.find('[name="'+ groupId +'[sBookEndPeriod]"]');
            if($radio.val() === 'N') {
                $start.prop('disabled', true).val('');
                $end.prop('disabled', true).val('');
            } else {
                $start.prop('disabled', false);
                $end.prop('disabled', false);
            }
        }
// 사용안함 시 예약기간 비활성화
        function aramusehallSave() {
            submitConfigForm(form, function(json) {
                return JSON.stringify({
                    aramusehall: json
                });
            });


            setTimeout(function() {
                location.reload();
            }, 500);

        }

        function initModalDatePicker() {

            const _datetimeDefaultOption = {
                showTodayButton: true,
                showClose: true,
                locale: 'ko',
                stepping: 10,
                sideBySide: true,
                format: 'YYYY-MM-DD HH:mm',
                widgetPositioning: {
                    horizontal: 'auto',  // 기본값 (좌우 자동 조정)
                    vertical: 'bottom'   // 항상 아래쪽에 위치
                }
            };
            $('#BookingAramusehallPrecheckConfigForm .intput-datetime').datetimepicker(_datetimeDefaultOption);
        }
    });

}(jQuery));