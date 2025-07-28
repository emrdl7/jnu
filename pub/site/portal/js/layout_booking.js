;(function ($) {
    'use strict';

    bootbox.addLocale('en', {
        OK: '예',
        CANCEL: '취소',
        CONFIRM: '확인'
    });

    window.alert = function (text, target) {
        bootbox.alert({
            message: text.replace(/\n/g, '<br>'),
            centerVertical: true,
            callback: function() {
                if(target) {

                    setTimeout(function() { $(target).focus(); }, 500);
                }
            }
        });
    };


    $(document).on("click", ".js-logout", function () {
        let returnURL= $(this).data('return-url');
        bootbox.confirm({
            title: '확인'
            , message: '로그아웃 하시겠습니까 ?'
            , callback: function (ok) {
                if (ok) {
                    location.href = '/nonmem.htm?act=logout&returnURL='+returnURL;
                }
            }
        });
    });


    $('.js-mypage').on('click', function () {
        location.href = '/mypage.htm';
    });

    $('.js-pwChkForm').on('click', function () {
        location.href = '/changePasswd.htm';
    });

    $('.js-modal').click(function () {
        $('#' + $(this).data('target')).modal('show');
    });

    const _globalViewModal = $('#globalViewModal'), _globalViewModalTitle = $('#globalViewModalTitle'), _globalViewModalBody = $('#globalViewModalBody');
    if (_globalViewModal.length > 0) {
        $('.js-global-view-modal').each(function () {
            const _button = $(this), _button_data = _button.data();

            _button.on('click', function (e) {
                e.preventDefault();

                let url = '';
                if (_button[0].tagName == 'A') {
                    url = _button.attr('href');
                } else if (_button[0].tagName == 'BUTTON') {
                    url = _button.data('href');
                }

                let param = _button_data['param'] || {};
                param['_out'] = 'body';

                if (_button_data['callback']) param['callback'] = _button_data['callback'];


                if (_button_data.title) {
                    _globalViewModalTitle.html(_button_data.title);
                } else {
                    _globalViewModalTitle.html(_button.html());
                }

                _globalViewModalBody.load(url, param, function (data) {
                    if (_globalViewModalBody.find('.alert-message').length > 0 && _globalViewModalBody.find('.alert-message').text()) {
                        alert(_globalViewModalBody.find('.alert-message').text());
                    } else {
                        if (!data.error) {
                            _globalViewModal.modal();

                            if(_button_data['modalId'])  {
                                _globalViewModal.attr('id',_button_data['modalId']);
                            }

                            if(_button_data['modalClass'])  {
                                _globalViewModal.addClass(_button_data['modalClass']);
                            }

                        }
                    }

                });
            });
        });

        $(document).on('click', '.js-global-close-modal', function () {
            _globalViewModal.modal('hide');
        });

        $(".js-menu-link a").on('click', function (e) {
            if(!$(this).hasClass("menu-3deps")) {
                $(this).css('pointer-events', 'none');
            }
        });
    }

}(jQuery));


function sslGsl(){

    $.ajax({
        type : 'POST',
        url : '/api/user/sso/gsl',
        data : {},
        dataType : 'json',
        success : function(data){
            if(data.status == "success"){
                var builder = [];
                var prefix = "https://gsl.jejunu.ac.kr";
                var action = "/session/linkGoogle.do";
                builder.push('<form method="post" target="_blank" action="' + prefix + action + '">');
                builder.push('<input type="hidden" name="uno" value="' + data.isOldAES_UserId + '"/>');
                builder.push('<input type="hidden" name="secure" value="isOldAES"/>');
                builder.push('<input type="submit" />');
                builder.push('</form>');
                $(builder.join('')).appendTo(document.body).submit().remove();

            }
        },error : function (data) {
            console.log(data.msg);
        }
    });

}


function sslCnugw(){

    $.ajax({
        type : 'POST',
        url : '/api/user/sso/cnugw',
        data : {},
        dataType : 'json',
        success : function(data){

            window.open(data.url);

        },error : function (data) {
        }
    });
}


function sslCerti(){
    $.ajax({
        type : 'POST',
        url : '/api/user/sso/certi',
        data : {},
        dataType : 'json',
        success : function(data){

            var builder = [];
            builder.push('<form method="post"  target="_blank" action="https://certi.jejunu.ac.kr/servlet/WMSSO">');
            builder.push('<input type="hidden" name="COMMAND" value="SSO"/>');
            builder.push('<input type="hidden" name="HAKBUN" value="' + data.HAKBUN + '"/>');
            builder.push('<input type="hidden" name="SLT" value="' + data.SLT + '"/>');
            builder.push('<input type="submit" />');
            builder.push('</form>');
            $(builder.join('')).appendTo(document.body).submit().remove();


        },error : function (data) {
        }
    });
}


var windowh = $(window).height();
var windowW = $(window).width();

window.onpageshow = function(event) {
    if ( event.persisted || (window.performance && window.performance.navigation.type == 2)) {
    }
}

$(window).on("resize", function(){

    windowh = $(window).height();
    windowW = $(window).width();

});



// Mobile 좌측메뉴
function subNaviView(){
    if(windowW < 991) {
        if($('.gnb-menu h3 a.active').length==0) {
            $('.gnb .gnb-menu:first-of-type h3 a').addClass('active');
            $('.gnb .gnb-menu:first-of-type .gnb-submenu').show();
        } else {
            $('.gnb-menu h3 a.active').parent().next('.gnb-submenu').show();
            $('.gnb-submenu>li>a.active').next('ul').show();
        }
        $('.m-menu').show();
    } else {
        //PC 전체메뉴

    }
}

function subNaviHide(){
    $('.m-menu').hide().queue(function(){
        $(this).hide();
        $(this).dequeue();
    });
}


// MenuBtn
var allMenuYn = false;
$('.menu-btn').click(function(){
    if(windowW < 991) {
        if(!allMenuYn){
            subNaviView();
            $('.bg_back').show();
        }else{
            subNaviHide();
            $('.bg_back').hide();
        }
        allMenuYn = !allMenuYn;
    }else {
        $('#gnb').addClass('all-menu');
    }
    return false;
});

$('.menu-closebtn').click(function(){
    if(windowW < 991) {
        subNaviHide();
        allMenuYn = false;
        $('.bg_back').hide();
    }
    return false;
});



// Mobile Gnb
var side_menu1 = $('.header.header_booking .gnb-menu>h3>a'),
    side_menu2 = $('.gnb-submenu');
side_menu1.click(function () {
    if(windowW < 991) {
        side_menu1.removeClass('active');
        $(this).addClass('active');
        side_menu2.hide();
        $(this).parents().next().show();
    }
});



// Mobile 아코디언
var accordion_tab = $('.gnb-submenu>li>a.menu-3deps'),
    accordion_content = $('.gnb-submenu>li>ul');
accordion_tab.on('click', function(e){
    if(windowW < 991) {
        accordion_content.slideUp('normal');
        accordion_tab.removeClass('active');
        if($(this).next().length>0) {
            e.preventDefault();
            if($(this).next().is(':hidden') == true) {
                $(this).next().slideDown('normal');
                $(this).addClass('active');
            }
        }
    }
});

// Mobile 메뉴검색
$('.header .btn-group .search-btn').click(function(){
    if(windowW < 991) {
        $('.search-box').show();
    }
});
$('.search-box .close-btn').click(function(){
    if(windowW < 991) {
        $('.search-box').hide();
    }
});


// PC Gnb
var menutype = true;
$('.gnb .gnb-menu h3, .gnb-submenu').hover(function() {
    if(windowW > 991) {
        $('.gnb-submenu').show();
        $(this).hover(function() {
        }, function(){
            $('.gnb-submenu').hide();
        });
    }
});
$(".gnb h3 a").focusin(function(){
    if(windowW > 991) {
        $(".gnb .gnb-submenu").show();
    }
});
$(".gnb .gnb-menu:last-child ul li:last-child a").focusout(function(){
    if(windowW > 991) {
        $(".gnb .gnb-submenu").hide();
    }
});

// 언어선택
$('.language>a').click(function(){
    $('.language-list').toggleClass("d-block");
});


// QUICK 버튼
$('.quick-wrap .quick-btn').click(function(){
    $('.quick-wrap').toggleClass("show");
});
$(".quick-wrap .quick-btn").focusin(function(){
    if(windowW > 991) {
        $('.quick-wrap').toggleClass("show");
    }
});
$(".quick-wrap .quick-list a:last-child").focusout(function(){
    if(windowW > 991) {
        $('.quick-wrap').toggleClass("show");
    }
});

//더보기버튼
$('.more-btn-wrap .more-btn').click(function(){
    $('.employ-wrap .employ-list-con.slide_cont').toggleClass("on");
    if ($('.employ-wrap .employ-list-con.slide_cont').css('display') == 'block') {
        $('.more-btn-wrap .more-btn span').text('숨기기');
    } else {
        $('.more-btn-wrap .more-btn span').text('더보기');

    }
});
//열기버튼(수정남음)
$('.open_btn a').click(function(){
    $(this).parents().prev('.table-none').toggleClass("on");

});


// TOP 버튼
if ($('#backtotop').length) {
    var scrollTrigger = 100, // px
        backToTop = function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                $('#backtotop').addClass('show');
            } else {
                $('#backtotop').removeClass('show');
            }
        };
    backToTop();
    $(window).on('scroll', function () {
        backToTop();
    });
    $('#backtotop').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });
}

