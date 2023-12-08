// 유저정보 상세
async function GET_MY_USER_DETAIL(UID) {
    const res = await http({
        method: "GET",
        url: "user/" + UID,
    });
    return res.data;
}

$(function () {
    // 로그아웃
    $("#handleLogout").click(function () {
        sessionStorage.removeItem("level");
        sessionStorage.removeItem("partnerUID");
        sessionStorage.removeItem("ptKey");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userUID");
        sessionStorage.removeItem("href");

        location.href = "/login.html";
    });

    let sessionLevel = sessionStorage.getItem("level");
    let sessionPartnerUID = sessionStorage.getItem("partnerUID");
    let sessionPtKey = sessionStorage.getItem("ptKey");
    let sessionToken = sessionStorage.getItem("token");
    let sessionUserUID = sessionStorage.getItem("userUID");

    const path = $(location).attr("pathname");

    console.log(
        "sessionLevel:",
        sessionLevel,
        "sessionPartnerUID:",
        sessionPartnerUID,
        "sessionPtKey:",
        sessionPtKey,
        "sessionToken:",
        sessionToken ? "true" : "false",
        "sessionUserUID:",
        sessionUserUID
    );
    // console.log(path);

    switch (path) {
        case "/":
        case "/index.html":
        case "/index-gj-corner.html":
        case "/index-gj-deck.html":
        case "/index-gj-jr.html":
        case "/index-gpj.html":
        case "/index-gsd.html":
        case "/index-master.html":
        case "/index-sc-team.html":
        case "/index-sg-corner.html":
        case "/index-sgd.html":
            $("#nav-list > li").eq(1).addClass("active");
            break;
        case "/dashboard.html":
            $("#nav-list > li").eq(2).addClass("active");
            break;
        case "/account.html":
        case "/account-form.html":
        case "/account-form-detail.html":
            $("#nav-list > li").eq(2).addClass("active");
            break;
        case "/member.html":
        case "/member-form.html":
        case "/member-detail.html":
            $("#nav-list > li").eq(3).addClass("active");
            break;
        case "/accounting.html":
        case "/accounting-detail.html":
            $("#nav-list > li").eq(4).addClass("active");
            break;
        case "/notice.html":
        case "/notice-form.html":
        case "/notice-detail.html":
            $("#nav-list > li").eq(5).addClass("active");
            break;
        case "/folder.html":
        case "/folder-form.html":
        case "/file.html":
        case "/file-form.html":
            $("#nav-list > li").eq(6).addClass("active");
            break;
        default:
            null;
    }

    // 마이페이지 개인정보
    GET_MY_USER_DETAIL(sessionUserUID).then((data) => {
        const { userName, position, telNum } = data.data[0];

        // console.log(data.data[0]);
        $(".header-name").text(userName);
        $(".header-position").text(position);
        $(".header-tel").text(telNum);
    });

    // 공사현황 클릭
    $("#handleLevelHref").click(function () {
        location.href = sessionStorage.getItem("href");
    });
});
