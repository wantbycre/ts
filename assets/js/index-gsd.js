let gsdProjectUID = 0;
let scheduleUID = 0;
let scheduleCode = "";
let scheduleDate = "";
let isSubmitType = true; // t = 신규, f = 수정
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
					class="aps-button active ${data.cnStts === 8 ? `` : `green`}"
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

// 설계 등록
// 아직안됨
function POST_DESIGN(
    dkbDesignDate,
    floor,
    section,
    area,
    strup,
    dkbCnt,
    pjInputDate,
    inputDate
) {
    http({
        method: "POST",
        url: "design",
        data: {
            projectUID: gsdProjectUID,
            dkbDesignDate, // 설계일
            floor, // 구간정보 입력 - 층
            section, // 구간정보 입력 - 구간
            area, // 수량정보 입력 - 면적
            strup, // 수량정보 입력 - 스트럽
            dkbCnt, // 수량정보 입력 - 부재수
            pjInputDate, // 판재공장 입고일
            inputDate, // 현장납품 예정일
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
                location.href = "/index-gsd.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 설계 수정
function PUT_DESIGN(
    dkbDesignDate,
    floor,
    section,
    area,
    strup,
    dkbCnt,
    pjInputDate,
    inputDate
) {
    http({
        method: "PUT",
        url: "design",
        data: {
            scheduleUID,
            dkbDesignDate, // 설계일
            floor, // 구간정보 입력 - 층
            section, // 구간정보 입력 - 구간
            area, // 수량정보 입력 - 면적
            strup, // 수량정보 입력 - 스트럽
            dkbCnt, // 수량정보 입력 - 부재수
            pjInputDate, // 판재공장 입고일
            inputDate, // 현장납품 예정일
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
                location.href = "/index-sgd.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 히스토리 조회
async function GET_CONSTRUCTION(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "construction/" + scheduleUID,
    });

    return res.data;
}

function getHitoryDetail(el) {
    return `
		${moment(el.scheduleDate).year()}년 
		${moment(el.scheduleDate).month() + 1}월 
		${moment(el.scheduleDate).date()}일<br />
	`;
}

// 히스토리 출력
function setHistory(data) {
    data.forEach((el) => {
        switch (el.changeType) {
            case "데크보설계이력":
                $(".history1").append(getHitoryDetail(el));
                break;
            case "데크보입고이력":
                $(".history2").append(getHitoryDetail(el));
                break;
            case "코너철판설계이력":
                $(".history3").append(getHitoryDetail(el));
                break;
            case "코너철판입고이력":
                $(".history4").append(getHitoryDetail(el));
                break;
            case "구간분할입고이력":
                $(".history5").append(getHitoryDetail(el));
                break;
            default:
                return;
        }
    });
}

// 공사 자료 조회
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

// 공사 자료 업로드
async function POST_SGD_FILE(filePath, fileType, files, memo) {
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
    formData.append("memo", memo);

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

// 기성 자료 업로드
async function POST_PROJECT_FILE(filePath, fileType, files, memo) {
    const formData = new FormData();

    // 다중 파일
    for (let i = 0; i < files.length; i++) {
        formData.append(
            `project/${scheduleCode}/${filePath}/${fileType}`,
            files[i]
        );
    }

    formData.append("projectUID", gsdProjectUID);
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
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 14px;"></i>
				${el.fileName}
			</a>
		</div>
	`;
}

function tbodys(el) {
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
				<a href="#" type="button" class="btn-delete gsd-delete" data-uid="${el.UID}">
					<i class="fas fa-plus text-danger ml-1"></i>
				</a>
			</td>
		</tr>
	`;
}

// 공통자료 리스트 업데이트
function listsFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        console.log(res.data);
        $(
            ".modal-gongsa .file-content, .modal-gongsa file-content tbody"
        ).empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "변경승인도면_BOM_CP_스트럽":
                    $("#content-gsd-seung").append(lists(el));
                    break;
                case "코너철판_변경설계도면":
                    $("#content-gsd-corner").append(lists(el));
                    break;
                case "송장_색도면_상차사진":
                    $("#content-gsd-song").append(lists(el));
                    break;
                default:
                    return;
            }
        });
    });
}

// 기성 리스트 업데이트
function listsFecthGisung() {
    GET_PROJECT_FILE(gsdProjectUID).then((res) => {
        console.log(res.data);
        $("#content-gsd-sulchi tbody").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "난간대_설치팀":
                    $("#content-gsd-sulchi tbody").append(tbodys(el));
                    break;
                default:
                    return;
            }
        });
    });
}

// 신규 프로젝트 생성
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

// 프로젝트 상세조회
async function GET_DESIGN_DETAIL(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "design/" + scheduleUID,
    });

    return res.data;
}

// 메모등록/수정
async function PUT_ETC_NOTE(etcNote) {
    http({
        method: "PUT",
        url: "construction/etcNote",
        data: {
            scheduleUID,
            etcNote,
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
                location.href = "/index-gsd.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 누적면적
async function GET_TOTAL_AREA(projectUID) {
    const res = await http({
        method: "GET",
        url: "project/totalArea/" + projectUID,
    });

    return res.data;
}

// 자료 삭제
function DELETE_PROJECT_GSD_GISUNG(UID) {
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
    // 공사-데크보 입력 팝업
    $(document).on("click", ".aps-button.active", function () {
        const productUid = $(this).parents("tr").data("uid");
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parent().data("date");

        gsdProjectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-gongsa").modal();

        // FIXME: deckInputDate 이게 들어와야 하나? DECK입고일
        // FIXME: deckArea DECK입고일 / 입고면적 -> 사용자가 입력은 하나 기본 데이터는 얹어줘야하나?
        // FIXME: 누적면적 필요

        // TODO: inputDate 기준임 무조건

        // TODO: 입고일정 변경은 수시로
        // TODO: 입고 확정 stts 6번일 경우만 가능
        // TODO: 입고확정시 일정 변경 불가.

        GET_DESIGN_DETAIL(scheduleUID).then((res) => {
            const data = res.data[0];
            const dkbDate = data.dkbDesignDate;
            const pjDate = data.pjInputDate;
            const ipDate = data.inputDate;
            const pjInputDate = moment(pjDate).diff(moment(dkbDate), "days");

            // 특이 사항 NOTE
            $("#etcNote").val(data.etcNote);

            console.log("최초", data, scheduleDate);
            // const inputDate = moment(ipDate).diff(moment(pjDate), "days");

            // $("#floor").val(data.floor);

            // $("#section").val(data.section);
            // $("#area").val(data.area);
            // $("#strup").val(data.strup);
            // $("#dkbCnt").val(data.dkbCnt);
            // $("#pjInputDate").val(pjInputDate).attr("selected", "selected");
            // $("#inputDate").val(inputDate).attr("selected", "selected");
            // $("#dkbDesignDate").datepicker().datepicker("setDate", dkbDate);

            $("#inputDate").datepicker().datepicker("setDate", scheduleDate);
        });
        $("#inputDate").datepicker().datepicker("setDate", scheduleDate);

        // 구간이력사항
        GET_CONSTRUCTION(scheduleUID).then((res) => {
            setHistory(res.data);
        });

        // 파일리스트
        listsFecth();

        // 누적면적
        GET_TOTAL_AREA(gsdProjectUID).then((res) => {
            totalArea = Number(res.data[0].totalArea);
            $("#totalArea").val(totalArea);
        });
    });

    $("#handleAddCalendar").click(function () {
        $(".add-calendar").append(`
				<div class="form-group form-group-default position-relative ml-2" style="width: 130px;">
					<label for="companyName" class="placeholder">입고일</label>
					<input type="text" class="form-control datepicker2">
					<button type="button" class="delete-calendar">
						<i class="fas fa-plus-circle"></i>
					</button>
				</div>
			`);

        $(".datepicker2").datepicker();
    });

    $(document).on("click", ".delete-calendar", function () {
        $(this).parents(".form-group").remove();
    });

    // 입고면적 자동계산
    $("#deckArea").keyup(function () {
        const val = Number($(this).val());

        $("#totalArea").val(totalArea + val);
    });

    // 공사 - 데크보 등록/저장
    $("#handleSgdSubmit").click(function () {
        // 입고면적 입력
        // TODO: 입고 확정시 /index-dj-dexk 여기 면적 올리는 함수 실행하기

        const dkbDesignDate = $("#dkbDesignDate").val();
        const floor = $("#floor").val();
        const section = $("#section").val();
        const area = $("#area").val();
        const strup = $("#strup").val();
        const dkbCnt = $("#dkbCnt").val();
        const standardPjInputDate = $("#pjInputDate").val();
        const standardInputDate = $("#inputDate").val();

        if (!floor) return alertError("층을 입력하세요.");
        if (!section) return alertError("구간을 입력하세요.");
        if (!area) return alertError("면적을 입력하세요.");
        if (!strup) return alertError("스트럽을 입력하세요.");
        if (!dkbCnt) return alertError("부재수를 입력하세요.");

        const pjInputDate = moment(dkbDesignDate)
            .add(standardPjInputDate, "d")
            .format("YYYY-MM-DD");
        const inputDate = moment(pjInputDate)
            .add(standardInputDate, "d")
            .format("YYYY-MM-DD");

        if (isSubmitType) {
            POST_DESIGN(
                dkbDesignDate,
                floor,
                section,
                area,
                strup,
                dkbCnt,
                pjInputDate,
                inputDate
            );
        } else {
            PUT_DESIGN(
                dkbDesignDate,
                floor,
                section,
                area,
                strup,
                dkbCnt,
                pjInputDate,
                inputDate
            );
        }
    });

    // 특이사항 NOTE 메모
    $("#handleFileMemo").click(function () {
        const etcNote = $("#etcNote").val();

        if (!etcNote) return alertError("내용을 작성하세요.");

        PUT_ETC_NOTE(etcNote);
    });

    // 자료 삭제
    $(document).on("click", ".gsd-delete", function () {
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
            if (res) DELETE_PROJECT_GSD_GISUNG(uid);
        });
    });

    // 승인도면 업로드
    // $("#handleFileGsdSeung").click(function () {
    //     const file = $("#file-gsd-seung")[0];

    //     if (file.files.length === 0) return alertError("파일을 첨부하세요.");

    //     POST_SGD_FILE("공사", "승인도면_BOM_CP_스트럽", file.files);
    // });

    // 코너철판 업로드
    // $("#handleFileGsdCorner").click(function () {
    //     const file = $("#file-gsd-corner")[0];

    //     if (file.files.length === 0) return alertError("파일을 첨부하세요.");

    //     POST_SGD_FILE("공사", "코너철판(변경)도면", file.files);
    // });

    // 송장 업로드
    // $("#handleFileGsdSong").click(function () {
    //     const file = $("#file-gsd-song")[0];

    //     if (file.files.length === 0) return alertError("파일을 첨부하세요.");

    //     POST_SGD_FILE("공사", "송장_색도면_상차사진", file.files);
    // });

    // 난간대/설치팀
    $(document).on("click", ".handleProjectSeolchi", function () {
        const productUid = $(this).data("uid");
        const name = $(this).data("name");
        const code = $(this).data("code");

        gsdProjectUID = productUid;
        scheduleCode = code;

        listsFecthGisung();

        $(".nomu-title").text(name);
    });

    // 난간대/설치팀
    $("#handleFileSeolchi").click(function () {
        const file = $("#file-sul-nan")[0];
        const val = $("#file-sul-nan-memo").val();

        if (file.files.length === 0 && !val)
            return alertError("메모 또는 파일첨부 하세요.");

        POST_PROJECT_FILE("공사", "난간대_설치팀", file.files, val);
    });
});
