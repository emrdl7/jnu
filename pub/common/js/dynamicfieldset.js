(function($) {
	$(function() {

		var addValuesSelectTypes = ['CODE', 'ENUM'];
		var addValuesIgnoreTypes = ['SITE', 'CODE_GROUP', 'USER_GROUP', 'USER_GROUPS'];

		var count = 0;

		function onDynamicTypeSelectChange($typeSelect) {
			console.log($typeSelect);
			if ( $typeSelect[ 0 ].tagName == 'SELECT' ) {
				var data = $typeSelect.find('option:selected').data(),
						$valuesContainer = $($typeSelect.data('values-container')),
						$valuesLabel = $($typeSelect.data('values-label')),
						$valuesDesc = $($typeSelect.data('values-desc')),
						$valuesValueContainer = $($typeSelect.data('values-value-container'));
				console.log(data);
				if ( data.needValues ) {
					var $values = false;

					// 기본 입력 input:text 생성
					// console.log($typeSelect.val());

					if ( _.includes(addValuesSelectTypes, $typeSelect.val()) || !_.includes(addValuesIgnoreTypes, $typeSelect.val()) ) {
						if ( _.includes(addValuesSelectTypes, $typeSelect.val()) ) {
							$values = $('<select>', {
								id: $valuesContainer.data('values-name'),
								name: $valuesContainer.data('values-name'),
								class: 'form-control select'
							});
						} else if ( !_.includes(addValuesIgnoreTypes, $typeSelect.val()) ) {
							$values = $('<input>', {
								id: $valuesContainer.data('values-name'),
								type: 'text',
								name: $valuesContainer.data('values-name'),
								class: 'form-control',
								maxlength: 1200
							}).val($valuesContainer.data('values'));
						}
					} else {
						// $valuesContainer.hide();
					}

					// 추가 Validator 설정
					if ( $typeSelect.val() == 'MULTI' ) {
						$values.attr('data-v-type', 'integer');
					}

					// 기존 추가값 입력 엘리먼트 와 혹시 모를 Validator-Error 제거 후 추가값 입력 엘리먼트 추가
					$('#' + $valuesContainer.data('values-name')).remove();
					$valuesValueContainer.find('.parsley-errors-list').remove();
					$valuesValueContainer.prepend($values);
					$valuesContainer.removeClass('hide');

					var valuesValue = $values.closest('.form-group').data('values');

					// 추가값 가능 값 설정
					if ( $typeSelect.val() == 'CODE' ) {
						$.getJSON('/api/code/groups', function (data) {
							_.each(data, function (group) {
								var $opt = $('<option>').val(group.id).text('[' + group.id + '] ' + group.name + ' (' + group.codeCount + ')');
								if ( valuesValue == group.id ) $opt.prop('selected', 'selected');
								$opt.appendTo($values);
							});
						});
					} else if ( $typeSelect.val() == 'ENUM' ) {
						$.getJSON('/api/code/enums', function (data) {
							_.each(data, function (e) {
								// var $opt = $('<option>').val(key).text(key + ' (' + e.list.length + ')');
								var $opt = $('<option>').val(e).text(e);
								if ( valuesValue == e ) $opt.prop('selected', 'selected');
								$opt.appendTo($values);
							});
						});
					}
					/*else if ( $typeSelect.val() == 'FORM_SEQ' ) {
						$.getJSON('/api/forms', function (data) {
							_.each(data, function (f) {
								// var $opt = $('<option>').val(key).text(key + ' (' + e.list.length + ')');
								var $opt = $('<option>').val(f.seq).text('[' + f.seq + '] ' + f.name);
								if ( valuesValue == f.seq ) $opt.prop('selected', 'selected');
								$opt.appendTo($values);
							});
						});
					}*/

					/*else if ( $typeSelect.val() == 'SITE' ) {
						var valuesValue = $values.closest('.form-group').data('values');
						$.getJSON('/api/site', function (data) {
							_.each(data, function (site) {
								var $opt = $('<option>').val(site.id).text('[' + site.id + '] ' + site.name);
								if ( valuesValue == site.id ) $opt.prop('selected', 'selected');
								$opt.appendTo($values);
							});
						});
					}*/

					// 추가값 라벨 및 설명 추가
					if ( data.valuesName ) $valuesLabel.html(data.valuesName);
					if ( data.valuesDesc ) $valuesDesc.show().html(data.valuesDesc);
					else $valuesDesc.hide();
					if ( !$values.val() && data.defaultValues ) $values.val(data.defaultValues);

					// 여러값 입력의 경 tagit 생성 https://github.com/aehlke/tag-it
					if ( ['SELECT', 'RADIO', 'CHECK'].includes($typeSelect.val()) ) {
						$values.addClass('primary').tagit({
							allowSpaces: true,
							singleField: true
						});
					}

					$values.select();
				} else {
					$('#' + $valuesContainer.data('values-name')).val('');
					$valuesContainer.addClass('hide');
				}
			}
		}

		var $dynamicTypeSelects = $('.dynamic-type-select');
		if($dynamicTypeSelects.length > 0) {
			$dynamicTypeSelects.each(function(i, typeSelect){
				var $typeSelect = $(typeSelect);
				if(!$typeSelect.hasClass('init-type-select')) {
					$typeSelect.addClass('init-type-select');

					if($typeSelect.hasClass('select')) {
						$typeSelect.on('changed.bs.select', _.bind(onDynamicTypeSelectChange, null, $typeSelect));
					} else {
						$typeSelect.on('change', _.bind(onDynamicTypeSelectChange, null, $typeSelect));
					}
					onDynamicTypeSelectChange($typeSelect);
				}
			});
		}
	});
}(jQuery));