let projectUID = 0;
let scheduleUID = 0;
let scheduleCode = "";
let scheduleDate = "";
/**
 *
 * common-project 호출하는 함수
 * @param {Array} DATAS - 실제 데이터
 * @param {Array} thisYear - 해당 년
 * @param {Array} thisMonth - 해당 월
 */
function SET_CLASS_PROJECT(DATAS, thisYear, thisMonth) {
    const sttsData = DATAS.filter(
        (n) =>
            n.stts === 3 ||
            n.stts === 4 ||
            n.stts === 5 ||
            n.stts === 6 ||
            n.stts === 7
    );

    console.log(sttsData);

    sttsData.forEach((data) => {
        $(
            "#chart-content table[data-index=" +
                (thisYear + thisMonth) +
                "] tbody tr[data-uid=" +
                data.UID +
                "] td[data-date=" +
                data.inputDate +
                "] .add-section .nbsp"
        ).remove();

        $(
            "#chart-content table[data-index=" +
                (thisYear + thisMonth) +
                "] tbody tr[data-uid=" +
                data.UID +
                "] td[data-date=" +
                data.inputDate +
                "] .add-section"
        ).append(`
			<div class="d-flex">
    			<button 
					type="button" 
					class="aps-button active ${data.cnStts === 9 ? `green` : ``}"
					data-product-uid="${data.UID}"
					data-schedule-uid="${data.scheduleUID}"
					data-div-uid="${data.divUID}"
				>
    				<div class="aps-content">
    					<div class="aps-top">${data.floor}F ${data.section}구간</div>
    					<div class="d-flex aps-middle">
    						<div>${data.area}</div>
    						<div>${data.strup}</div>
    					</div>
    					<div class="d-flex aps-bottom">
    						<div>${data.dkbCnt}</div>
    						<div>${data.cnCnt || ``}</div>
    					</div>
    				</div>
    			</button>
			</div>
    	`);
    });
}

// design 자료 조회
async function GET_DESIGN_FILE(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "design/file/" + scheduleUID,
    });

    return res.data;
}

// 기성 자료 조회
async function GET_PROJECT_FILE(projectUID) {
    const res = await http({
        method: "GET",
        url: "project/file/" + projectUID,
    });

    return res.data;
}

// 기성 자료 업로드
async function POST_PROJECT_FILE(filePath, fileType, files) {
    const formData = new FormData();

    // 다중 파일
    for (let i = 0; i < files.length; i++) {
        formData.append(
            `project/${scheduleCode}/${filePath}/${fileType}`,
            files[i]
        );
    }

    formData.append("projectUID", projectUID);
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
                listsFecthGisung();
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

function lists(el) {
    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 14px;"></i>
				${el.fileName}
			</a>
		</div>
	`;
}

function lists2(el) {
    const sessionPtKey = sessionStorage.getItem("ptKey");

    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 14px;"></i>
				${el.fileName}
			</a>
			${
                sessionPtKey === "null"
                    ? `<a href="#" type="button" class="btn-delete sg-team-delete-gisung" data-uid="${el.UID}">
							<i class="fas fa-plus text-danger"></i>
						</a>`
                    : ``
            }
		</div>
	`;
}

// 공통자료 리스트 업데이트
function listsFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "변경승인도면_BOM_CP_스트럽":
                    $("#content-gsd-seung").append(lists(el));
                    break;
                case "코너철판_변경설계도면":
                    $("#content-gsd-corner").append(lists(el));
                    break;
                default:
                    return;
            }
        });
    });
}

// 기성 리스트 업데이트
function listsFecthGisung() {
    GET_PROJECT_FILE(projectUID).then((res) => {
        console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "설치팀_노무비":
                    $("#content-nomu").append(lists2(el));
                    break;
                default:
                    return;
            }
        });
    });
}

// 자료 삭제
function DELETE_PROJECT_SC_TEAM_GISUNG(UID) {
    http({
        method: "DELETE",
        url: "project/" + UID,
    })
        .then((res) => {
            listsFecth();
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
    // 설치팀 입력 팝업
    $(document).on("click", ".aps-button.active", function () {
        const productUid = $(this).parents("tr").data("uid");
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parent().data("date");

        projectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-sc-team").modal();

        console.log("?", scheduleUID);
        listsFecth();
    });

    // 설치팀 노무비 팝업
    $(document).on("click", ".handleProjectGisungPop", function () {
        const productUid = $(this).data("uid");
        const name = $(this).data("name");
        const code = $(this).data("code");

        projectUID = productUid;
        scheduleCode = code;

        listsFecthGisung();

        $(".gisung-title").text(name);

        // 옵저버 설정
        const sessionPtKey = sessionStorage.getItem("ptKey");
        if (sessionPtKey === "null") {
            $(".auth-display").attr("style", "display: flex !important");
        }
    });

    // 설치팀 기성 업로드
    $("#handleFileGisung").click(function () {
        const file = $("#file-gisung")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE("설치", "설치팀_노무비", file.files);
    });

    // 자료 삭제
    $(document).on("click", ".sg-team-delete-gisung", function () {
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
            if (res) DELETE_PROJECT_SC_TEAM_GISUNG(uid);
        });
    });
});
