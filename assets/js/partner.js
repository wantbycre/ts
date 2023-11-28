function options(el) {
    return `<option value="${el.UID}">${el.partnerName}</option>`;
}

// 공지사항 리스트
async function GET_PARTNER(page) {
    const res = await http({
        method: "GET",
        url: "partner",
    });

    const { data } = res.data;

    // console.log(data);

    data.forEach((el) => {
        switch (el.ptUID) {
            case 0: // 종합건설
                $("#jhPartner").append(options(el));
                break;
            case 1: // 전문건설
                $("#jmPartner").append(options(el));
                break;
            case 2: // 판재판매처
                $("#pjPartner").append(options(el));
                break;
            case 3: // 조립공장
                $("#jrPartner").append(options(el));
                break;
            case 4: // 설계업체
                $("#sgPartner").append(options(el));
                break;
            case 5: // 코너철판
                $("#cornerPartner").append(options(el));
                break;
            case 6: // 난간대
                $("#ngdPartner").append(options(el));
                break;
            case 7: // 철물업체
                $("#cmPartner").append(options(el));
                break;
            case 8: // DECK업체
                $("#deckPartner").append(options(el));
                break;
            case 9: // 테이블업체
                $("#tablePartner").append(options(el));
                break;
            case 10: // 설치팀
                $("#scPartner").append(options(el));
                break;
            default:
                return;
        }
    });
}

$(function () {
    $("#handleNewProject").click(function () {
        GET_PARTNER();
    });
});
