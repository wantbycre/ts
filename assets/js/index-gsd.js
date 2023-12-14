let gsdProjectUID = 0;
let scheduleUID = 0;
let divUID = 0;
let scheduleCode = "";
let scheduleDate = "";
let isSubmitType = true; // t = 신규, f = 수정
let totalArea = 0;
let divData = [];
let currentStts = 0;
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
    ); //.filter((n) => n.UID === 12);

    let divCount = 1;

    console.log(sttsData);

    sttsData.forEach((data, i) => {
        if (
            data.scheduleUID === sttsData[i + 1]?.scheduleUID ||
            data.scheduleUID === sttsData[i - 1]?.scheduleUID
        ) {
            divData.push(data);

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
						class="aps-button v3 active ${data.stts === 7 ? `green blur` : `green`}"
						data-stts="${data.stts}"
						data-product-uid="${data.UID}"
						data-schedule-uid="${data.scheduleUID}"
						data-div-uid="${data.divUID}"
					>
						<div class="d-flex">
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
							<div class="aps-side">
								${
                                    data.etcNote
                                        ? `
											<div class="aps-memo">
												<span>메모</span>
											</div>`
                                        : ``
                                }
								<div>
									<span>${data.scheduleUID}<br />-<br />${divCount}</span>
								</div>
							</div>
						</div>
					</button>
				</div>
			`);

            divCount++;
        } else if (data.etcNote) {
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
						class="aps-button v3 active ${data.stts === 7 ? `green blur` : `green`}"
						data-stts="${data.stts}"
						data-product-uid="${data.UID}"
						data-schedule-uid="${data.scheduleUID}"
						data-div-uid="${data.divUID}"
					>
						<div class="d-flex">
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
							<div class="aps-side">
								<div class="aps-memo">
									<span>메모</span>
								</div>
							</div>
						</div>
					</button>
				</div>
			`);
        } else {
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
					class="aps-button active ${data.stts === 7 ? `green blur` : `green`}"
					data-stts="${data.stts}"
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

            divCount = 1;
        }
    });
}

// 공사 입고확정
function PUT_CONSTRUCTION_SUC() {
    http({
        method: "PUT",
        url: "construction/suc",
        data: {
            divUID,
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
        // console.log(res.data);
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
        url: "project/totalDeckArea/" + projectUID,
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

// 공사 입고일정 변경
function PUT_CONSTRUCTION(inputDate) {
    http({
        method: "PUT",
        url: "construction",
        data: {
            scheduleUID,
            divUID,
            inputDate,
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

// 공사 분할입고 추가
function POST_CONSTRUCTION(inputDate) {
    http({
        method: "POST",
        url: "construction/div",
        data: {
            scheduleUID,
            inputDate,
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

// 공사 분할입고 제거
async function DELETE_CONSTRUCTION(deleteDivUID) {
    const res = await http({
        method: "DELETE",
        url: "construction/" + deleteDivUID,
    });
    return res;
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
        const divUid = $(this).data("div-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parent().data("date");
        const stts = $(this).data("stts");

        gsdProjectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;
        divUID = divUid;
        currentStts = stts;

        $(".modal-gongsa").modal();
        $(".add-calendar .empty-add-section").remove();

        // stts 6번일 경우만 입고확정 가능
        // stts 7번일 경우 수정 불가
        if (stts === 6) {
            $("#handleGsdSubmit").attr("disabled", false);
        }

        // # inputDate 기준 무조건
        // 구간 분할 입고 내용출력
        GET_DESIGN_DETAIL(scheduleUID).then((res) => {
            const data = res.data[0];

            // DECK 정보
            if (data.deckInputDate) {
                const dkbDateMonth = moment(data.deckInputDate).format("MM");
                const dkbDateDay = moment(data.deckInputDate).format("DD");

                $(".deck-month").text(dkbDateMonth);
                $(".deck-day").text(dkbDateDay);
            }

            $("#deckArea").val(data.deckArea);

            // 특이 사항 NOTE
            $("#etcNote").val(data.etcNote);

            // 옵저버 설정
            const sessionPtKey = sessionStorage.getItem("ptKey");
            if (sessionPtKey !== "null") {
                $(
                    ".handleDateChange, #handleAddCalendar, #handleGsdSubmit, #handleFileMemo"
                ).hide();
                $("input[type=text], textarea").attr("readonly", true);
            }
        });

        const uniqueObjArr = [
            ...new Map(divData.map((obj) => [obj.divUID, obj])).values(),
        ];

        const match = uniqueObjArr.filter((n) => n.scheduleUID === scheduleUID);

        if (match.length > 0) {
            match.forEach((el, i) => {
                if (i >= 1) {
                    $(".add-calendar").append(`
						<div class="d-flex calendar-delete-section empty-add-section" data-div-uid="${
                            el.divUID
                        }">
							<div class="form-group form-group-default ml-2" style="width: 150px;">
								<label for="" class="placeholder">분할 입고일 ${i + 1}</label>
								<input id="" type="text" class="form-control date-picker-class" value="${
                                    el.inputDate
                                }">
							</div>

							<button type="button" class="btn btn-primary fw-bold ml-2 handleDateChangeDiv"
								style="height: 60px;">일정등록</button>
							<button type="button" class="btn btn-danger fw-bold ml-2 delete-calendar-data"
								style="height: 60px;">제거</button>

						</div>
					`);
                } else {
                    $("#inputDate")
                        .datepicker()
                        .datepicker("setDate", el.inputDate);
                }
            });

            $(".date-picker-class").datepicker();
        } else {
            GET_DESIGN_DETAIL(scheduleUID).then((res) => {
                const data = res.data[0];

                // 입고일
                $("#inputDate")
                    .datepicker()
                    .datepicker("setDate", data.inputDate);
            });
        }

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

    // 구간분할 추가
    $("#handleAddCalendar").click(function () {
        // console.log(currentStts);

        if (currentStts !== 3)
            return alertError("설계완료 상태에서만 구간분할이 가능합니다.");

        $(".add-calendar").append(`
				<div class="d-flex calendar-delete-section empty-add-section">
					<div class="form-group form-group-default ml-2" style="width: 150px;">
						<label for="" class="placeholder">입고일</label>
						<input id="" type="text" class="form-control date-picker-class">
					</div>

					<button type="button" class="btn btn-primary fw-bold ml-2 handleDateDivChange"
						style="height: 60px;">일정등록</button>
					<button type="button" class="btn btn-danger fw-bold ml-2 delete-calendar"
						style="height: 60px;">제거</button>

				</div>
			`);

        $(".date-picker-class").datepicker();
    });

    // 구간분할 제거 - UI
    $(document).on("click", ".delete-calendar", function () {
        $(this).parents(".calendar-delete-section").remove();
    });

    // 구간분할 제거 - UI + Data
    $(document).on("click", ".delete-calendar-data", function () {
        const deleteDivUID = $(this)
            .parents(".calendar-delete-section")
            .data("div-uid");

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
                DELETE_CONSTRUCTION(deleteDivUID).then((res) => {
                    if (res.status === 200) {
                        location.href = "/index-gsd.html";
                    }
                });
            }
        });
    });

    // 공사 - 일정등록 최초
    $(document).on("click", ".handleDateChange", function () {
        const inputDate = $("#inputDate").val();
        PUT_CONSTRUCTION(inputDate);
    });

    // 공사 - 일정등록 분할
    $(document).on("click", ".handleDateDivChange", function () {
        const inputDate = $(this).prev("div").find("input").val();
        POST_CONSTRUCTION(inputDate);
    });

    // 공사 - 분할 컨텐츠 일정변경
    $(document).on("click", ".handleDateChangeDiv", function () {
        const inputDate = $(this).prev("div").find("input").val();
        divUid = $(this).parents(".calendar-delete-section").data("div-uid");

        PUT_CONSTRUCTION(inputDate);
    });

    // 입고면적 자동계산
    $("#deckArea").keyup(function () {
        const val = Number($(this).val());

        $("#totalArea").val(totalArea + val);
    });

    // 공사 - 데크보 등록/저장
    $("#handleGsdSubmit").click(function () {
        swal("입고 확정하시겠습니까?", {
            icon: "success",
            buttons: {
                confirm: {
                    text: "네, 입고확정하겠습니다.",
                    className: "btn btn-success",
                },
                cancel: {
                    text: "아니요",
                    visible: true,
                    className: "btn btn-default btn-border",
                },
            },
        }).then((res) => {
            if (res) {
                PUT_CONSTRUCTION_SUC();
            }
        });
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
