let folderTabName = "";

// 폴더 리스트
async function GET_FILE_FOLDER(PARAM_UID) {
    const res = await http({
        method: "GET",
        url: "file_folder/" + PARAM_UID,
    });

    console.log(res.data.data);

    const { data } = res.data;
    let listCount = data.length;

    $("#folder").empty();

    if (data.length === 0) {
        $("#folder").append(`
			<div class="d-flex align-items-center justify-content-center" style="width: 150px;height: 150px">폴더가 없습니다.</div>
		`);
    } else {
        data.forEach((el, i) => {
            $("#folder").append(`
				<div class="position-relative">
					<a href="/file.html?tab=${folderTabName}&uid=${el.UID}&name=${el.folderName}">
						<i class="la flaticon-folder"></i>
						<div>${el.folderName}</div>
					</a>
					<button type="button" class="handleDelete" data-uid="${el.UID}">
						<i class="fas fa-window-close"></i>
					</button>
				</div>
			`);
        });
    }
}

// 폴더 항목
async function GET_FILE_BOARD(PARAM_UID) {
    const res = await http({
        method: "GET",
        url: "file_board",
    });

    $("#pills-tab").empty();

    folderTabName = res.data.data[PARAM_UID - 1].title;

    res.data.data.forEach((el, i) => {
        $("#pills-tab").append(`
			<li class="nav-item submenu account-tab">
				<a
					class="nav-link ${PARAM_UID === i + 1 ? `active show` : ``}" 
					href="#"
					data-index="${el.UID}"
				>
					${el.title}
				</a>
			</li>
		`);
    });
}

// FIXME: 삭제가 안되는듯
function DELETE_FOLDER(UID) {
    http({
        method: "DELETE",
        url: "file_folder/" + UID,
    })
        .then((res) => {
            console.log(res);
            // location.reload();
        })
        .catch(function (error) {
            console.log(error);
        });
}

$(function () {
    GET_FILE_BOARD(1);
    GET_FILE_FOLDER(1);

    // 폴더 탭 변경
    $(document).on("click", ".account-tab a", function () {
        const index = $(this).data("index");
        GET_FILE_BOARD(index);
        GET_FILE_FOLDER(index);
    });

    // 폴더 삭제
    $(document).on("click", ".handleDelete", function () {
        const UID = $(this).data("uid");

        http({
            method: "GET",
            url: "FOLDER_FILE/" + UID,
        }).then((res) => {
            if (res.data.data.length === 0) {
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
                    if (res) {
                        DELETE_FOLDER(UID);
                    }
                });
            } else {
                swal("파일이 존재할 경우 삭제가 불가능합니다.", {
                    icon: "error",
                    buttons: {
                        cancel: {
                            text: "확인",
                            visible: true,
                            className: "btn btn-default btn-border",
                        },
                    },
                });
            }
        });
    });
});
