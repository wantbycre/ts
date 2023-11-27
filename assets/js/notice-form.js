// 공지사항 등록
function POST_NOTICE(title, content) {
    http({
        method: "POST",
        url: "notice",
        data: {
            title,
            content,
        },
    })
        .then((res) => {
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((res) => {
                location.href = "/notice.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 공지사항 수정
function PUT_NOTICE(UID, title, content) {
    http({
        method: "PUT",
        url: "notice",
        data: {
            UID,
            title,
            content,
        },
    })
        .then((res) => {
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((res) => {
                location.href = "/notice.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 공지사항 상세
async function GET_NOTICE_DETAIL(UID) {
    const res = await http({
        method: "GET",
        url: "notice/" + UID,
    });
    return res.data;
}

function alertError(text) {
    swal(text, {
        icon: "error",
        buttons: {
            confirm: {
                className: "btn btn-danger",
            },
        },
    });
}

$(function () {
    const PARAM_UID = new URL(window.location.href).searchParams.get("uid");

    // 최초
    if (PARAM_UID) {
        $(".form-none").show();
        $(".form-block").hide();

        GET_NOTICE_DETAIL(PARAM_UID).then((data) => {
            const { title, content } = data.data;

            $("#form-title").val(title);
            $("#form-content").val(content);
        });
    }

    // 등록/수정
    $(".handleSubmit").click(function () {
        const title = $("#form-title").val();
        const content = $("#form-content").val();

        if (!title) return alertError("제목을 입력하세요");
        if (!content) return alertError("내용을 입력하세요");

        if (PARAM_UID) {
            PUT_NOTICE(PARAM_UID, title, content);
        } else {
            POST_NOTICE(title, content);
        }
    });
});
