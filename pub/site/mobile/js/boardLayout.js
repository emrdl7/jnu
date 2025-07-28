;(function ($) {
    //DOM에서 이미지 로딩 완료 후 실행
    $(window).on('load', function() {
        initPinchZoom();
    });
}(jQuery));

function initPinchZoom() {
    if($('div.board-view div.view-content').length) {
        loadPinchZoom();
    } else {
        //ajax와 같이 view-content 생성이 늦는 경우 실행
        if($('.board-view:first').length) {
            let element = $('.board-view:first');
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (addedNode) {
                        if (addedNode.classList && addedNode.classList.contains('view-content')) {
                            imagesLoaded(addedNode, loadPinchZoom);
                            observer.disconnect();
                        }
                    });
                });
            });
            observer.observe(element[0], {childList: true, subtree: true});
        }
    }

}

//PicnhZoom 설정
function loadPinchZoom(){
    if(!$('div.pinch-zoom-container div.pinch-zoom').length) {
        $('div.board-view div.view-content').wrap('<div class="pinch-zoom-container"><div class="pinch-zoom"></div></div>');
    }

    if($('div.pinch-zoom-container div.pinch-zoom').length) {
        console.log(1111);
        let el = document.querySelector('div.pinch-zoom');
        let imgHeigth = el.offsetHeight;
        $('div.pinch-zoom').closest('.pinch-zoom-container').height(imgHeigth);

        loadScript('/pub/plugin/pinchzoom/pinch-zoom.umd.js').then(function (script) {
            new PinchZoom.default(el, {
                draggableUnzoomed: false,
                zoomOutFactor: 1,
                minZoom: 1
            });
        });
    }
}

//이미지 전부 로드되었는지 확인
function imagesLoaded(parentNode, callback) {
    var images = parentNode.querySelectorAll('img');
    var loadedCount = 0;

    function imageLoaded() {
        loadedCount++;
        if (loadedCount === images.length) {
            console.log(loadedCount);
            callback();
        }
    }

    images.forEach(function (image) {
        if (image.complete) {
            imageLoaded();
        } else {
            image.addEventListener('load', imageLoaded);
        }
    });
}