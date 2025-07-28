'use strict';
(function ($) {
	var postModalHtml = '';
	postModalHtml += '<div id="findzipModal" class="modal" tabindex="-1" role="dialog">';
	postModalHtml += '	<div class="modal-dialog modal-dialog-centered" role="document">';
	postModalHtml += '		<div class="modal-content">';
	postModalHtml += '			<div class="modal-header">';
	postModalHtml += '				<h5 class="modal-title mb-0"><i class="fal fa-search-location"></i> 도로명주소 검색</h5>';
	postModalHtml += '				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	postModalHtml += '			</div>';
	postModalHtml += '			<div id="findzipPluginFrame" class="modal-body p-0" style="height: 500px;"></div>';
	postModalHtml += '		</div>';
	postModalHtml += '	</div>';
	postModalHtml += '</div>';
	var $postModal = null;

	var methods = {
		addr: function (zip, raddr, daddr) {
			var $this = this, $zip = $($this.data('zip')), $road = $($this.data('road')), $addr = $($this.data('addr'));

			$zip.val(zip);
			$road.val(raddr);
			if ( daddr ) $addr.val(daddr);

			if ( !_.isUndefined($this.data('map')) ) {
				var map = $this.data('mapObj'), $lat = $($this.data('lat')), $lng = $($this.data('lng'));

				naver.maps.Service.geocode({
					query: raddr + (daddr ? ' ' + daddr : '')
				}, function (status, response) {
					if ( status === naver.maps.Service.Status.ERROR ) {
						if ( !raddr ) {
							console.error('Geocode Error, Please check address');
							return false;
						}
						console.error('Geocode Error, address:', address);
						return false;
					}
					if ( response.v2.meta.totalCount === 0 ) {
						console.error('No result');
						return false;
					}
					var item = response.v2.addresses[ 0 ], point = new naver.maps.Point(item.x, item.y);
					if ( _.isNull($this.data('markerObj')) ) {
						var marker = new naver.maps.Marker({
							position: point,
							map: map
						});
					} else {
						$this.data('markerObj').setPosition(point);
					}
					$lat.val(point.y);
					$lng.val(point.x);
					map.setCenter(point);
					map.setZoom($this.data('settings').mapZoom);
				});
			}
		}
	};

	$.fn.findzip = function (options) {
		if ( $.type(_) != 'function' ) throw 'require underscore';
		if ( _.isUndefined(window.daum) ) throw 'require DAUM POST';

		if ( methods[ options ] ) {
			return methods[ options ].apply(this, Array.prototype.slice.call(arguments, 1));

		} else {

			var settings = $.extend({
				autoClose: false,
				onselect: $.noop,
				mapZoom: 17,
				map: {
					zoom: 10,
					minZoom: 6,
					scrollWheel: false,
					zoomControl: true,
					scaleControl: false,
					logoControl: false,
					mapDataControl: false,
					center: null, // new naver.maps.LatLng(33.3473833, 126.541663)
					mapTypeControl: true
				}
			}, options || {});

			$(this).data('settings', settings);

			if ( _.isNull($postModal) ) {
				$postModal = $(postModalHtml);
				$postModal.appendTo($('body'));
			}

			function openFindZipModal() {
				var $this = this
						, $zip = $(this.data('zip'))
						, $road = $(this.data('road'))
						, $addr = $(this.data('addr'));
				new daum.Postcode({
					oncomplete: function (data) {
						var addr = data.roadAddress ? data.roadAddress : (data.autoRoadAddress ? data.autoRoadAddress : '');
						var extra = '';
						if ( data.bname !== '' && /[동|로|가]$/g.test(data.bname) ) extra += data.bname;
						if ( data.buildingName !== '' ) extra += (extra !== '' ? ',' + data.buildingName : data.buildingName);
						addr += (extra !== '' ? ' (' + extra + ')' : '');

						$zip.val(data.zonecode);
						$road.val(addr);
						$road.trigger('findzip');
						settings.onselect($this, data, addr);
						$postModal.modal('hide');
						$addr.focus();

						$this.trigger('findzip', [data.zonecode, addr]);

					},
					pleaseReadGuide: 3,
					showMoreHName: true,
					width: '100%',
					height: '100%',
					autoMapping: true,
					maxSuggestItems: 5,
					autoClose: false
				}).embed(document.getElementById('findzipPluginFrame'), {
					autoClose: settings.autoClose
				});
				$postModal.modal();
			}

			var maps = {};

			function initMap() {
				var $map = $(this.data('map'));
				var mapId = $map.attr('id');
				if ( !_.has(maps, mapId) ) {
					var $thisButton = this
							, $lat = $(this.data('lat'))
							, $lng = $(this.data('lng'))
							, $zip = $(this.data('zip'))
							, $road = $(this.data('road'))
							, $addr = $(this.data('addr'));
					if ( _.isNull(settings.map.center) ) settings.map.center = new naver.maps.LatLng(33.3473833, 126.541663);
					var map = new naver.maps.Map(mapId, settings.map);
					$thisButton.data('mapObj', map);
					$thisButton.data('markerObj', null);
					$thisButton.data('mapId', mapId);
					maps[ mapId ] = {map: map, marker: null};
					if ( $lat.val() != '' && $lng.val() != '' ) {
						var center = {lat: parseFloat($lat.val()), lng: parseFloat($lng.val())};
						map.setCenter(center);
						map.setZoom(settings.mapZoom);
						maps[ mapId ].marker = new naver.maps.Marker({
							position: center,
							map: map
						});
						$thisButton.data('markerObj', maps[ mapId ].marker);
					}

					naver.maps.Event.addListener(map, 'click', function (e) {
						if ( _.isNull(maps[ mapId ].marker) ) {
							maps[ mapId ].marker = new naver.maps.Marker({
								position: e.coord,
								map: map
							});
							$thisButton.data('markerObj', maps[ mapId ].marker);
						} else {
							maps[ mapId ].marker.setPosition(e.coord);
						}

						$lat.val(e.coord.lat());
						$lng.val(e.coord.lng());

						$.getJSON('/api/coordtoaddr.jsp', {
							lat: e.coord.lat(),
							lng: e.coord.lng()
						}, function (data) {
							// console.log(data);
							if ( data.status.code === 0 ) {
								var zip = '', area1 = '', area2 = '', raddr = '', building = '', area3 = '', area4 = '';
								_.each(data.results, function (r) {
									switch (r.name) {
										case 'roadaddr':
											if ( _.has(r, 'land') ) {
												raddr = r.land.name + ' ' + r.land.number1;
												if ( r.land.number2 ) raddr += '-' + r.land.number2;
											}
											if ( _.has(r, 'land') && _.has(r.land, 'addition0') && r.land.addition0.value ) {
												building = r.land.addition0.value;
											}
											if ( _.has(r, 'land') && _.has(r.land, 'addition1') && r.land.addition1.value ) {
												zip = r.land.addition1.value;
											}
											break;

										case 'addr':
											if ( _.has(r, 'region') && _.has(r.region, 'area1') && r.region.area1 ) {
												area1 = r.region.area1.name;
											}
											if ( _.has(r, 'region') && _.has(r.region, 'area2') && r.region.area2 ) {
												area2 = r.region.area2.name;
											}
											if ( _.has(r, 'region') && _.has(r.region, 'area3') && r.region.area3 ) {
												area3 = r.region.area3.name;
											}
											if ( _.has(r, 'region') && _.has(r.region, 'area4') && r.region.area4 ) {
												area4 = r.region.area4.name;
											}
											break;
									}
								});

								if ( $zip.length > 0 ) $zip.val(zip);
								if ( $road.length > 0 ) {
									var roadValue = '';
									if ( area1 ) roadValue += area1;
									if ( area2 ) roadValue += ' ' + area2;
									if ( raddr ) {
										roadValue += ' ' + raddr;
										var extras = [];
										if ( building ) extras.push(building);
										if ( area3 ) extras.push(area3);
										if ( extras.length > 0 ) {
											roadValue += ' (' + extras.join(',') + ')';
										}
									} else {
										if ( area3 ) roadValue += ' ' + area3;
										if ( area4 ) roadValue += ' ' + area4;
									}
									$road.val(roadValue);
									$road.trigger('findzip');
								}

								$thisButton.trigger('selectmap', [zip, roadValue]);

							} else {
								console.error(data.status.code, data.status.message);
							}
						});
					});

					this.on('findzip', function (e, zip, address) {
						naver.maps.Service.geocode({
							query: address
						}, function (status, response) {
							if ( status === naver.maps.Service.Status.ERROR ) {
								if ( !address ) {
									console.error('Geocode Error, Please check address');
									return false;
								}
								console.error('Geocode Error, address:', address);
								return false;
							}
							if ( response.v2.meta.totalCount === 0 ) {
								console.error('No result');
								return false;
							}
							var item = response.v2.addresses[ 0 ], point = new naver.maps.Point(item.x, item.y);
							if ( _.isNull(maps[ mapId ].marker) ) {
								maps[ mapId ].marker = new naver.maps.Marker({
									position: point,
									map: map
								});
							} else {
								maps[ mapId ].marker.setPosition(point);
							}
							$lat.val(point.y);
							$lng.val(point.x);
							maps[ mapId ].map.setCenter(point);
							maps[ mapId ].map.setZoom(settings.mapZoom);
						});
					});
				}
			}

			return this.each(function () {
				var $this = $(this), $road = $($(this).data('road'));
				$this.on('click', _.bind(openFindZipModal, $this));
				$road.on('click', _.bind(openFindZipModal, $this));
				if ( !_.isUndefined($(this).data('map')) ) {
					_.bind(initMap, $this)();
				}
			});
		}
	};
}(jQuery));