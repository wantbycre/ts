// 공지사항 등록
async function POST_LOGIN(userId, password) {
    const res = await axios({
        method: "POST",
        url: domain + "/api/login",
        data: {
            userId,
            password,
        },
    });
    return res.data;
}

$(function () {
    $("#handleSubmit").click(function () {
        const userId = $("#userId").val();
        const password = $("#password").val();

        POST_LOGIN(userId, password).then((res) => {
            const { data } = res;
            console.log(res);
            // FIXME: 레벨을 주면 레벨에 따라 index를 다르게
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("level", data.level);
        });
    });

    $("#id, #password").on("keypress", function (e) {
        if (e.keyCode == "13") {
            $("#handleSubmit").click();
        }
    });
});
