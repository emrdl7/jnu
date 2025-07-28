(function() {
	'use strict';
	
	window.submitConfigForm = function(form, makeValue) {
		if(!form.hasClass('init-ajax-callback')) {
			form.addClass('init-ajax-callback');
			form.on('ajax-error', function(_e, _u, type, msg) {
				swal(type, msg.message, 'error');
			});
			form.on('ajax-success', function(_e, data) {
				if(data.error) {
					swal('확인', data.errorMsg, 'error');
				}
			});
		}

		if(_.isUndefined(makeValue) || _.isNull(makeValue)) {
			makeValue = function(json) {
				return JSON.stringify(json);
			};
		}

		if(form.parsley().isValid()) {
			const json =  _.omit(form.serializeObject(), ['act', '_out', 'inst', 'room', 'key', 'jsonValue', 'collect', 'brSeq']);
			form.find('input[name="jsonValue"]').val(makeValue(json));
			form.submit();
			alert("저장되었습니다.");
		}
	};

	$(document).on('click', '.js-policy-del-ok', function ( e ) {
		console.log($(this).closest("form").attr('id'));
		const form = $("#"+$(this).closest("form").attr('id'));
		form.find('input[name="act"]').val("delConfig");
		form.submit();
		alert("삭제되었습니다.");
		location.reload();
	});

}(jQuery));