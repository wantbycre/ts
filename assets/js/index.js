let projectUID = "";
let projectCode = "";
/**
 *
 * common-project 호출하는 함수
 * @param {Array} DATAS - 실제 데이터
 * @param {Array} thisYear - 해당 년
 * @param {Array} thisMonth - 해당 월
 */
function SET_CLASS_PROJECT(DATAS, thisYear, thisMonth) {
    if (DATAS.length === 0) {
        $(".not-project").show();
        $(".set-project").hide();
    } else {
        $(".not-project").hide();
        $(".set-project").show();
    }
}

// 싱규 프로젝트 생성
function POST_PROJECT(
    projectCode,
    projectName,
    jhPartner,
    jmPartner,
    pjPartner,
    jrPartner,
    sgPartner,
    cornerPartner,
    ngdPartner,
    cmPartner,
    deckPartner,
    tablePartner,
    scPartner
) {
    http({
        method: "POST",
        url: "project",
        data: {
            projectCode,
            projectName,
            jhPartner,
            jmPartner,
            pjPartner,
            jrPartner,
            sgPartner,
            cornerPartner,
            ngdPartner,
            cmPartner,
            deckPartner,
            tablePartner,
            scPartner,
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
                location.href = "/index.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 공통자료 조회
async function GET_PROJECT_FILE(projectUID) {
    const res = await http({
        method: "GET",
        url: "project/file/" + projectUID,
    });

    return res.data;
}

// 공통자료 업로드
async function POST_PROJECT_FILE(fileType, files) {
    const formData = new FormData();

    // 다중 파일
    for (let i = 0; i < files.length; i++) {
        formData.append(`project/${projectCode}/공무/${fileType}`, files[i]);
    }

    formData.append("projectUID", projectUID);
    formData.append("fileType", fileType);
    formData.append("memo", projectUID || null);

    http({
        headers: {
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        url: "project/file",
        data: formData,
    })
        .then((res) => {
            // console.log("파일첨부", res);
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

// 공통자료 리스트
function lists(el) {
    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 14px;"></i>
				${el.fileName}
			</a>
			<a href="#" type="button" class="btn-delete" data-uid="${el.UID}">
				<i class="fas fa-plus text-danger"></i>
			</a>
		</div>
	`;
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
    // 신규프로젝트 생성
    $("#handleNewProjectSubmit").click(function () {
        const projectCode = $("#projectCode").val();
        const projectName = $("#projectName").val();
        const jhPartner = $("#jhPartner").val();
        const jmPartner = $("#jmPartner").val();
        const pjPartner = $("#pjPartner").val();
        const jrPartner = $("#jrPartner").val();
        const sgPartner = $("#sgPartner").val();
        const cornerPartner = $("#cornerPartner").val();
        const ngdPartner =
            $("#ngdPartner").val() === "default" ? 0 : $("#ngdPartner").val();
        const cmPartner =
            $("#cmPartner").val() === "default" ? 0 : $("#cmPartner").val();
        const deckPartner =
            $("#deckPartner").val() === "default" ? 0 : $("#deckPartner").val();
        const tablePartner =
            $("#tablePartner").val() === "default"
                ? 0
                : $("#tablePartner").val();
        const scPartner = $("#scPartner").val();

        if (!projectCode) return alertError("공사코드를 입력하세요");
        if (!projectName) return alertError("공사명을 입력하세요");

        if (jhPartner === "default")
            return alertError("종합건설 항목을 선택하세요");
        if (jmPartner === "default")
            return alertError("전문건설 항목을 선택하세요");
        if (pjPartner === "default")
            return alertError("판재판매처 항목을 선택하세요");
        if (jrPartner === "default")
            return alertError("조립공장 항목을 선택하세요");
        if (sgPartner === "default")
            return alertError("설계업체 항목을 선택하세요");
        if (cornerPartner === "default")
            return alertError("코너철판 항목을 선택하세요");
        if (scPartner === "default") return alertError("설치팀을 선택하세요");

        POST_PROJECT(
            projectCode,
            projectName,
            Number(jhPartner),
            Number(jmPartner),
            Number(pjPartner),
            Number(jrPartner),
            Number(sgPartner),
            Number(cornerPartner),
            Number(ngdPartner),
            Number(cmPartner),
            Number(deckPartner),
            Number(tablePartner),
            Number(scPartner)
        );
    });

    // 공통자료 팝업 오버라이드
    $(document).on("click", ".handleProjectCodePop", function () {
        const uid = $(this).data("uid");
        const code = $(this).data("code");

        projectUID = uid;
        projectCode = code;

        GET_PROJECT_FILE(projectUID).then((res) => {
            console.log(res.data);

            $("#content-gong-geun").empty();

            res.data.forEach((el) => {
                switch (el.fileType) {
                    case "견적자료":
                        $("#content-gong-geun").append(lists(el));
                        break;
                    case 1: // 전문건설
                        $("#jmPartner").append(options(el));
                        break;
                    case 2: // 판재판매처
                        $("#pjPartner").append(options(el));
                        break;
                    case 3: // 조립공장
                        $("#jrPartner").append(options(el));
                        break;
                    case 4: // 설계업체
                        $("#sgPartner").append(options(el));
                        break;
                    case 5: // 코너철판
                        $("#cornerPartner").append(options(el));
                        break;
                    case 6: // 난간대
                        $("#ngdPartner").append(options(el));
                        break;
                    case 7: // 철물업체
                        $("#cmPartner").append(options(el));
                        break;
                    case 8: // DECK업체
                        $("#deckPartner").append(options(el));
                        break;
                    case 9: // 테이블업체
                        $("#tablePartner").append(options(el));
                        break;
                    case 10: // 설치팀
                        $("#scPartner").append(options(el));
                        break;
                    default:
                        return;
                }
            });
        });
    });

    // 공무 견적자료 업로드
    $("#handleFileGongGeun").click(function () {
        const file = $("#file-gong-geun")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE("견적자료", file.files);
    });
});
