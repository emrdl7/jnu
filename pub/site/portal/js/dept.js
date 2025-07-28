(function ($) {
    'use strict';

    $(".dept-select").change(function () {
        let targetId = $(this).data('change');
        let selectId = $(this).attr('id');

        getCodeList(targetId, selectId, "").then(() => {
            $("#" + targetId).trigger("change");
        });
    });

}(jQuery));

function selectCode(ognzclsfse, univCd, ssjCd, mjrCd) {
    console.log(ognzclsfse);
    if(ognzclsfse) {
        setCodeList(ognzclsfse, univCd, ssjCd, mjrCd)
    } else {
        getCodeList("ognzclsfse");
    }
}

function getCodeList(targetId, selectId, selectVal) {
    let upDeptCd;
    let orgnClsfCd = $("#ognzclsfse").val();

    if(selectId != '') upDeptCd = $("#"+selectId).val();

    return $.ajax({
        url: '/api/code/list.jsp',
        dataType: 'json',
        data: {
            type: targetId,
            orgnClsfCd: orgnClsfCd,
            upDeptCd: upDeptCd
        },
        success: function (data) {
            let addHtml = targetId === 'mjrCd' ? "<option value=''>전체</option>" : "";

            $.each(data.codeList, function (key, value) {
                addHtml += "<option value='"+value.cd+"'>"+value.cdNm+"</option>";
            });

            $("#" + targetId).html(addHtml);

            if (selectVal) {
                $("#" + targetId).val(selectVal);
            }
        }
    });
}

function setCodeList(ognzclsfse, univCd, ssjCd, mjrCd) {
    getCodeList("ognzclsfse", "", ognzclsfse)
        .then(() => ognzclsfse ? getCodeList("univCd", "ognzclsfse", univCd) : Promise.resolve())
        .then(() => univCd ? getCodeList("ssjCd", "univCd", ssjCd) : Promise.resolve())
        .then(() => ssjCd ? getCodeList("mjrCd", "ssjCd", mjrCd) : Promise.resolve());
}

function getUserCodeList() {
    return $.ajax({
        url: '/api/code/list.jsp',
        dataType: 'json',
        data: {
            type: "userInfo",
        },
        success: function (data) {
            $('#ognzclsfse').append(new Option(data.userInfo.onzClsfSe.cdNm, data.userInfo.onzClsfSe.cd));
            $('#univCd').append(new Option(data.userInfo.univCd.cdNm, data.userInfo.univCd.cd));
            $('#ssjCd').append(new Option(data.userInfo.ssjCd.cdNm, data.userInfo.ssjCd.cd));
            if(data.userInfo.mjrCd != undefined) $('#mjrCd').append(new Option(data.userInfo.mjrCd.cdNm, data.userInfo.mjrCd.cd));
        }
    });
}