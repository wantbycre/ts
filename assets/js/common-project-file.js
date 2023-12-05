let projectUID = "";
let projectCode = "";

// 공통자료 조회
async function GET_PROJECT_FILE(projectUID) {
    const res = await http({
        method: "GET",
        url: "project/file/" + projectUID,
    });

    return res.data;
}

// 공통자료 업로드
async function POST_PROJECT_FILE_COMMON(filePath, fileType, files, memo) {
    const formData = new FormData();

    // 다중 파일
    for (let i = 0; i < files.length; i++) {
        formData.append(
            `project/${projectCode}/${filePath}/${fileType}`,
            files[i]
        );
    }

    formData.append("projectUID", projectUID);
    formData.append("fileType", fileType);
    formData.append("memo", memo);

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
                $("input[type=file], textarea").val("");
                commonListsFecth();
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

// 자료 삭제
function DELETE_PROJECT_COMMON(UID) {
    http({
        method: "DELETE",
        url: "project/" + UID,
    })
        .then((res) => {
            commonListsFecth();
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 공통자료 리스트
function commonLists(el) {
    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 14px;"></i>
				${el.fileName}
			</a>
			<a href="#" type="button" class="btn-delete common-delete" data-uid="${el.UID}">
				<i class="fas fa-plus text-danger"></i>
			</a>
		</div>
	`;
}

function commonTbodys(el) {
    return `
		<tr>
			<td>${el.memo}</td>
			<td class="text-center" style="border-left: 1px solid #000;">
				${
                    el.fileName
                        ? `<a 
							href="${el.filePath}" 
							class="file-list"
							download="${el.fileName}"
						>
							${el.fileName}
						</a>`
                        : ``
                }
				
			</td>
			<td style="border-left: 1px solid #000;">
				<a href="#" type="button" class="btn-delete common-delete" data-uid="${el.UID}">
					<i class="fas fa-plus text-danger ml-1"></i>
				</a>
			</td>
		</tr>
	`;
}

// 공통자료 리스트 업데이트
function commonListsFecth() {
    GET_PROJECT_FILE(projectUID).then((res) => {
        console.log(res.data);
        $(".file-empty, .file-content tbody").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "견적자료":
                    $("#content-gong-geun").append(commonLists(el));
                    break;
                case "계약서":
                    $("#content-gong-gue").append(commonLists(el));
                    break;
                case "설계도면":
                    $("#content-sul").append(commonLists(el));
                    break;
                case "구조검토서":
                    $("#content-gong-gu").append(commonLists(el));
                    break;
                case "DECK도면":
                    $("#content-gong-deck").append(commonLists(el));
                    break;
                case "공장":
                    $("#content-gongjang tbody").append(commonTbodys(el));
                    break;
                case "설치":
                    $("#content-sulchi tbody").append(commonTbodys(el));
                    break;
                default:
                    return;
            }
        });
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
    // 공통자료 팝업 오버라이드
    $(document).on("click", ".handleProjectCodePop", function () {
        const uid = $(this).data("uid");
        const code = $(this).data("code");

        projectUID = uid;
        projectCode = code;

        commonListsFecth();
    });

    // 자료 삭제
    $(document).on("click", ".common-delete", function () {
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
            if (res) DELETE_PROJECT_COMMON(uid);
        });
    });

    // 공무 견적자료 업로드
    $("#handleFileGongGeun").click(function () {
        const file = $("#file-gong-geun")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE_COMMON("공무", "견적자료", file.files);
    });

    // 공무 계약서 업로드
    $("#handleFileGongGue").click(function () {
        const file = $("#file-gong-gue")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE_COMMON("공무", "계약서", file.files);
    });

    // 설계도면 업로드
    $("#handleFileSul").click(function () {
        const file = $("#file-sul")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE_COMMON("설계", "설계도면", file.files);
    });

    // 공사 구조검토서 업로드
    $("#handleFileGongGu").click(function () {
        const file = $("#file-gong-gu")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE_COMMON("공사", "구조검토서", file.files);
    });

    // 공사 DECK도면 업로드
    $("#handleFileGongDeck").click(function () {
        const file = $("#file-gong-deck")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE_COMMON("공사", "DECK도면", file.files);
    });

    // 공장 업로드
    $("#handleFileGonjang").click(function () {
        const file = $("#file-gongjang")[0];
        const val = $("#file-gongjang-memo").val();

        if (file.files.length === 0 && !val)
            return alertError("메모 또는 파일첨부 하세요.");

        POST_PROJECT_FILE_COMMON("공장", "공장", file.files, val);
    });

    // 설치 업로드
    $("#handleFileSulchi").click(function () {
        const file = $("#file-sulchi")[0];
        const val = $("#file-sulchi-memo").val();

        if (file.files.length === 0 && !val)
            return alertError("메모 또는 파일첨부 하세요.");

        POST_PROJECT_FILE_COMMON("설치", "설치", file.files, val);
    });
});
