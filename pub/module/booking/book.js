;(function($) {
    'use strict';
    $(function () {

        const URL =  window.location.pathname;


        $(".custom-file-input").on("change", function() {
            var fileName = $(this).val().split("\\").pop();
            $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        });

        $("input[name='dateUpdateFl']").click(function(e) {
           if($(this).prop("checked")) {
               $("input[name='bookStartTime1']").attr("readonly",false);
               $("input[name='bookEndTime1']").attr("readonly",false);
           } else {
               $("input[name='bookStartTime1']").attr("readonly",true);
               $("input[name='bookEndTime1']").attr("readonly",true);
           }
        });


        $("input[name='excharges']").click(function(e) {
            calcPay(true);
        });

        initFormValidate();
        var form = $('#bookForm');
        form.parsley().on('form:submit', function () {
            var agree = true, provisions = $('input.agree-need'), needProvisionNames = [];
            if (provisions.length > 0) {
                provisions.each(function () {
                    if (!$(this).is(':checked')) {
                        needProvisionNames.push($(this).data('name'));
                    }
                });

                if (needProvisionNames.length > 0) {
                    swal('확인', '다음 약관들에 동의해야 합니다.\n\n' + needProvisionNames.join('\n'), 'info');
                    return false;
                }
            }

            if($("input[name='payMethod']:checked").val() =='CARD') {
                $('#bookForm').attr("target","formReceiver");
            }

            if ("undefined" !== typeof bankMsg && bankMsg !== null) {
                if($("input[name='payMethod']:checked").val() =='BANK') {
                    if(confirm(bankMsg)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return true;
            }

            return false;

        });

        $(".js-room-price").click(function(e) {

            let roomNm = $(this).data("name");
            $.ajax({
                url: URL,
                dataType: 'json',
                data: {
                    act: 'getPayRooms',
                    room: $(this).data('room'),
                    _out: 'json'
                },
                success: function (data) {

                    let excharge = 0;
                    if(Object.keys(data.exchargeResult).length > 0) {
                        $.each(data.exchargeResult.excharges, function (idx, item) {
                           if(item.auto =='Y' && item.calc =='day' ) {
                               excharge += parseInt(item.excharge);
                           }
                        });
                    }

                    $("#roomsPriceModal .js-room-price-modal").html($( "#roomPriceTmpl" ).render( {name : roomNm,priceList :data.roomPrice,amount :data.amount,excharge :excharge} ));
                    $("#roomsPriceModal").modal();
                }
            });
        });
        let calcPayTimeout;

        $("#rooms").on("change", function() {
            updateDateTimeFormat();
            triggerCalcPay();
            $("#bookRoomName").val($("#rooms option:selected").text());
        });

        setDateTime(getSelectedRoomFormat());

        function updateDateTimeFormat() {
            let format = getSelectedRoomFormat();
            setDateTime(format);
        }

        function getSelectedRoomFormat() {
            return $("select[name='room'] option:selected").data("type") == '001' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm';
        }

        function setDateTime(dformat) {
            $(".intput-datetime.manager").each(function () {
                if ($(this).data("DateTimePicker")) {
                    $(this).data("DateTimePicker").destroy();
                }

                let settings = {
                    format: dformat,
                    useCurrent: false,
                    stepping: 30,
                    showClear: true,
                    sideBySide: true,
                    locale: 'ko',
                    calendarWeeks: true
                };

                $(this).datetimepicker(settings)
                    .on('dp.show', function(e) {
                        e.preventDefault();
                    })
                    .on('dp.change', function(e) {
                        e.preventDefault();
                        $(this).blur();
                        triggerCalcPay();
                    });
            });
        }

        function isFormFilled() {
            return $("#rooms").val() && $("#bookStartTime1").val() && $("#bookEndTime1").val();
        }

        function triggerCalcPay() {
            if (isFormFilled()) {
                clearTimeout(calcPayTimeout);
                calcPayTimeout = setTimeout(() => {
                    calcPay(false);
                }, 100); // 100ms 동안 중복 실행 방지
            }
        }

        $(".js-amount,.js-dc,.js-add").on("change", function() {
            $(".js-total-amount").val(parseInt($(".js-add").val())+parseInt($(".js-amount").val())-parseInt($(".js-dc").val()));
        });

        //입력인데 날짜 넘어왔을때 계산
        if($("input[name='bkSeq']").length == 0 && $("input[name='bookStartTime1']").val() != '') {
            calcPay(true);
            $("input[name='name']").val($("#rooms option:selected").text());
        }

        let bookStartTime1 = "";
        let bookEndTime1 = "";
        function calcPay(reloadFl) {
                let data = $('.js-book-frm').find('input, select, textarea').serialize() + "&act=calcPay&_out=json";
                if($("input[name='cmd']").val() =='edit') {
                    data = data + "&bkSeq="+$("input[name='bkSeq']").val();
                }

                $.ajax({
                    url: URL,
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        if (data.canBook) {
                            let excharge = data.excharge;
                            let dc = data.dc;
                            let pay = data.pay;

                            let amount = pay +excharge  - dc;


                            $(".js-total-amount").val(amount);
                            $(".js-dc").val(dc);
                            $(".js-add").val(excharge);
                            $(".js-amount").val(pay);


                            $(".js-total-amount-text").html(amount.toLocaleString()+"원");
                        } else {
                            $(".js-total-amount").val("0");
                            $(".js-amount").val("0");
                            $(".js-dc").val("0");
                            alert("예약이 불가능 합니다");
                            /*
                            $("#rooms").selectpicker('refresh');
                            $("#bookStartTime1").val("");
                            $("#bookEndTime1").val("");*/
                        }

                        bookStartTime1 = $("#bookStartTime1").val();
                        bookEndTime1 = $("#bookEndTime1").val();
                    }
                });

        }
    });
}(jQuery));