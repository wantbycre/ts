// 공지사항 등록
async function POST_NOTICE(title, content) {
    const res = await instance({
        method: "POST",
        url: "notice",
        data: {
            title,
            content,
        },
    });
    return res.data;
}

$(function () {
    $("#handleSubmit").click(function () {
        const title = $("#form-title").val();
        const content = $("#form-content").val();

        // console.log(title, content);

        POST_NOTICE(title, content).then((res) => {
            console.log("공지사항", res);
        });
    });
});
