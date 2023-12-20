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
    const sttsData = DATAS.filter((n) => n.cnStts === 8 || n.cnStts === 9);

    console.log(sttsData);

    sttsData.forEach((data, i) => {
        if (data.scheduleUID !== sttsData[i - 1]?.scheduleUID) {
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
					class="aps-button active ${data.cnStts === 9 ? `brown` : ``}"
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
        }
    });
}

// 공장 - 판재공장 입력
function PUT_FACTORY(cnOutputDate) {
    http({
        method: "PUT",
        url: "factory/corner",
        data: {
            scheduleUID,
            cnOutputDate,
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
                sessionStorage.setItem("left", scheduleDate);
                location.href = "/index-gj-corner.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 프로젝트 상세조회
async function GET_DESIGN_DETAIL(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "design/" + scheduleUID,
    });

    return res.data;
}

// 코너철판 자료 조회
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

// 공통자료 상세 리스트
function lists(el) {
    return `
		<div class="d-flex">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}" style="width: 100%">
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
                    ? `<a href="#" type="button" class="btn-delete sg-corner-delete-gisung" data-uid="${el.UID}">
							<i class="fas fa-plus text-danger"></i>
						</a>`
                    : ``
            }
		</div>
	`;
}

// DESIGN FILE 리스트 업데이트
function listsFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        // console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "코너철판_설계도면":
                    $("#content-sgd-sul").append(lists(el));
                    break;
                case "코너철판_변경설계도면":
                    $("#content-sgd-bsul").append(lists(el));
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
                case "코너철판_기성":
                    $("#content-gisung").append(lists2(el));
                    break;
                default:
                    return;
            }
        });
    });
}

// 기성 자료 삭제
function DELETE_PROJECT_GJ_CORNER_GISUNG(UID) {
    http({
        method: "DELETE",
        url: "project/" + UID,
    })
        .then((res) => {
            listsFecthGisung();
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
    // 공장-코너철판 입력 팝업
    $(document).on("click", ".aps-button.active", function () {
        const productUid = $(this).parents("tr").data("uid");
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parents("td").data("date");

        // projectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-panjea").modal();
        $("#cnOutputDate").datepicker();

        listsFecth();

        GET_DESIGN_DETAIL(scheduleUID).then((res) => {
            const data = res.data[0];
            const today = moment(new Date()).format("YYYY-MM-DD");

            $("#cnOutputDate")
                .datepicker()
                .datepicker("setDate", data.inputDate || today);
        });

        // 옵저버 설정
        const sessionPtKey = sessionStorage.getItem("ptKey");
        if (sessionPtKey !== "null") {
            $("#handleSubmit").hide();
        }
    });

    // 공장 - 코너철판 저장
    $("#handleSubmit").click(function () {
        const cnOutputDate = $("#cnOutputDate").val();

        PUT_FACTORY(cnOutputDate);
    });

    // 공장-코너철판 기성 팝업
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

    // 공장-코너철판 기성 업로드
    $("#handleFileGisung").click(function () {
        const file = $("#file-gisung")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE("공장", "코너철판_기성", file.files);
    });

    // 기성 자료 삭제
    $(document).on("click", ".sg-corner-delete-gisung", function () {
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
            if (res) DELETE_PROJECT_GJ_CORNER_GISUNG(uid);
        });
    });
});
