/* eslint-disable */
(function ($) {
	'use strict';
	if ($.type(window['mytinymce']) === 'undefined') {
		var MTM = {};

		MTM.linkCheck = function (editor, url) {
			$.getJSON('/api/linkcheck', {
				url: url
			}, function (data) {
				console.log('link check for', data.url, data.valid);
				if (!data.valid) {
					editor.notificationManager.open({
						text: '입력한 ' + data.url + '는(은) 이용할 수 없는 것 같습니다.', type: 'error', timeout: 5000, closeButton: true
					});
				}
			});
		};

		MTM.imagePicker = function (cb, value, meta) {
			var input = document.createElement('input');
			input.setAttribute('type', 'file');
			input.setAttribute('accept', 'image/*');
			input.onchange = function () {
				var file = this.files[0];
				var reader = new FileReader();
				reader.onload = function () {
					var id = 'blobid' + (new Date()).getTime();
					var blobCache = tinymce.activeEditor.editorUpload.blobCache;
					var base64 = reader.result.split(',')[1];
					var blobInfo = blobCache.create(id, file, base64);
					blobCache.add(blobInfo);
					cb(blobInfo.blobUri(), {
						alt: file.name
					});
				};
				reader.readAsDataURL(file);
			};
			input.click();
		};

		MTM.callback = function (editor) {
			editor.on('ExecCommand', function (e) {
				var content = false;
				if ($.type(e.value) == 'string') {
					content = e.value;
				} else if ($.type(e.value) == 'object') {
					content = e.content;
				}

				if (e.command == 'mceInsertLink' && e.value.href) {
					// linkCheck(editor, e.value.href);
				} else if (e.command == 'mceInsertContent' && content) {
					var $as = $(content).find('a');
					if ($as.length == 0 && content.startsWith('<') && $(content)[0].tagName == 'A') $as = $(content);
					if ($as.length > 0) {
						$as.each(function (i, el) {
							// var href = $(el).attr('href');
							// console.log('find href', href, $(el));
							// if(href) linkCheck(editor, href);
						});
					}
				}
			});
		};

		MTM.pluginToolbars = {
			full: {
				// plugins: 'advlist autolink autoresize link image imagetools lists charmap anchor pagebreak spellchecker searchreplace visualblocks visualchars code ace media '
				// 		+ ' nonbreaking table contextmenu directionality template paste textcolor ace_beautify table preview fullscreen fontawesome',
				plugins: 'advlist autolink autoresize link image lists charmap anchor pagebreak searchreplace visualblocks visualchars code media '
					+ ' nonbreaking table directionality template table preview fullscreen',
				toolbar: [
					'undo redo | forecolor backcolor | bold italic underline strikethrough hr | alignleft aligncenter alignright alignjustify | charmap | paste pastetext | link unlink image media'
					// , 'formatselect styleselect removeformat | table bullist numlist outdent indent | link unlink image media fontawesome | visualblocks preview ace fullscreen'
					, 'fontfamily fontsize blocks removeformat | table bullist numlist outdent indent | visualblocks  preview code fullscreen'
				]
			},
			emp: {
				plugins: 'advlist autolink autoresize link image lists charmap hr searchreplace table directionality table code',
				toolbar: ['fontfamily fontsize blocks | bold italic underline strikethrough superscript | forecolor backcolor | alignleft aligncenter alignright | table bullist numlist outdent indent | link unlink image | code']
			},
			simple: {
				plugins: 'advlist autolink autoresize link image lists charmap hr searchreplace table directionality table code',
				toolbar: ['blocks | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright | table bullist numlist outdent indent | link unlink image']
			},
			user: {
				plugins: 'advlist autolink autoresize link image lists charmap hr searchreplace table directionality table',
				toolbar: ['blocks | bold italic underline strikethrough superscript | forecolor backcolor | alignleft aligncenter alignright | table bullist numlist outdent indent | link unlink image']
			}
		};

		var _defaults = {
			branding: false,
			apply_source_formatting: true,
			autoresize_bottom_margin: 5,
			min_height: 250,
			max_height: 800,
			content_css: ['https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css', '/pub/plugin/fa/css/all.min.css'],
			keep_styles: false,
			block_formats: '문단 (P)=p;제목1 (H3)=h3;제목2 (h4)=h4;제목3 (H5)=h5;영역 (DIV)=div;고정 (PRE)=pre', //;Heading 4=h4;Heading 5=h5;Heading 6=h6;Preformatted=pre'
			external_plugins: {},
			style_formats: [
				{title: '텍스트 박스 (기본)', block: 'div', classes: 'alert alert-primary'}
				, {title: '텍스트 박스 (정보)', block: 'div', classes: 'alert alert-info'}
				, {title: '텍스트 박스 (경고)', block: 'div', classes: 'alert alert-danger'}
				, {title: '텍스트 박스 (메시지)', block: 'div', classes: 'alert alert-secondary'}
				, {title: 'Badge (정보)', inline: 'span', classes: 'badge badge-info'}
				, {title: 'Bold text', inline: 'b'}
				, {title: '링크 버튼 (기본)', inline: 'a', classes: 'btn btn-primary'}
				, {title: '버튼 (기본)', inline: 'button', attributes: {type: 'button'}, classes: 'btn btn-primary'}
				, {title: '링크 버튼 (정보)', inline: 'a', classes: 'btn btn-info'}
				, {title: '버튼 (정보)', inline: 'button', attributes: {type: 'button'}, classes: 'btn btn-info'}
				, {title: '링크 버튼 (주의)', inline: 'a', classes: 'btn btn-warning'}
				, {title: '버튼 (주의)', inline: 'button', attributes: {type: 'button'}, classes: 'btn btn-warning'}
				, {title: '링크 버튼 (성공)', inline: 'a', classes: 'btn btn-success'}
				, {title: '버튼 (성공)', inline: 'button', attributes: {type: 'button'}, classes: 'btn btn-success'}
				//, {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}}
				//, {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}}
				//, {title: 'Example 1', inline: 'span', classes: 'example1'}
				//, {title: 'Example 2', inline: 'span', classes: 'example2'}
				//, {title: 'Table styles'}
				//, {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'
			],
			menubar: false,
			init_instance_callback: MTM.callback,
			images_upload_url: '/api/upload/editor',
			file_picker_types: 'image',
			file_picker_callback: MTM.imagePicker,
			relative_urls: false,
			remove_script_host: true,
			convert_urls: true,
			language: 'ko_KR',
			table_default_attributes: {
				class: 'table'
			},
			table_default_styles: {},
			table_sizing_mode: 'auto',
			table_class_list: [
				{title: '없음', value: ''}
				, {title: '일반 목록', value: 'table table-list'}
				, {title: '일반 목록 (오버)', value: 'table table-list table-hover'}
				, {title: '컴팩트', value: 'table table-condensed'}
			],
			table_row_class_list: [
				{title: '없음', value: ''}
				, {title: 'Info', value: 'table-info'}
				, {title: 'Danger', value: 'table-danger'}
				, {title: 'Warning', value: 'table-warning'}
				, {title: 'Primary', value: 'table-primary'}
				, {title: 'Dark', value: 'table-dark'}
				, {title: 'Success', value: 'table-success'}
			],
			// charmap: [
			// 	[0x2615, 'morning coffee']
			// ],
			charmap_append: [
				[0x2600, 'sun']
				, [0x2601, 'cloud']
				, [8224, 'Dagger']
				, [8230, 'Horizontal Ellipsis']
				, [8539, '1/8 Fraction']
				, [8730, 'Square Root']
				, [8818, 'Less than or equivalent to']
				, [8819, 'Greater than or equivalent to']
				, [963, 'Sigma']
				, [956, 'Mu']
				, [8251, '당구장']
			],
			templates: [
				{title: '2단 편집', description: '2단 영역을 추가 (휴대폰에서는 1단으로 변경)', url: '/tool/templates/2-col.html'}
				//, {title: 'Some title 2', description: 'Some desc 2', url: 'development.html'}
			],
			extended_valid_elements: 'i[class]',
			contextmenu_never_use_native: true
		};

		function makeTinymceOption(selector, defaultOption, addOptions) {
			var option = $.extend(_.clone(_defaults), defaultOption, addOptions || {});
			option.plugins = MTM.pluginToolbars[option.toolbar_name].plugins;
			option.toolbar = MTM.pluginToolbars[option.toolbar_name].toolbar;
			if (_.has(option, 'add_plugin')) option.plugins += ' ' + option.add_plugin;
			if (_.has(option, 'add_toolbar')) option.toolbar.push(option.add_toolbar);
			option.selector = selector;
			return option;
		}

		MTM.defaultOption = function (selector, myoptions) {
			var opt = makeTinymceOption(selector, {
				toolbar_name: 'full',
				setup: function (ed) {
					ed.on('init', function (args) {
						var iframe = $("#" + args.target.id + "_ifr");
						$(iframe[0].contentWindow.document).children('html').children('head').append('<script src="https://kit.fontawesome.com/966ae9d4e6.js" crossorigin="anonymous"></script>');
					});
				}
			}, myoptions);
			return opt;
		};

		MTM.userOption = function (selector, myoptions) {
			return makeTinymceOption(selector, {
				toolbar_name: 'user'
			}, myoptions);
		};

		window.mytinymce = MTM;
	}
}(jQuery));