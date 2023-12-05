const getUserID = sessionStorage.getItem("userUID");

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
    // $("#handleLogout").click(function () {
    //     sessionStorage.removeItem("token");
    //     sessionStorage.removeItem("level");
    //     location.href = "/login.html";
    // });

    const path = $(location).attr("pathname");

    // console.log("userUID", getUserID);
    // console.log(path);

    switch (path) {
        case "/":
        case "/index.html":
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
            $("#nav-list > li").eq(4).addClass("active");
            break;
        case "/notice.html":
        case "/notice-form.html":
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
    GET_MY_USER_DETAIL(getUserID).then((data) => {
        const { userName, position, telNum } = data.data[0];

        // console.log(data.data[0]);
        $(".header-name").text(userName);
        $(".header-position").text(position);
        $(".header-tel").text(telNum);
    });
});
