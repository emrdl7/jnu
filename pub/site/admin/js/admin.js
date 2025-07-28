(function ($) {
	'use strict';

	bootbox.addLocale('en', {
		OK: '예',
		CANCEL: '취소',
		CONFIRM: '확인'
	});

	$(function () {
		App.init();
	});

	window.initUI = function () {
		initTooltipPopover();
		initFormValidate();
		initAjaxForm();
		initSortableTable();
		initCheckableTable();
		initSelect();
		initPopup();
		initLabelPicker();
		initFancybox();
		initCollapse();
		initBytes();
		initDaterange();
		initDatepicker();
		initDateTimePicker();
		$('.dropdown-toggle').dropdown();
		$('.focus').focus();
	};

	$(function () {
		initUI();

		/*
		 * ---------------------------------------------
		 * Gritter Options ( https://github.com/jboesch/Gritter/wiki )
		 * ---------------------------------------------
		 */
		$.extend($.gritter.options, {
			position: 'bottom-left',
			fade_in_speed: 'fast',
			fade_out_speed: 1000,
			time: 2000
		});

		/* 폼 리시버 토글 (F9) */
		$(window).on('keydown', function (e) {
			var code = e.keyCode || e.which;
			if (code == 120) $('.form-receiver-container').toggle();
		});

		/*
		 * ---------------------------------------------
		 * AJAX COMMON HADLERS
		 * ---------------------------------------------
		 */
		var _ajaxTime = null;
		$(document).ajaxStart(function () {
			_ajaxTime = new Date().getTime();
		});
		$(document).ajaxSuccess(function (e, xhr, option, data) {
			var passData = $.type(option.data) == 'string' ? queryToObject(option.data) : option.data;
			// 1s 이상 수행시간이 걸리는 요청에 대해서만 alert
			var ajaxTotalTime = new Date().getTime() - _ajaxTime;
			if (!data.error && _.has(passData, 'successCallback') && $.type(window[passData.successCallback]) == 'function') {
				window[passData.successCallback](e, xhr, option, data);

			} else if (data.error && _.has(passData, 'errorCallback') && $.type(window[passData.errorCallback]) == 'function') {
				window[passData.errorCallback](e, xhr, option, data);

			} else if (!data.error && ajaxTotalTime > 3000) {
				// $.gritter.add({
				// 	title : 'OK',
				// 	class_name : 'success',
				// 	text : '요청이 정상 처리됐습니다. (' + (ajaxTotalTime / 1000) + 's)',
				// 	time : 2000
				// });
			} else if (data.error) {
				var errorText = '';
				if (_.has(data, 'errorMsg')) errorText = data.errorMsg;
				if (_.has(data, 'msg')) errorText = data.msg;
				if (_.has(data, 'errorType')) errorText += ' [' + data.errorType + ']';

				$.gritter.add({
					title: 'ERROR',
					text: errorText,
					class_name: 'gritter-danger',
					sticky: false,
					time: 5000
				});
			}
		});
		$(document).ajaxError(function (e, xhr, option, error) {
			var passData = queryToObject(option.data);
			if (passData.errorCallback && $.type(window[passData.errorCallback]) == 'function') {
				window[passData.errorCallback](e, xhr, option, passData);
			} else {
				console.error(e, xhr, option, error);
				$.gritter.add({
					title: 'ERROR',
					class_name: 'gritter-danger',
					text: '요청 수행 중 오류가 발생했습니다. [콘솔 확인]',
					sticky: true
				});
			}
		});

		/*
		 * ----------------------------------------------------------
		 * PAGE HELPER
		 * ----------------------------------------------------------
		 */
		var $help = $('ul.help'), help_slide_duration = 'fast', help_off_cookie_name = 'page_help_off p-0 border-0', help_off_class = 'help-off border-0', icon_up = 'fa fa-chevron-up', icon_down = 'fa fa-chevron-down';
		if ($help.length > 0) {
			$help.addClass('bg-white list-unstyled border-1 border-gray-400 rounded p-3 mb-2');
			var $helpLis = $('li', $help).each(function (i, li) {
				var $li = $(li);
				$li.addClass('p-5');
				if ($li.hasClass('text-warning')) {
					$li.html('&nbsp;' + $li.html()).prepend($('<i class="fa fa-warning"></i>'));
				} else if ($li.hasClass('text-info')) {
					$li.html('&nbsp;' + $li.html()).prepend($('<i class="fa fa-lightbulb-o"></i>'));
				} else if ($li.hasClass('text-danger')) {
					$li.html('&nbsp;' + $li.html()).prepend($('<i class="fa fa-info-circle"></i>'));
				} else {
					$li.html('&nbsp;' + $li.html()).prepend($('<i class="fa fa-check"></i>'));
				}
			});

			if (Cookies.get(help_off_cookie_name) == 'on') {
				$('li', $help).slideUp(help_slide_duration);
				$help.addClass(help_off_class);
			}

			var icon = Cookies.get(help_off_cookie_name) == 'on' ? icon_down : icon_up;
			var $toggler = $('<span class="float-right ml-3 mt-3 mr-md-3 label label-secondary" title="도움말 접기/펴기"><small><i class="' + icon + '"></i> 도움말</small></span>').css({
				cursor: 'pointer'
			});
			$toggler.prependTo($('#content'));
			$toggler.click(function () {
				if ($help.hasClass(help_off_class)) {
					$help.removeClass(help_off_class);
					$helpLis.slideDown(help_slide_duration, function () {
						$toggler.find('i').removeClass(icon_down).addClass(icon_up);
					});
					// remove help-off from cookie
					Cookies.remove(help_off_cookie_name);
				} else {
					$helpLis.slideUp(help_slide_duration, function () {
						$help.addClass(help_off_class);
						$toggler.find('i').removeClass(icon_up).addClass(icon_down);
					});
					// save help-off to cookie
					Cookies.set(help_off_cookie_name, 'on', {
						expires: 365 * 10
					});
				}
			});
		}
	});

	/**
	 * admin 용 URL생성
	 */
	window.admin = function (url) {
		return _CONF.prefix + url + _CONF.suffix;
	};


	/**
	 * 관리자 기능들
	 */
	$('#logout').on('click', function () {
		swal({
			title: "로그아웃 하시겠습니까 ?",
			type: 'info',
			showCancelButton: true,
			confirmButtonClass: "btn-danger",
			confirmButtonText: "로그아웃",
			cancelButtonText: "아니오",
			closeOnConfirm: false,
			closeOnCancel: true
		}, function (isConfirm) {
			if (isConfirm) {
				doForm({
					url: admin('/login'),
					act: 'logout'
				});
			}
		});
	});

	window.addFooterInfo = function (info) {
		var oldinfo = $('#footer-info').text();
		if (info) {
			$('#footer-info-container').removeClass('d-none');
			if (oldinfo) {
				$('#footer-info').text(oldinfo + '/' + info);
			} else {
				$('#footer-info').text(info);
			}
		}
	};

	var _selectUserModal = '<div class="modal" tabindex="-1">';
	_selectUserModal += '<div class="modal-dialog modal-lg modal-dialog-centered">';
	_selectUserModal += '<div class="modal-content">';
	// _selectUserModal += '<div class="modal-header">';
	// _selectUserModal += '<h5 class="modal-title"><i class="fal fa-user-check"></i> 사용자 조회</h5>';
	// _selectUserModal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	// _selectUserModal += '</div>';
	_selectUserModal += '<div class="modal-body p-0" style="background-color:#939ba1;">';
	_selectUserModal += '<iframe id="selectUserFrame" name="selectUserFrame" src="" class="select-user-frame w-100 border-0" height="730"></iframe>';
	_selectUserModal += '</div>';
	// _selectUserModal += '<div class="modal-footer">';
	// _selectUserModal += '<button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fal fa-times"></i> 닫기</button>';
	// _selectUserModal += '</div>';
	_selectUserModal += '</div>';
	_selectUserModal += '</div>';
	_selectUserModal += '</div>';
	var $selectUserModal = $(_selectUserModal),
		_selectUserUrl = _CONF.prefix + '/selectuser?_nofooter=true',
		initSelectUserModal = false;

	$.fn.selectUser = function (options) {
		if (!initSelectUserModal) {
			initSelectUserModal = true;
			$selectUserModal.appendTo($('body'));

			window.closeSelectUser = function () {
				$selectUserModal.modal('hide');
			};
			$selectUserModal.on('hide.bs.modal', function () {
				$selectUserModal.find('.select-user-frame').prop('src', 'about:blank');
			});
		}

		var defaults = {
			selectUser: $.noop
		};

		var settings = {};
		if (_.isFunction(options)) {
			settings.selectUser = options;
		} else if (_.isObject(options)) {
			settings = $.extend(defaults, options || {});
		}

		return this.each(function () {
			var $this = $(this);
			$this.on('click', function (e) {
				window.selectUser = function (user) {
					settings.selectUser(user);
					$selectUserModal.modal('hide');
				};
				$selectUserModal.find('.select-user-frame').prop('src', _selectUserUrl);
				$selectUserModal.modal();
			});
		});
	};


	var _selectOrganHtml = '<div class="modal" tabindex="-1">';
	_selectOrganHtml += '<div class="modal-dialog modal-lg modal-dialog-centered">';
	_selectOrganHtml += '<div class="modal-content">';
	_selectOrganHtml += '<div class="modal-body p-0" style="background-color:#939ba1;">';
	_selectOrganHtml += '<iframe id="selectOrganFrame" name="selectOrganFrame" src="" class="select-organ-frame w-100 border-0" height="730"></iframe>';
	_selectOrganHtml += '</div>';
	_selectOrganHtml += '</div>';
	_selectOrganHtml += '</div>';
	_selectOrganHtml += '</div>';
	var $selectOrganModal = $(_selectOrganHtml),
		_selectOrganUrl = _CONF.prefix + '/selectorgan?_nofooter=true',
		initSelectOrganModal = false;

	$.fn.selectOrgan = function (options) {
		if (!initSelectOrganModal) {
			initSelectOrganModal = true;
			$selectOrganModal.appendTo($('body'));

			window.closeSelectOrgan = function () {
				$selectOrganModal.modal('hide');
			};
			$selectOrganModal.on('hide.bs.modal', function () {
				$selectOrganModal.find('.select-organ-frame').prop('src', 'about:blank');
			});
		}

		var defaults = {
			selectOrgan: $.noop
		};

		var settings = {};
		if (_.isFunction(options)) {
			settings.selectOrgan = options;
		} else if (_.isObject(options)) {
			settings = $.extend(defaults, options || {});
		}

		return this.each(function () {
			var $this = $(this);
			$this.on('click', function (e) {
				window.selectOrgan = function (organ) {
					settings.selectOrgan(organ);
					$selectOrganModal.modal('hide');
				};
				$selectOrganModal.find('.select-organ-frame').prop('src', _selectOrganUrl);
				$selectOrganModal.modal();
			});
		});
	};

	/* 그룹 아이디로 표시된 텍스트 그룹명으로 변경 */
	let _groupIdWithNames = $('.js-group-id-with-name'), _groupIdToNames = $('.js-group-id-to-name');
	if (_groupIdWithNames.length > 0 || _groupIdToNames.length > 0) {
		$.getJSON('/api/group/mapall', {}, function (data) {
			_groupIdWithNames.each(function () {
				const _this = $(this), _id = _this.text();
				if (_.has(data, _id)) {
					_this.text('[' + data[_id].id + '] ' + data[_id].name);
				}
			});
			_groupIdToNames.each(function () {
				const _this = $(this), _id = _this.text();
				if (_.has(data, _id)) {
					_this.text(data[_id].name);
				}
			});
		});
	}

}(jQuery));