let joningProjectUID = "";
let joningProjectCode = "";

// 공통자료 조회
async function GET_PROJECT_JONING_FILE(projectUID) {
    const res = await http({
        method: "GET",
        url: "project/file/" + projectUID,
    });

    return res.data;
}

// 공통자료 업로드
async function POST_PROJECT_JONING_FILE(filePath, fileType, files) {
    const formData = new FormData();

    // 다중 파일
    for (let i = 0; i < files.length; i++) {
        formData.append(
            `project/${joningProjectCode}/${filePath}/${fileType}`,
            files[i]
        );
    }

    formData.append("projectUID", joningProjectUID);
    formData.append("fileType", fileType);

    http({
        headers: {
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        url: "project/file",
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
                $("input[type=file]").val("");
                listsJoningFecth();
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

// 자료 삭제
function DELETE_PROJECT_JONING(UID) {
    http({
        method: "DELETE",
        url: "project/" + UID,
    })
        .then((res) => {
            listsJoningFecth();
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 공통자료 리스트
function listsJoning(el) {
    // 옵저버 설정
    const sessionPtKey = sessionStorage.getItem("ptKey");
    const sessionLevel = sessionStorage.getItem("level");

    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 14px;"></i>
				${el.fileName}
			</a>
			${
                sessionPtKey === "null"
                    ? sessionLevel === "2" ||
                      sessionLevel === "3" ||
                      sessionLevel === "4" ||
                      sessionLevel === "5"
                        ? `
							<a href="#" type="button" class="btn-delete joning-delete" data-uid="${el.UID}">
								<i class="fas fa-plus text-danger"></i>
							</a>				
							`
                        : ``
                    : ``
            }
			
		</div>
	`;
}

// 공통자료 리스트 업데이트
function listsJoningFecth() {
    GET_PROJECT_JONING_FILE(joningProjectUID).then((res) => {
        // console.log(res.data);
        $(".file-empty").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "조닝도":
                    $("#content-joning").append(listsJoning(el));
                    break;
                default:
                    return;
            }
        });
    });
}

$(function () {
    // 공통자료 팝업 오버라이드
    $(document).on("click", ".handleProjectJoningPop", function () {
        const uid = $(this).data("uid");
        const code = $(this).data("code");

        joningProjectUID = uid;
        joningProjectCode = code;

        listsJoningFecth();

        // 옵저버 설정
        const sessionPtKey = sessionStorage.getItem("ptKey");
        if (sessionPtKey === "null") {
            $(".auth-display").attr("style", "display: flex !important");
        }
    });

    // 자료 삭제
    $(document).on("click", ".joning-delete", function () {
        const uid = $(this).data("uid");

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
            if (res) DELETE_PROJECT_JONING(uid);
        });
    });

    // 조닝도 업로드
    $("#handleFileJoningdo").click(function () {
        const file = $("#file-joning")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_JONING_FILE("조닝도", "조닝도", file.files);
    });
});
