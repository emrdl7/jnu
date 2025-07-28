function setModalPage($query) {


    let pageHtml = '';
    pageHtml += '<div class="clearfix"></div>';
    pageHtml += '<div class="paging-container row">';

    if ($query.pages > 0) {
        pageHtml += '<div class="col-12 pagination-container">';
        pageHtml += '<ul class="pagination mb-0 justify-content-center">';

        if($query.page > 1) {
            pageHtml += '<li class="page-item page-arrow mr-1 d-none d-md-block"><a class="page-link" href="javascript:modalPageAct(1)" data-tooltip title="처음으로"><i class="fa fa-angle-double-left icon-angle-double-left"><span>처음</span></i></a></li>';
        } else {
            pageHtml += '<li class="page-item page-arrow mr-1 d-none d-md-block disabled"><a class="page-link" href="javascript:"><i class="fa fa-angle-double-left icon-angle-double-left"><span>처음</span></i></a></li>';
        }

        if($query.page > 1) {
            $p = $query.page - 1;
            pageHtml += '<li class="page-item page-arrow mr-auto mr-md-1"><a class="page-link"   href="javascript:modalPageAct('+$p+')"  data-tooltip title="${p} 페이지"><i class="fa fa-angle-left icon-angle-left"><span>이전</span></i></a></li>';
        } else {
            pageHtml += '<li class="page-item page-arrow mr-auto mr-md-1 disabled"><a class="page-link" href="javascript:"><i class="fa fa-angle-left icon-angle-left"><span>이전</span></i></a></li>';
        }


        pageHtml += '<li class="page-item mr-1 d-block d-md-none pt-2">'+$query.page+' / '+$query.pages+'</li>';


        $.each( $query.pageList, function( key, value ){
            if($query.page == value) {
                pageHtml += '<li class="page-item mr-1 active d-none d-md-block"><span class="page-link">'+value+'</span></li>';
            } else {
                pageHtml += '<li class="page-item mr-1 d-none d-md-block"><a class="page-link"  href="javascript:modalPageAct('+value+')" >'+value+'</a></li>';
            }

        });

        if($query.page < $query.pages) {
            $p = $query.page + 1;
            pageHtml += '<li class="page-item page-arrow ml-auto ml-md-0 mr-0 mr-md-1"><a class="page-link"  href="javascript:modalPageAct('+$p+')"  data-tooltip title="${p} 페이지"><i class="fa fa-angle-right icon-angle-right"><span>다음</span></i></a></li>';
        } else {
            pageHtml += '<li class="page-item page-arrow ml-auto ml-md-0 mr-0 mr-md-1 disabled"><a class="page-link" href="javascript:"><i class="fa fa-angle-right icon-angle-right"><span>다음</span></i></a></li>';
        }


        if($query.page < $query.pages) {
            pageHtml += '<li class="page-item page-arrow d-none d-md-block"><a class="page-link"  href="javascript:modalPageAct('+$query.pages+')" data-tooltip title="마지막으로"><i class="fa fa-angle-double-right icon-angle-double-right"><span>마지막</span></i></a></li>';
        } else {
            pageHtml += '<li class="page-item page-arrow d-none d-md-block disabled"><a class="page-link" href="javascript:"><i class="fa fa-angle-double-right icon-angle-double-right"><span>마지막</span></i></a></li>';
        }


        pageHtml += '</ul>';
        pageHtml += '</div>';



    }
    pageHtml += '</div>';

    return pageHtml;
}