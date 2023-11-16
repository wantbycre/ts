// 파일 업로드
function PUT_FILE(UID, file) {
    const formData = new FormData();
    formData.append("file_board", file.files[0]);
    formData.append("UID", UID);

    // 다중 파일
    // file.files.forEach((file) => {
    // 	formData.append("files", file);
    //     formData.append("UID", UID);
    // });

    console.log(file.files);

    // http({
    //     headers: {
    //         "Content-Type": "multipart/form-data",
    //     },
    //     method: "PUT",
    //     url: "file_board/file",
    //     data: formData,
    // }).then((res) => {
    //     console.log(res);
    // });
}

// 파일명 등록
async function POST_FILE_BOARD(title) {
    const res = await http({
        method: "POST",
        url: "file_board",
        data: {
            title,
        },
    });

    return res.data;
}

// 파일 수정
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

// 파일 삭제
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

// 파일 상세
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
        const file = $("#file")[0];

        if (!title) return alertError("제목을 입력하세요");
        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        if (PARAM_UID) {
            PUT_NOTICE(PARAM_UID, title, content);
        } else {
            POST_FILE_BOARD(title).then((res) => {
                PUT_FILE(res.data, file);
            });
        }
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
            DELETE_NOTICE(PARAM_UID);
        });
    });
});
