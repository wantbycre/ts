const PARAM_TAB = new URL(window.location.href).searchParams.get("tab");
const PARAM_UID = new URL(window.location.href).searchParams.get("uid");
const PARAM_NAME = new URL(window.location.href).searchParams.get("name");

// 파일 업로드
function POST_FILE(files) {
    const formData = new FormData();

    console.log(files.length);

    // 다중 파일
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        formData.append("ffUID", PARAM_UID);
        formData.append("file_board/" + PARAM_TAB, files[i]);
    }

    // FIXME: 올리는건 다중으로 올리는데 리스트는 한개만 나옴.

    http({
        headers: {
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        url: "folder_file/file",
        data: formData,
    })
        .then((res) => {
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((_) => {
                location.href = `/file.html?tab=${PARAM_TAB}&uid=${PARAM_UID}&name=${PARAM_NAME}`;
            });
        })
        .catch((error) => {
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
    $(".page-title").text(PARAM_NAME + "파일 등록");

    // 등록/수정
    $(".handleSubmit").click(function () {
        const file = $("#file")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_FILE(file.files);
    });
});
