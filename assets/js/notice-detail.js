// 공지사항 상세
async function GET_NOTICE_DETAIL(UID) {
    const res = await http({
        method: "GET",
        url: "notice/" + UID,
    });
    return res.data;
}

// 공지사항 삭제
function DELETE_NOTICE(UID) {
    http({
        method: "DELETE",
        url: "notice/" + UID,
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

    GET_NOTICE_DETAIL(PARAM_UID).then((data) => {
        const { title, content } = data.data;

        $("#form-title").html(title);
        $("#form-content").html(content.replaceAll("<br>", "\r\n"));
    });

    // 수정
    $(".handleSubmit").click(function () {
        location.href = `/notice-form.html?uid=${PARAM_UID}`;
    });

    // 삭제
    $(".handleDelete").click(function () {
        swal("삭제하시겠습니까?", {
            icon: "error",
            buttons: {
                confirm: {
                    text: "네, 삭제하겠습니다.",
                    className: "btn btn-danger",
                },
                cancel: {
                    text: "아니요",
                    visible: true,
                    className: "btn btn-default btn-border",
                },
            },
        }).then((res) => {
            if (res) DELETE_NOTICE(PARAM_UID);
        });
    });
});
