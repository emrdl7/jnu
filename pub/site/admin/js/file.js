(function ($) {
	"use strict";

	$(function () {
		const $tree = $('#dirTree'), _URI = new URI();
		const birdFolderNames = ['가마우지', '갈매기', '개개비', '거위', '고니', '곤줄박이', '기러기', '까마귀', '까치', '꼬리치레', '꾀꼬리', '꿩', '나무발발이', '논병아리', '느시', '닭', '독수리', '동고비', '두견', '두루미', '따오기', '딱따구리', '뜸부기', '마도요', '말똥가리', '매', '메추라기', '밀화부리', '발구지', '병아리', '부엉이', '비둘기', '뻐꾸기', '새홀리기', '솔개', '아비', '양진이', '어치', '오리', '오목눈이', '올빼미', '왜가리', '원앙', '제비', '조롱이', '종다리', '지빠귀', '직박구리', '찌르레기', '할미새사촌', '해오라기'];
		const $selectedDirectory = $('#selectedDirectory'), $filesTable = $('#filesTable');
		const $folderDescModal = $('#folderDescModal'), $folderDescValue = $('#folderDescValue'), $folderDescButton = $('#folderDescButton');
		const $fileViewModal = $('#fileViewModal'), $fileViewName = $('#fileViewName'), $fileViewBody = $('#fileViewBody');
		const $uploadFileButton = $('#uploadFileButton'), $uploadModal = $('#uploadModal'), $newFileButton = $('#newFileButton'), $newFileMenus = $('#newFileMenus');
		const $fileRenameModal = $('#fileRenameModal'), $fileRenameFile = $('#fileRenameFile'), $fileRenameRename = $('#fileRenameRename'), $fileRenameExt = $('#fileRenameExt'), $fileRenameSubmit = $('#fileRenameSubmit');
		const $logsModal = $('#logsModal'), $logsBody = $('#logsBody');
		const aceModes = {
			'vm': 'velocity',
			'htm': 'velocity',
			'js': 'javascript',
			'tag': 'jsp'
		}, imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
		let _current_node = null, _selected_node = null, _selected_root_node = null;

		$folderDescModal.on('shown.bs.modal', function () {
			$folderDescValue.select();
		});
		$fileRenameModal.on('shown.bs.modal', function () {
			$fileRenameRename.select();
		});
		$uploadFileButton.on('click', function () {
			let accepts = [];
			_.each(_selected_root_node.original.exts, (ext) => {
				accepts.push('.' + ext);
			});
			$('#uploadFileDir').val(_selected_node.id);
			$uploadModal.find('input[type=file]').prop('accept', accepts.join(','));
			$uploadModal.modal();
		});

		$filesTable.hide();

		function nodeText(node) {
			let text = '<strong class="f-s-16 text-black">' + (node.name || node.text) + '</strong>';
			if (node.desc) text += ' <span class="text-muted ml-2 f-s-14">' + node.desc + '</span>';
			return text;
		}

		function makeNode(dir) {
			const node = {
				id: dir.directory,
				name: dir.name,
				type: 'FOLDER',
				parent: dir.parent,
				children: dir.children,
				desc: dir.desc,
				exts: dir.exts
			};
			node.text = nodeText(node);
			return node;
		}

		function dir(dir, name) {
			if (dir == '/') return '/' + name;
			return dir + '/' + name;
		}

		$tree.jstree({
			plugins: ['contextmenu', 'types', 'json_data'], // 'wholerow', 'state'
			types: {
				'#': {
					max_depth: 8
				},
				'FOLDER': {
					icon: 'fal fa-folder'
				}
			},
			core: {
				multiple: false,
				dblclick_toggle: true,
				themes: {
					name: 'proton',
					responsive: true
				},
				check_callback: function (op, node, parent, pos, more) {
					let allowOperation = true;
					switch (op) {
						case 'create_node':
							_.each(parent.children, function (cnodeId) {
								if (node.id === cnodeId) allowOperation = false;
							});
							break;
					}
					return allowOperation;
				},
				data: {
					dataType: 'json',
					url: function (node) {
						if (node.id === '#') {
							return _URI.clone().setSearch({act: 'dirs', _out: 'json'}).href();
						} else {
							return _URI.clone().setSearch({act: 'dirs', _out: 'json', dir: node.id}).href();
						}
					},
					data: function (node) {
					},
					dataFilter: function (data, b) {
						data = JSON.parse(data);
						let dirs = [];
						_.each(data.dirs, function (dir) {
							dirs.push(makeNode(dir));
						});
						return JSON.stringify(dirs);
					}
				} // data
			}, // core
			contextmenu: {
				select_node: false,
				items: function (node) {
					let menus = {};
					const tree = $tree.jstree(true);
					const root_max_depth = tree.get_rules('#').max_depth;
					const current_level = (tree.get_path(node, '^').match(/\^/g) || []).length;

					_current_node = node;

					menus.create = {
						label: '새 폴더',
						title: '"' + node.original.name + '" 에 새 폴더를 추가 합니다.',
						action: function (data) {
							bootbox.prompt({
								title: '새 폴더 이름을 입력하세요.',
								value: _.sample(birdFolderNames),
								required: true,
								centerVertical: true,
								callback: function (new_bird_name) {
									if (new_bird_name) {
										tree.create_node(node, makeNode({
											id: node.id + '/' + new_bird_name,
											directory: node.id + '/' + new_bird_name,
											name: new_bird_name,
											parent: node.id,
											children: false,
											desc: null
										}), 'last', function (new_node) {
											$.getJSON(_URI.path(), {
												act: 'createDirectory',
												dir: new_node.id,
												_out: 'json'
											}, function (data) {
												if (data.error) {
													showError(data.errorMsg);
												}
											});
										}, true);
									}
								},
								onShow: function (e) {
									$(e.currentTarget).find('input.bootbox-input').select();
								}
							});
						},
						_disabled: !node.state.loaded || current_level >= root_max_depth || !node.original.subfolder,
						icon: 'fas fa-plus'
					};

					menus.refresh = {
						label: '새로고침',
						title: '선택한 폴더를 새로고침합니다.',
						action: function (data) {
							tree.refresh_node(node);
						},
						_disabled: node.id == '/',
						icon: 'fal fa-sync'
					};

					menus.rename = {
						label: '폴더명 변경',
						title: '선택한 폴더의 이름을 변경합니다.',
						action: function (data) {
							tree.edit(node, node.original.name, function (renamedNode, success) {
								// console.log(success, renamedNode);

								if (success && node.original.name != renamedNode.text) {
									$.post(_URI.path(), {
										act: 'renameDirectory',
										dir: renamedNode.id,
										_out: 'json',
										newname: renamedNode.text
									}, function (data, stat, xhr) {
										if (!data.error) {
											renamedNode.original.name = renamedNode.text;
											renamedNode.original.id = renamedNode.parent + '/' + renamedNode.text;
											tree.set_id(renamedNode, renamedNode.parent + '/' + renamedNode.text);
											tree.rename_node(renamedNode, nodeText(renamedNode.original));
										}
									}, 'json');
								} else {
									tree.rename_node(node, nodeText(node.original));
								}
							});
						},
						separator_before: true,
						_disabled: current_level == 0,
						icon: 'fal fa-edit'
					};

					menus.desc = {
						label: node.original.desc ? '설명 변경' : '설명 추가',
						title: '선택한 폴더의 설명을 추가하거나 변경합니다.',
						action: function (data) {
							$folderDescValue.val(node.original.desc ? node.original.desc : '');
							$folderDescModal.modal();
						},
						_disabled: current_level == 0,
						icon: 'fal fa-comment'
					};

					menus.del = {
						label: '삭제',
						titel: "선택한 폴더를 삭제합니다.",
						action: function (data) {
							let confirmMessage = '폴더를 삭제하면 포함된 폴더/파일 모두삭제 되며, <strong>복구할 수 없습니다.</strong><br>';
							confirmMessage += '선택한 폴더 "<strong class="text-danger">' + node.original.name + '</strong>" 을(를) 삭제하시겠습니까 ?'

							bootbox.confirm({
								title: '폴더 삭제',
								message: confirmMessage,
								centerVertical: true,
								callback: function (ok) {
									if (ok) {
										$.post(_URI.path(), {
											act: 'deleteDirectory',
											dir: node.id,
											_out: 'json'
										}, function (data, stat, xhr) {
											if (!data.error) {
												tree.delete_node(node);
											}
										}, 'json');
									}
								}
							});
						},
						_disabled: current_level == 0,
						icon: 'fas fa-trash'
					};
					return menus;
				} // items
			} // contextmenu
		}); // jstree


		let _dataTable = null;

		function destroyFilesTable() {
			if (!_.isNull(_dataTable)) {
				_dataTable.destroy();
				_dataTable = null;
			}
		}

		function loadFiles(node) {
			// let path = node.instance.get_path(node,)
			// console.log(node);
			$.getJSON(_URI.path(), {
				act: 'files',
				_out: 'json',
				dir: node.id
			}, function (data) {
				/*console.log(data);
				console.log(_selected_root_node.original.exts);*/

				destroyFilesTable();

				$fileRenameModal.modal('hide');
				$uploadModal.modal('hide');
				$logsModal.modal('hide');

				$newFileMenus.empty();
				_.each(_selected_root_node.original.exts, function (ext) {
					if (!_.includes(imageExtensions, ext)) {
						$('<a href="#" />').addClass('dropdown-item js-new-file').data({ext: ext, file: node.id}).text(ext).appendTo($newFileMenus);
					}
				});
				$newFileButton.prop('disabled', false);
				$uploadFileButton.prop('disabled', false);

				$selectedDirectory.text(node.id).removeClass('text-muted').addClass('text-black');
				$filesTable.show();
				_dataTable = $filesTable.DataTable({
					info: false,
					paging: false,
					searching: false,
					autoWidth: false,
					responsive: true,
					order: [[0, 'asc']],
					pageLength: 9007199254740991,
					columns: [
						/*{
							data: null,
							width: 30,
							order: false,
							className: 'text-center',
							render: function (data, type, row) {
								return '<input type="checkbox" class="file-check form-checkbox-input" value="' + data.dir + '/' + data.name + '" />';
							}
						},*/
						{data: "name", className: 'font-weight-bold'},
						{
							data: null, className: 'text-right', width: 80, render: function (data, type, row) {
								return '<span data-tooltip="' + data.size.format() + '">' + data.readableSize + '</span>';
							}
						},
						{
							data: "createDate", width: 100, className: 'text-center', render: function (data, type, row) {
								return '<span class="" data-tooltip="' + data + '">' + data.substring(0, 10) + '</span>';
							}
						},
						{
							data: "updateDate", width: 100, className: 'text-center', render: function (data, type, row) {
								return '<span class="" data-tooltip="' + data + '">' + data.substring(0, 10) + '</span>';
							}
						},
						{
							data: null,
							width: 160,
							className: 'text-center with-btn-group',
							render: function (data, type, row) {
								// console.log(data);
								let html = '<div class="btn-group">';
								html += '<button type="button" class="btn btn-xs btn-primary js-file-view" data-tooltip="조회"><i class="fal fa-search"></i></button>';
								if (
									(data.dir.startsWith('/tool') && data.ext == 'jsp')
									|| (data.dir == '/' && (data.ext == 'jsp' || data.ext == 'html' || data.ext == 'htm'))
									|| (data.dir.startsWith('/api') && data.ext == 'jsp')
									|| (data.dir.startsWith('/pub') && (data.ext == 'html' || data.ext == 'htm'))
								) {
									html += '<a href="' + dir(data.dir, data.name) + '" target="_blank" class="btn btn-xs btn-black" data-tooltip="실행"><i class="fal fa-play"></i></a>';
								} else {
									html += '<a href="#" class="btn btn-xs btn-black disabled" disabled><i class="fal fa-play"></i></a>';
								}
								if (data.edits && data.edits.length > 0) {
									html += '<button type="button" class="btn btn-xs btn-success js-file-logs" data-tooltip="편집 이력"><i class="fal fa-list"></i></button>';
								} else {
									html += '<button type="button" class="btn btn-xs btn-success disabled" disabled><i class="fal fa-list"></i></button>';
								}
								html += '</div><div class="btn-group ml-2">';

								if (data.editable) {
									html += '<button type="button" class="btn btn-xs btn-info js-file-edit" data-tooltip="편집"><i class="fal fa-pencil"></i></button>';
								} else {
									html += '<button type="button" class="btn btn-xs btn-info" disabled><i class="fal fa-pencil"></i></button>';
								}

								html += '<button type="button" class="btn btn-xs btn-warning js-file-rename" data-tooltip="이름변경"><i class="fal fa-tag"></i></button>';
								html += '<button type="button" class="btn btn-xs btn-danger js-file-del" data-tooltip="삭제" data-name="' + data.name + '"><i class="fal fa-trash"></i></button>';
								html += '</div>';
								return html;
							}
						},
					],
					createdRow: function (row, data, dataIndex) {
						$(row).data(data);
					},
					data: data.files
				});

				initTooltipPopover();

				$('.js-new-file').on('click', function () {
					awin({
						act: 'add',
						file: $(this).data('file'),
						ext: $(this).data('ext')
					});
				});

				$('.js-file-view').on('click', function () {
					const data = $(this).closest('tr').data();
					$fileViewName.text(data.name);
					$fileViewBody.empty();
					const viewUrl = _URI.path() + '?act=view&file=' + dir(data.dir, data.name);
					if (data.image) {
						$('<img />').prop('src', viewUrl).addClass('img-fluid').appendTo($fileViewBody);
					} else {
						$.get(viewUrl, function (source) {
							$('<div id="aceView" class="ace-editor" />').appendTo($fileViewBody);
							let editor = ace.edit('aceView');
							let aceMode = _.has(aceModes, data.ext) ? aceModes[data.ext] : data.ext;
							editor.getSession().setMode('ace/mode/' + aceMode);
							editor.getSession().setValue(source);
							editor.setReadOnly(true);
						});
					}
					$fileViewModal.modal();
				});

				$('.js-file-edit').on('click', function () {
					const data = $(this).closest('tr').data();
					awin({
						act: 'edit',
						file: dir(data.dir, data.name),
						ext: data.ext
					});
				});

				$('.js-file-rename').on('click', function () {
					const data = $(this).closest('tr').data();
					const lastDotIndex = data.name.lastIndexOf('.');

					/*console.log('file', data.dir + data.name);
					console.log('name', data.name.substring(0, lastDotIndex));
					console.log('ext', data.name.substring(lastDotIndex + 1));*/

					$fileRenameFile.val(dir(data.dir, data.name));
					$fileRenameRename.val(data.name.substring(0, lastDotIndex));
					$fileRenameExt.text('.' + data.name.substring(lastDotIndex + 1));
					$fileRenameModal.modal();
				});

				$('.js-file-del').on('click', function () {
					const data = $(this).closest('tr').data();
					const file = $(this).data();

					bootbox.confirm({
						title: '파일 삭제',
						message: '해당 파일' + file.name + ' 을(를) 삭제하시겠습니까 ?',
						centerVertical: true,
						callback: function (ok) {
							if (ok) {
								$.post(_URI.path(), {
									act: 'delFile',
									file: dir(data.dir, data.name),
									_out: 'json'
								}, function (data, stat, xhr) {
									if (!data.error) {
										reloadCurrentDirectory();
									}
								}, 'json');
							}
						}
					});
				});

				$('.js-file-logs').on('click', function () {
					const data = $(this).closest('tr').data();
					$logsBody.empty();
					let version = data.edits.length;
					_.each(data.edits, (e) => {
						let tr = $('<tr/>');
						$('<td />').text(version--).appendTo(tr);
						$('<td />').text(e.editor).appendTo(tr);
						$('<td />').text(e.createDate).appendTo(tr);
						$('<td />').text(e.readableSize).appendTo(tr);
						let func = $('<td />');

						$('<button type="button" class="btn btn-xs btn-info js-diff"><i class="fal fa-search"></i> 비교</button>').appendTo(func).on('click', function () {
							const file = $(this).closest('tr').data('file');
							awin({
								act: 'diff',
								dir: data.dir,
								leftFile: file.name,
								rightFile: data.name,
								width: 1600,
								height: 900
							})
						});

						$('<button type="button" class="btn btn-xs btn-danger ml-2 js-restore"><i class="fal fa-undo"></i> 복원</button>').appendTo(func).on('click', function () {
							const file = $(this).closest('tr').data('file');
							bootbox.confirm({
								title: '확인',
								message: '해당 파일로 복원하시겠습니까 ?',
								callback: function (ok) {
									if (ok) {
										doForm({
											act: 'restore',
											dir: data.dir,
											file: data.name,
											to: file.name
										});
									}
								}
							})
						});

						func.appendTo(tr);
						tr.data('file', e);
						tr.appendTo($logsBody);
					});
					$logsModal.modal();
				});
			});
		}

		function doChangeFolderDesc() {
			if (!_.isNull(_current_node)) {
				$.post(_URI.path(), {
					act: 'descDirectory',
					dir: _current_node.id,
					desc: $folderDescValue.val(),
					_out: 'json'
				}, function (data, stat, xhr) {
					if (!data.error) {
						_current_node.original.desc = $folderDescValue.val();
						$tree.jstree(true).rename_node(_current_node, nodeText(_current_node.original));
					}
					$folderDescModal.modal('hide');
				}, 'json');
			}
		}

		$folderDescButton.on('click', doChangeFolderDesc);
		$folderDescValue.on('keypress', function (e) {
			if (e.key == 'Enter') {
				doChangeFolderDesc();
			}
		});

		$tree.on('select_node.jstree', function (e, select) {
			let path = select.instance.get_path(select.node, null, true);
			_selected_root_node = $tree.jstree(true).get_node(path[0]);
			_selected_node = select.node;
			if (_selected_node.id != '#') {
				loadFiles(_selected_node);
			}
		});

		$tree.on('deselect_all.jstree deselect_node.jstree', function () {
			_current_node = null;
			destroyFilesTable();
		});

		window.reloadCurrentDirectory = function () {
			loadFiles(_selected_node);
		};
	});
}(jQuery));