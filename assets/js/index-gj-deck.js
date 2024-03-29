let projectUID = 0;
let scheduleUID = 0;
let scheduleCode = "";
let scheduleDate = "";
let totalArea = 0;
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
					class="aps-button active ${data.deckInputDate ? `pink blur` : `pink`}"
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

// 공장 - DECK 입력
function PUT_FACTORY(deckArea, deckInputDate) {
    console.log(deckArea, deckInputDate, scheduleUID, projectUID);
    http({
        method: "PUT",
        url: "factory/deck",
        data: {
            deckArea,
            deckInputDate,
            scheduleUID,
            projectUID,
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
                location.href = "/index-gj-deck.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 자료 삭제
function DELETE_PROJECT_DECK(UID) {
    http({
        method: "DELETE",
        url: "design/" + UID,
    })
        .then((res) => {
            listsFecth();
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

// DECK 자료 조회
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

// DECK 상세 리스트
function lists(el) {
    // const sessionPtKey = sessionStorage.getItem("ptKey");
    // ${
    // 	sessionPtKey === "null"
    // 		? `
    // 			<a href="#" type="button" class="btn-delete deck-delete" data-uid="${el.UID}">
    // 				<i class="fas fa-plus text-danger"></i>
    // 			</a>`
    // 		: ``
    // }

    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 11px;"></i>
				${el.fileName}
			</a>
			<a href="#" type="button" class="btn-delete deck-delete" data-uid="${el.UID}">
				<i class="fas fa-plus text-danger"></i>
			</a>
		</div>
	`;
}

// 기성 상세 리스트
function lists2(el) {
    // const sessionPtKey = sessionStorage.getItem("ptKey");
    // ${
    // 	sessionPtKey === "null"
    // 		? `<a href="#" type="button" class="btn-delete gj-deck-delete-gisung" data-uid="${el.UID}">
    // 				<i class="fas fa-plus text-danger"></i>
    // 			</a>`
    // 		: ``
    // }

    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 11px;"></i>
				${el.fileName}
			</a>
			<a href="#" type="button" class="btn-delete gj-deck-delete-gisung" data-uid="${el.UID}">
				<i class="fas fa-plus text-danger"></i>
			</a>
		</div>
	`;
}

// DECK 리스트 업데이트
function listsFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        // console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "DECK_파일":
                    $("#content-deck").append(lists(el));
                    break;
                default:
                    return;
            }
        });
    });
}

// DECK 자료 업로드
async function POST_DESIGN_FILE(filePath, fileType, files) {
    const formData = new FormData();

    // 다중 파일
    for (let i = 0; i < files.length; i++) {
        formData.append(
            `design/${scheduleCode}/${filePath}/${fileType}`,
            files[i]
        );
    }

    formData.append("scheduleUID", scheduleUID);
    formData.append("fileType", fileType);

    http({
        headers: {
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        url: "design/file",
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
                listsFecth();
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

// 기성 리스트 업데이트
function listsFecthGisung() {
    GET_PROJECT_FILE(projectUID).then((res) => {
        console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "DECK_기성":
                    $("#content-gisung").append(lists2(el));
                    break;
                default:
                    return;
            }
        });
    });
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

// 누적면적
async function GET_TOTAL_AREA(projectUID) {
    const res = await http({
        method: "GET",
        url: "project/totalDeckArea/" + projectUID,
    });

    return res.data;
}

// 기성 자료 삭제
function DELETE_PROJECT_GJ_DECK_GISUNG(UID) {
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
    // 공장-DECK 입력 팝업
    $(document).on("click", ".aps-button.active", function () {
        const productUid = $(this).parents("tr").data("uid");
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parents("td").data("date");

        projectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-deck").modal();
        $("#deckInputDate").datepicker();

        listsFecth();

        // 기본 상세
        GET_DESIGN_DETAIL(scheduleUID).then((res) => {
            const data = res.data[0];
            const today = moment(new Date()).format("YYYY-MM-DD");

            $("#floor").val(data.floor);
            $("#section").val(data.section);

            $("#deckInputDate")
                .datepicker()
                .datepicker("setDate", data.inputDate || today);
        });

        // 누적면적
        GET_TOTAL_AREA(projectUID).then((res) => {
            console.log("누적면적", res.data);
            totalArea = Number(res.data[0].totalArea);
            $("#totalArea").val(parseFloat(totalArea.toFixed(3)));
        });

        // 옵저버 설정
        const sessionPtKey = sessionStorage.getItem("ptKey");
        if (sessionPtKey !== "null") {
            // $("#handleSubmit").hide();
            // $("input[type=text]").attr("readonly", true);
        } else {
            // $(".auth-display").attr("style", "display: flex !important");
        }
    });

    // 자료 삭제
    $(document).on("click", ".deck-delete", function () {
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
            if (res) DELETE_PROJECT_DECK(uid);
        });
    });

    // 입고면적 자동계산
    $("#deckArea").keyup(function () {
        const val = Number($(this).val());

        $("#totalArea").val(totalArea + val);
    });

    // 공장 - DECK 일정/면적 등록
    $("#handleSubmit").click(function () {
        const deckArea = $("#deckArea").val();
        const deckInputDate = $("#deckInputDate").val();

        if (!deckArea) return alertError("입고면적을 입력하세요.");

        PUT_FACTORY(deckArea, deckInputDate);
    });

    // 공장 - DECK 업로드
    $("#handleFileDeck").click(function () {
        const file = $("#file-deck")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_DESIGN_FILE("공장", "DECK_파일", file.files);
    });

    // 공장-DECK 기성 팝업
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

    // 공장-DECK 기성 업로드
    $("#handleFileGisung").click(function () {
        const file = $("#file-gisung")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE("공장", "DECK_기성", file.files);
    });

    // 기성 자료 삭제
    $(document).on("click", ".gj-deck-delete-gisung", function () {
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
            if (res) DELETE_PROJECT_GJ_DECK_GISUNG(uid);
        });
    });
});
