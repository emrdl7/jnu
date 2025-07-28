(function ($) {
	'use strict';
	$(function () {
		$('select.dynamic-field-site').each(function (i, select) {
			var $select = $(select);
			if (!$select.hasClass('init-dynamic-field-site')) {
				$select.addClass('init-dynamic-field-site');
				$.getJSON('/api/site', function (data) {
					$select.val('');
					_.each(data, function (site) {
						var opt = $('<option>').val(site.id).text(site.name).prop('selected', $select.data('value') == site.id);
						if (site.name != site.title) opt.data('subtext', site.title);
						opt.appendTo($select);
					});
					if ($select.hasClass('init-select')) {
						$select.selectpicker('refresh');
					}
				});
			}
		});

		$('select.dynamic-field-code-group').each(function (i, select) {
			var $select = $(select);
			if (!$select.hasClass('init-dynamic-field-code-group')) {
				$select.addClass('init-dynamic-field-code-group');
				$.getJSON('/api/code/groups', function (data) {
					_.each(data, function (group) {
						var opt = $('<option>').val(group.id).text('[' + group.id + '] ' + group.name).prop('selected', $select.data('value') == group.id);
						if (group.desc) opt.data('subtext', group.desc);
						opt.appendTo($select);
					});
					if ($select.hasClass('init-select')) {
						$select.selectpicker('val', $select.data('value'));
						$select.selectpicker('refresh');
					}
				});
			}
		});

		var $codeGroupValues = $('.dynamic-value-code-group');
		if ($codeGroupValues.length > 0) {
			$.getJSON('/api/code/groupMap', function (data) {
				$codeGroupValues.each(function (i, value) {
					var groupId = $(value).text().trim();
					if (groupId !== '' && _.has(data, groupId)) {
						$(value).text('[' + data[groupId].id + '] ' + data[groupId].name);
					}
				});
			});
		}

		$('select.dynamic-field-provision-group').each(function (i, select) {
			var $select = $(select);
			if (!$select.hasClass('init-dynamic-field-provision-group')) {
				$select.addClass('init-dynamic-field-provision-group');
				$.getJSON(_CONF.prefix + '/cms/provision?_out=json', function (data) {
					_.each(data.provisionGroups, function (group) {
						var opt = $('<option>').val(group.seq).text('[' + group.seq + '] ' + group.name).prop('selected', $select.data('value') == group.seq);
						opt.data('subtext', '약관 ' + group.provisionList.length + '개');
						opt.appendTo($select);
					});
					if ($select.hasClass('init-select')) {
						$select.selectpicker('val', $select.data('value'));
						$select.selectpicker('refresh');
					}
				});
			}
		});

		$('select.dynamic-field-code').each(function (i, select) {
			var $select = $(select);
			if (!$select.hasClass('init-dynamic-field-code')) {
				$select.addClass('init-dynamic-field-code');
				$.getJSON('/api/code/codes/' + $select.data('values'), function (data) {
					_.each(data, function (code) {
						var opt = $('<option>').val(code.code).text('[' + code.code + '] ' + code.value).prop('selected', $select.data('value') == code.code);
						if (code.desc) opt.data('subtext', code.desc);
						// console.log('"' + $select.data('value') + '"', '"' + code.code + '"');
						opt.appendTo($select);
					});
					if ($select.hasClass('init-select')) {
						$select.selectpicker('val', $select.data('value'));
						// $select.selectpicker('refresh');
					}
				});
			}
		});

		/*
		$('.dynamic-value-code').each(function () {
			var $this = $(this);
			if ( $this.text() ) {
				$.getJSON('/api/code/code/' + $this.data('group') + '/' + $this.text(), function (code) {
					$this.text('[' + code.code + '] ' + code.value);
				});
			}
		});


		$('.dynamic-value-enum').each(function () {
			var $this = $(this);
			if ( $this.text() ) {
				$.getJSON('/api/code/enum/' + $this.data('values') + '/' + $this.text(), function (e) {
					$this.text('[' + e.name + '] ' + e.text);
				});
			}
		});
		*/

		$('select.dynamic-field-user-group,select.dynamic-field-user-groups').each(function (i, select) {
			var $select = $(select);
			if (!$select.hasClass('init-dynamic-field-user-group')) {
				$select.addClass('init-dynamic-field-user-group');
				$.getJSON('/api/group/list', function (data) {
					_.each(data, function (group) {
						var opt = $('<option>').val(group.id).text('[' + group.id + '] ' + group.name);
						if ($select.hasClass('dynamic-field-user-groups')) {
							opt.prop('selected', $select.data('value').split(',').includes(group.id));
						} else {
							opt.prop('selected', $select.data('value') == group.id);
						}
						if (group.desc) opt.data('subtext', group.desc);
						opt.appendTo($select);
					});
					if ($select.hasClass('init-select')) {
						$select.selectpicker('refresh');
					}
				});
				if ($select.hasClass('dynamic-field-user-groups')) {
					var $groupsHiddenInput = $($select.data('target').replace(/\./g, '\\.'));
					// console.log($groupsHiddenInput);
					$select.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
						$groupsHiddenInput.val($select.val().join(','));
					});
				}
			}
		});

		$('select.dynamic-field-form-seq').each(function (i, select) {
			var $select = $(select);
			if (!$select.hasClass('init-dynamic-field-form-seq')) {
				$select.addClass('init-dynamic-field-form-seq');

				$.getJSON('/api/forms', function (data) {
					_.each(data, function (f) {
						var opt = $('<option>').val(f.seq).text('[' + f.seq + '] ' + f.name);
						opt.prop('selected', $select.data('value') == f.seq);
						opt.appendTo($select);
					});
					if ($select.hasClass('init-select')) {
						$select.selectpicker('refresh');
					}
				});
			}
		});

		$('select.dynamic-field-datasource').each(function (i, select) {
			var $select = $(select);
			if (!$select.hasClass('init-dynamic-field-datasource')) {
				$select.addClass('init-dynamic-field-datasource');

				$.getJSON('/over-the-sky/portal/datasource', {
					page: 1,
					pageSize: 99999,
					_out: 'json'
				}, function (data) {
					_.each(data.dataSources, function (d) {
						var opt = $('<option>').val(d.seq).text('[' + d.type.text + '] ' + d.name);
						opt.prop('selected', $select.data('value') == d.seq);
						opt.appendTo($select);
					});
					if ($select.hasClass('init-select')) {
						$select.selectpicker('refresh');
					}
				});
			}
		});

		$('select.dynamic-field-apisource').each(function (i, select) {
			var $select = $(select);
			if (!$select.hasClass('init-dynamic-field-apisource')) {
				$select.addClass('init-dynamic-field-apisource');

				$.getJSON('/over-the-sky/portal/apisource', {
					page: 1,
					pageSize: 99999,
					_out: 'json'
				}, function (data) {
					_.each(data.apiList, function (d) {
						var opt = $('<option>').val(d.seq).text(d.name);
						opt.prop('selected', $select.data('value') == d.seq);
						opt.appendTo($select);
					});
					if ($select.hasClass('init-select')) {
						$select.selectpicker('refresh');
					}
				});
			}
		});

		$('select.dynamic-field-jnucontents').each(function (i, select) {
			var $select = $(select);
			if (!$select.hasClass('init-dynamic-field-jnucontents')) {
				$select.addClass('init-dynamic-field-jnucontents');

				$.getJSON('/api/jnu/contents', {
					page: 1,
					pageSize: 99999,
					_out: 'json'
				}, function (data) {
					_.each(data, function (d) {
						var opt = $('<option>').val(d.seq).text(d.title + ' ... ' + d.contents.substring(0, 20));
						opt.prop('selected', $select.data('value') == d.seq);
						opt.appendTo($select);
					});
					if ($select.hasClass('init-select')) {
						$select.selectpicker('refresh');
					}
				});
			}
		});
		
		function editorize($editor) {
			if (!$editor.hasClass('init-dynamic-field-code-editor')) {
				$editor.addClass('init-dynamic-field-code-editor');

				const $editorEl = $('<div>').attr('id', $editor.attr('id') + 'Editor').addClass('ace-editor');
				$editorEl.appendTo($editor.parent());
				const editor = ace.edit($editorEl.attr('id'));
				editor.setOptions({
					maxLines: Infinity
				});
				editor.getSession().setMode("ace/mode/" + $editor.data('lang'));
				editor.getSession().setValue($editor.val());
				$editor.data('editor', editor);

				const $form = $editor.closest('form');
				$form.parsley().on('form:submit', function () {
					$editor.val($editor.data('editor').getSession().getValue());
					return true;
				});
			}
		}

		window.editorize = editorize;

		$('textarea.dynamic-field-code-editor ').each(function (i, editor) {
			var $editor = $(editor);
			editorize($editor);
		});

		var $provisionGroupValues = $('.dynamic-value-provision-group');
		if ($provisionGroupValues.length > 0) {
			$provisionGroupValues.each(function () {
				var $this = $(this);
				$.getJSON('/api/provision/group', {seq: $this.text()}, function (data) {
					$this.text('[' + $this.text() + '] ' + data.name);
				});
			});
		}
		
		
		var $userGroupValues = $('.dynamic-value-user-group'), _userGroups = null;
		if ($userGroupValues.length > 0) {
			
			if(_.isNull(_userGroups)) {
				$.ajax({
					url: '/api/group/mapall',
					dataType: 'json',
					async: false,
					success: function (data) {
						_userGroups = data;
					}
				});
			}
			
			$userGroupValues.each(function () {
				var $this = $(this);
				if(_.has(_userGroups, $this.text())) {
					$this.text( '[' + $this.text() + '] ' + _userGroups[$this.text()].name );
				}
			});
		}
	});
}(jQuery));