// 폴더 등록
function POST_FILE_FOLDER(fbUID, folderName) {
    http({
        method: "POST",
        url: "file_folder",
        data: {
            fbUID,
            folderName,
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
                location.href = "/folder.html";
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

// 폴더 항목
async function GET_FILE_BOARD() {
    const res = await http({
        method: "GET",
        url: "file_board",
    });

    res.data.data.forEach((el) => {
        $("#fbUID").append(`
			<option value="${el.UID}">${el.title}</option>
		`);
    });
}

$(function () {
    GET_FILE_BOARD();

    // 등록/수정
    $(".handleSubmit").click(function () {
        const fbUID = $("#fbUID").val();
        const folderName = $("#folderName").val();

        if (fbUID === "default") return alertError("분류 선택하세요.");
        if (!folderName) return alertError("폴더이름을 입력하세요");

        POST_FILE_FOLDER(fbUID, folderName);
    });
});
