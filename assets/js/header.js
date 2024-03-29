// 유저정보 상세
async function GET_MY_USER_DETAIL(UID) {
    const res = await http({
        method: "GET",
        url: "user/" + UID,
    });
    return res.data;
}

$(function () {
    const sessionLevel = sessionStorage.getItem("level");
    const sessionPartnerUID = sessionStorage.getItem("partnerUID");
    const sessionPtKey = sessionStorage.getItem("ptKey");
    const sessionToken = sessionStorage.getItem("token");
    const sessionUserUID = sessionStorage.getItem("userUID");
    const path = $(location).attr("pathname");

    // 로그아웃
    $("#handleLogout").click(function () {
        sessionStorage.removeItem("level");
        sessionStorage.removeItem("partnerUID");
        sessionStorage.removeItem("ptKey");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userUID");
        sessionStorage.removeItem("href");
        sessionStorage.removeItem("left");

        location.href = "/login.html";
    });

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

    // 권한
    setTimeout(function () {
        if (sessionLevel === "2" || sessionLevel === "5") {
            $(".auth-display-menu").attr(
                "style",
                "display: list-item !important"
            );
        }
    }, 100);

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
            // $(".collapse").hide();
            break;
        // case "/dashboard.html":
        //     $("#nav-list > li").eq(2).addClass("active");
        //     break;
        case "/account-income.html":
        case "/account-income-form.html":
        case "/account-income-form-detail.html":
            // $(".collapse").hide();
            $("#nav-list > li").eq(2).addClass("active");
            break;
        case "/account-outcome.html":
        case "/account-outcome-form.html":
        case "/account-outcome-form-detail.html":
            // $(".collapse").hide();
            $("#nav-list > li").eq(3).addClass("active");
            break;
        case "/member.html":
        case "/member-form.html":
        case "/member-detail.html":
            $("#nav-list > li").eq(4).addClass("active");
            // $(".collapse").hide();
            break;
        case "/accounting.html":
        case "/accounting-detail.html":
            $("#nav-list > li").eq(5).addClass("active");
            // $(".collapse").hide();
            break;
        case "/notice.html":
        case "/notice-form.html":
        case "/notice-detail.html":
            $("#nav-list > li").eq(6).addClass("active");
            // $(".collapse").hide();
            break;
        case "/folder.html":
        case "/folder-form.html":
        case "/file.html":
        case "/file-form.html":
            $("#nav-list > li").eq(7).addClass("active");
            // $(".collapse").hide();
            break;
        default:
            null;
    }

    // 마이페이지 개인정보
    GET_MY_USER_DETAIL(sessionUserUID).then((data) => {
        const { userName, position, telNum } = data.data[0];

        // console.log("마이페이지", sessionPtKey);

        if (sessionPtKey !== "null") {
            $(".user").hide();
        } else {
            $(".header-name").text(userName);
            $(".header-position").text(position);
            $(".header-tel").text(telNum);
        }
    });

    // 공사현황 클릭
    $("#handleLevelHref").click(function () {
        location.href = sessionStorage.getItem("href");
    });

    // 로고 클릭
    $("#handleHrefClick").click(function () {
        location.href = sessionStorage.getItem("href");
    });
});
