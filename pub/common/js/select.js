(function ($) {
	$(function () {
		initSelect();
	});

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


}(jQuery));