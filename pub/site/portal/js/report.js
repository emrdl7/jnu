;(function ($) {
	'use strict';

	$(document).on("click", ".js-report-print", function () {
		reportPrint(this);
	});

}(jQuery));

function reportPrint(btn) {
	let report = {};
	$.each(btn.dataset, function(key, value) {
		let convertedKey = key.replace(/-([a-z])/g, function(_, char) {
			return char.toUpperCase();
		});
		report[convertedKey] = value;
	});

	callReport(report);
}

const _globalViewModal = $('#globalViewModal'), _globalViewModalTitle = $('#globalViewModalTitle'), _globalViewModalBody = $('#globalViewModalBody');
function callReport(d) {
	if( !d._sn ){
		alert("출력물에 오류가 발생하였습니다. no sn");
		return;
	}
	d._ts = Date.now();

	$.ajax({
		url		: '/api/report/check.jsp',
		method 	: "post",
		data	: {
			p : btoa(encodeURIComponent(JSON.stringify(d)))
		},
		success: function(res) {
			let p = btoa(encodeURIComponent(JSON.stringify(res)));
			// window.open("/api/report/viewer.jsp?p=" + p, "reportWindow");

			let url = "/api/report/viewer.jsp?p=" + p;
			let param = d['param'] || {};
			param['_out'] = 'body';
			_globalViewModalBody.load(url, param, function (data) {
				let iframe = document.createElement('iframe');
				iframe.src = url;
				iframe.style.width = '100%';
				iframe.style.height = '600px';
				iframe.style.border = 'none';
				_globalViewModalBody.html(iframe.outerHTML);

				if (_globalViewModalBody.find('.alert-message').length > 0 && _globalViewModalBody.find('.alert-message').text()) {
					alert(_globalViewModalBody.find('.alert-message').text());
				} else {
					if (!data.error) {
						_globalViewModal.modal();

						if(d['modalId'])  {
							_globalViewModal.attr('id',d['modalId']);
						}

						if(d['modalClass'])  {
							_globalViewModal.addClass(d['modalClass']);
						}

					}
				}

			});
		},
		error: function(request, status, error) {
			alert("출력처리중 오류가 발생하였습니다." + error);
		}
	});
}


