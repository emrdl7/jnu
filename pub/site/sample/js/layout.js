;(function($) {
    'use strict';

    $(document).ajaxError(function(e, xhr, option, error) {
		var passData = queryToObject(option.data);
		if (passData.errorCallback && $.type(window[passData.errorCallback]) == 'function') {
			window[passData.errorCallback](e, xhr, option, passData);
		} else {
			let emptyPromise = new Promise($.noop);
			switch (xhr.status) {
				case 403:
				case 401:
					needLogin();
					return emptyPromise;
				case 404:
					showError('존재하지않는 URL');
					return emptyPromise;
			}
			return Promise.reject(xhr);
		}
	});

	$(document).ajaxSuccess(function (e, xhr, option, data) {
		if(_.isObject(data) && 	_.has(data, 'error') && data['error']) {
			if(_.has(data, 'errorMsg')) {
				showError(data.errorMsg);
			} else {
				showError('요청 처리중 에러가 발생했습니다.\n같은 문제가 계속되면 관리자에게 문의해주십시오');
			}
		}
	});

    $('.js-logout').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        swal({
            title : "로그아웃",
            text : "로그아웃 하시겠습니까 ?",
            type : 'info',
            showCancelButton : true,
            confirmButtonClass : "btn-primary",
            confirmButtonText : "로그아웃",
            cancelButtonText : "아니오",
            closeOnConfirm : false,
            closeOnCancel : true
        }, function(isConfirm) {
            if (isConfirm) {
                doForm({url: $this.attr('href'), act: 'logout'});
            }
        });
    });

    let doLogin = function (returnUrl) {
        var now = new URI(), to = new URI('/login.htm');
        to.search({returnUrl: returnUrl || now.path()});
        location.href = to.href();
    };
    window.doLogin = doLogin;

    let needLogin = function (toUrl) {
        swal({
            title: "로그인",
            text: "로그인이 필요한 기능입니다.\n지금 로그인하시겠습니까 ?",
            type: 'info',
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "로그인",
            cancelButtonText: "아니오",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                doLogin(toUrl);
            }
        });
    };
    window.needLogin = needLogin;

    $('.js-need-login').on('click', function(e) {
        if(!_CONF.LOGIN) {
            e.preventDefault();
            var $this = $(this);
            needLogin($this.attr('href'));
        }
    });

    $('.js-login').on('click', function(e) {
        e.preventDefault();
        doLogin();
    });

}(jQuery));