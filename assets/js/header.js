$(function () {
    // 로그아웃
    // $("#handleLogout").click(function () {
    //     sessionStorage.removeItem("token");
    //     sessionStorage.removeItem("level");
    //     location.href = "/login.html";
    // });

    const path = $(location).attr("pathname");

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
            $("#nav-list > li").eq(3).addClass("active");
            break;
        case "/member.html":
        case "/member-form.html":
        case "/member-detail.html":
            $("#nav-list > li").eq(4).addClass("active");
            break;
        case "/notice.html":
        case "/notice-form.html":
            $("#nav-list > li").eq(6).addClass("active");
            break;
        case "/file.html":
        case "/file-form.html":
            $("#nav-list > li").eq(7).addClass("active");
            break;
        default:
            return;
    }
});
