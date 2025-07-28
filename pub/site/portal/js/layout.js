;(function ($) {
	'use strict';

	bootbox.addLocale('en', {
		OK: '확인',
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
		bootbox.confirm({
			title: '확인'
			, message: '로그아웃 하시겠습니까 ?'
			, callback: function (ok) {
				if (ok) {
					location.href = '/login.htm?act=logout';
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
						//if (!data.error) {
							_globalViewModal.modal();

							if(_button_data['modalId'])  {
								_globalViewModal.attr('id',_button_data['modalId']);
							}

							if(_button_data['modalClass'])  {
								_globalViewModal.addClass(_button_data['modalClass']);
							}

						//}
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



// 모바일 좌측메뉴
var windowh = $(window).height();
function subNaviView(){
	if($('.gnb .gnb-menus .gnb-title a.active').length==0) {
		$('.gnb .gnb-menus:first-of-type .gnb-title a').addClass('active');
		$('.gnb .gnb-menus:first-of-type .gnb-submenu').show();
	} else {
		$('.gnb .gnb-menus .gnb-title a.active').parent().next('.gnb-submenu').show();
		$('.gnb .gnb-submenu>ul>li>a.active').next('ul').show();
	}
	$('.back').show();
	$('html,body').css({overflow:'hidden', height:windowh});
	$('body').bind('touchmove', function(e){e.preventDefault()});
	$('.m-menu').show().animate({ 'margin-right' : '0' }, 'fast', function() { });
}
function subNaviHide(){
	$('.back').hide();
	$('html,body').removeAttr('style');
	$('body').unbind('touchmove');
	$('.m-menu').animate({ 'margin-right' : '-100%' }, 'fast', function() { }).queue(function(){
		$(this).hide();
		$(this).dequeue();
	});
}

var allMenu = false;
$('.all-menu-view a').click(function(){
	if(windowW < 991) {
		if(!allMenu){
			subNaviView();
		}else{
			subNaviHide();
		}
		allMenu = !allMenu;
	}else if(windowW > 991) {
		menutype = false;
		$('#gnb').removeClass("gnb");
		$('#gnb').addClass("all-menu");
		$('body').css("overflow","hidden");
		//$('#gnb').attr("tabindex", 0).show().focus();
		$('#gnb .allmenu-title a').focus();
	}
	return false;
});

$('.all-menu-close a, .back').click(function(){
	if(windowW < 991) {
		subNaviHide();
		allMenu = false;
	}else if(windowW > 991) {
		menutype = true;
		$('#gnb').removeClass("all-menu");
		$('#gnb').addClass("gnb");
		$('body').css("overflow","auto");
		$('.gnb-submenu>ul>li>ul').removeAttr('style');
	}
	return false;
});

$('.all-menu-close a').click(function(){
	$('.all-menu-view a').focus();
});


// 메뉴1
var side_menu1 = $('.gnb .gnb-menus>.gnb-title>a'),
	side_menu2 = $('.gnb .gnb-submenu');
side_menu1.click(function () {
	if(windowW < 991) {
		side_menu1.removeClass('active');
		$(this).addClass('active');
		side_menu2.hide();
		$(this).parents().next().show();
		return false;
	}
});


// 아코디언
var accordion_tab = $('.gnb .gnb-submenu>ul>li>a.menu-2'),
	accordion_content = $('.gnb .gnb-submenu>ul>li>ul');
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



// pc Gnb
var menutype = true;
$(".gnb .gnb-title a").click(function() {
	if(windowW > 991) {

		if($(this).parent().parent().find(".gnb-submenu").hasClass('show')){
			$(".gnb .gnb-title a").removeClass("active");
			$(".gnb-submenu").removeClass("show");
			$(".back").hide();

		}else{
			$(".gnb .gnb-title a").removeClass("active");
			$(".gnb-submenu").removeClass("show");

			$(this).addClass("active");
			$(this).parent().parent().find(".gnb-submenu").addClass("show");
			$(".back").show();
		}

	}
});


$(".back").click(function() {
	if(windowW > 991) {
		$(".gnb .gnb-title a").removeClass("active");
		$(".gnb-submenu").removeClass("show");
		$(this).hide();
	}
});
$(".gnb h3 a").focusin(function(){
	if(windowW > 991) {
		$('.gnb-submenu-wrap').show();
	}
});
$(".gnb .gnb-menu:last-child ul li:last-child a").focusout(function(){
	if(windowW > 991) {
		$(".gnb .gnb-submenu-wrap").hide();
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

//헤더 배너 닫기버튼
$('.top-banner .close-btn').click(function(){
	$('.top-banner').hide();
	return false;

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

// var  header = $(".header");
//
// $(window).scroll(function(){
// 	var headerH = header.height();
// 	if ( $(this).scrollTop() > headerH ) {
// 		header.addClass("fixed");
// 	} else {
// 		header.removeClass("fixed");
// 	}
// });



