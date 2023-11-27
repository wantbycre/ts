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
        case "/account1.html":
        case "/account2.html":
        case "/account3.html":
        case "/account4.html":
        case "/account5.html":
        case "/account6.html":
        case "/account7.html":
        case "/account8.html":
        case "/account9.html":
        case "/account10.html":
        case "/account11.html":
        case "/account12.html":
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
            return;
    }
});
