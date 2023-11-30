// let projectUID = 0;
let scheduleUID = 0;
let scheduleCode = "";
let scheduleDate = "";
let isSubmitType = true; // t = 신규, f = 수정
/**
 *
 * common-project 호출하는 함수
 * @param {Array} DATAS - 실제 데이터
 * @param {Array} thisYear - 해당 년
 * @param {Array} thisMonth - 해당 월
 */
function SET_CLASS_PROJECT(DATAS, thisYear, thisMonth) {
    console.log(DATAS, thisYear, thisMonth);

    // 설계 완료 데이터만 추출
    const sgdArray = DATAS.filter((n) => n.stts === 6);

    sgdArray.forEach((data, i) => {
        $(
            "#chart-content table[data-index=" +
                (thisYear + thisMonth) +
                "] tbody tr[data-uid=" +
                data.UID +
                "] td[data-date=" +
                data.inputDate +
                "]"
        ).empty().append(`
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
    						<div></div>
    					</div>
    				</div>
    			</button>
    		`);
    });

    // console.log(sgdArray);
}

// 설계 등록
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
            projectUID,
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

// 히스토리 출력
function setHistory(data) {
    let result = "";

    // console.log(data);

    data.forEach((el) => {
        if (el.changeType === "데크보설계이력") {
            result += `
				<div class="text-danger">데크보 설계이력</div>
				설 계 일 :
				${moment(el.regDate).year()}년 
				${moment(el.regDate).month() + 1}월 
				${moment(el.regDate).date()}일<br />
				설계 변경일 1차 : 
				${moment(el.scheduleDate).year()}년 
				${moment(el.scheduleDate).month() + 1}월 
				${moment(el.scheduleDate).date()}일<br/><br/>
			`;
        } else if (el.changeType === "데크보입고이력") {
            result += `
				<div class="text-danger">데크보 입고이력</div>
				입 고 일 :
				${moment(el.regDate).year()}년 
				${moment(el.regDate).month() + 1}월 
				${moment(el.regDate).date()}일<br />
				입고일 변경 1차 : 
				${moment(el.scheduleDate).year()}년 
				${moment(el.scheduleDate).month() + 1}월 
				${moment(el.scheduleDate).date()}일<br/>
				데크보 분할입고이력<br />
				구간분할입고 1회차 :<br /><br />
			`;
        } else if (el.changeType === "코너철판설계이력") {
            result += `
				<div class="text-danger">코너철판 설계이력</div>
				코너 철판 설계일 :
				${moment(el.scheduleDate).year()}년 
				${moment(el.scheduleDate).month() + 1}월 
				${moment(el.scheduleDate).date()}일<br/><br />
			`;
        } else if (el.changeType === "코너철판입고이력") {
            result += `
				<div class="text-danger">코너철판 입고이력</div>
				코너 철판 입고일 :
				${moment(el.scheduleDate).year()}년 
				${moment(el.scheduleDate).month() + 1}월 
				${moment(el.scheduleDate).date()}일<br/><br />
			`;
        }
    });

    $("#gsd-history").html(result);
}

// 공사 자료 조회
async function GET_DESIGN_FILE(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "design/file/" + scheduleUID,
    });

    return res.data;
}

// 공사 자료 업로드
async function POST_SGD_FILE(filePath, fileType, files, memo) {
    const formData = new FormData();

    // 다중 파일
    for (let i = 0; i < files.length; i++) {
        formData.append(
            `project/${scheduleCode}/${filePath}/${fileType}`,
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
                listsSgdFecth();
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
			<a href="#" type="button" class="btn-delete" data-uid="${el.UID}">
				<i class="fas fa-plus text-danger"></i>
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
				<a href="#" type="button" class="btn-delete">
					<i class="fas fa-plus text-danger ml-1"></i>
				</a>
			</td>
		</tr>
	`;
}

// 공통자료 리스트 업데이트
function listsSgdFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        console.log(res.data);
        $(
            ".modal-gongsa .file-content, .modal-gongsa file-content tbody"
        ).empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "승인도면_BOM_CP_스트럽":
                    $("#content-gsd-seung").append(lists(el));
                    break;
                case "코너철판(변경)도면":
                    $("#content-gsd-corner").append(lists(el));
                    break;
                case "송장_색도면_상차사진":
                    $("#content-gsd-song").append(lists(el));
                    break;
                case "난간대_설치":
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

        projectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-gongsa").modal();

        console.log(scheduleDate);

        // FIXME: deckInputDate 이게 들어와야 하나? DECK입고일
        // FIXME: deckArea DECK입고일 / 입고면적 -> 사용자가 입력은 하나 기본 데이터는 얹어줘야하나?
        // FIXME: 누적면적 필요

        // TODO:  입고일정 변경은 수시로
        // TODO: 입고확정시 일정 변경 불가.

        $("#inputDate").datepicker().datepicker("setDate", scheduleDate);

        // 구간이력사항
        GET_CONSTRUCTION(scheduleUID).then((res) => {
            setHistory(res.data);
        });

        // 파일리스트
        listsSgdFecth();

        // 수정
        // if ($(this).hasClass("active")) {
        //     isSubmitType = false;

        //     GET_DESIGN_DETAIL(scheduleUID).then((res) => {
        //         const data = res.data[0];
        //         const dkbDate = data.dkbDesignDate;
        //         const pjDate = data.pjInputDate;
        //         const ipDate = data.inputDate;
        //         const pjInputDate = moment(pjDate).diff(
        //             moment(dkbDate),
        //             "days"
        //         );
        //         const inputDate = moment(ipDate).diff(moment(pjDate), "days");

        //         $("#floor").val(data.floor);
        //         $("#section").val(data.section);
        //         $("#area").val(data.area);
        //         $("#strup").val(data.strup);
        //         $("#dkbCnt").val(data.dkbCnt);
        //         $("#pjInputDate").val(pjInputDate).attr("selected", "selected");
        //         $("#inputDate").val(inputDate).attr("selected", "selected");
        //         $("#dkbDesignDate").datepicker().datepicker("setDate", dkbDate);
        //     });
        // } else {
        //     // 신규
        //     $("#floor").val("");
        //     $("#section").val("");
        //     $("#area").val("");
        //     $("#strup").val("");
        //     $("#dkbCnt").val("");
        //     $("#pjInputDate").val(10);
        //     $("#inputDate").val(5);

        //     // 설계일자 세팅
        //     isSubmitType = true;
        //     $("#dkbDesignDate")
        //         .datepicker()
        //         .datepicker("setDate", scheduleDate);
        // }
    });

    // 난간대/설치팀
    $(document).on("click", ".handleProjectSeolchi", function () {
        const scheduleUid = $(this).data("schedule-uid");
        scheduleUID = scheduleUid;

        // 파일리스트
        listsSgdFecth(scheduleUID);
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

    // 공사 - 데크보 등록/저장
    $("#handleSgdSubmit").click(function () {
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
    // FIXME: 여기 데이터 어디로~?
    $("#handleFileMemo").click(function () {
        const text = $("#gsd-text").val();

        if (!text) return alertError("내용을 작성하세요.");

        POST_SGD_FILE("공사", "NOTE", [], text);
    });

    // 승인도면 업로드
    $("#handleFileGsdSeung").click(function () {
        const file = $("#file-gsd-seung")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_SGD_FILE("공사", "승인도면_BOM_CP_스트럽", file.files);
    });

    // 코너철판 업로드
    $("#handleFileGsdCorner").click(function () {
        const file = $("#file-gsd-corner")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_SGD_FILE("공사", "코너철판(변경)도면", file.files);
    });

    // 송장 업로드
    $("#handleFileGsdSong").click(function () {
        const file = $("#file-gsd-song")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_SGD_FILE("공사", "송장_색도면_상차사진", file.files);
    });

    // 난간대/설치팀
    $("#handleFileSeolchi").click(function () {
        const file = $("#file-sul-nan")[0];
        const val = $("#file-sul-nan-memo").val();

        if (file.files.length === 0 && !val)
            return alertError("메모 또는 파일첨부 하세요.");

        POST_SGD_FILE("공사", "난간대_설치", file.files, val);
    });
});
