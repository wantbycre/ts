let projectUID = 0;
let divUID = 0;
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
        (n) => n.stts === 3 || n.stts === 4 || n.stts === 5 || n.stts === 6
    );

    console.log(sttsData);

    let divCount = 1;

    sttsData.forEach((data, i) => {
        let sttsColor = ``;

        if (data.stts === 5) {
            sttsColor = `purple`;
        } else {
            if (data.stts === 6) {
                sttsColor = `green`;
            } else {
                sttsColor = `gray`;
            }
        }

        if (
            data.scheduleUID === sttsData[i + 1]?.scheduleUID ||
            data.scheduleUID === sttsData[i - 1]?.scheduleUID
        ) {
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
						class="aps-button v3 active ${sttsColor}"
						data-product-uid="${data.UID}"
						data-schedule-uid="${data.scheduleUID}"
						data-div-uid="${data.divUID}"
						data-stts="${data.stts}"
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
						class="aps-button v3 active ${sttsColor}"
						data-product-uid="${data.UID}"
						data-schedule-uid="${data.scheduleUID}"
						data-div-uid="${data.divUID}"
						data-stts="${data.stts}"
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
						class="aps-button active ${sttsColor}"
						data-product-uid="${data.UID}"
						data-schedule-uid="${data.scheduleUID}"
						data-div-uid="${data.divUID}"
						data-stts="${data.stts}"
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

// 공장 - 조립공장 입력
function PUT_FACTORY(stts) {
    http({
        method: "PUT",
        url: "factory/jr",
        data: {
            divUID,
            stts,
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
                location.href = "/index-gj-jr.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 자료 삭제
function DELETE_PROJECT_GJ_JR(UID) {
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

// 조립공장 자료 조회
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

// 조립공장 상세 리스트
function lists(el, bool) {
    const sessionPtKey = sessionStorage.getItem("ptKey");

    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 14px;"></i>
				${el.fileName}
			</a>
			${
                bool
                    ? sessionPtKey === "null"
                        ? `
						<a href="#" type="button" class="btn-delete gj-jr-delete" data-uid="${el.UID}">
							<i class="fas fa-plus text-danger"></i>
						</a>`
                        : ``
                    : ``
            }
			
		</div>
	`;
}

// 기성 상세 리스트
function lists2(el) {
    // FIXME: 2024-01-04 옵저버 풀어주는 보수사항, 재사용시 아래 조건문 넣어주기
    // const sessionPtKey = sessionStorage.getItem("ptKey");
    // ${
    // 	sessionPtKey === "null"
    // 		? `
    // 			<a href="#" type="button" class="btn-delete gj-jr-gisung" data-uid="${el.UID}">
    // 				<i class="fas fa-plus text-danger"></i>
    // 			</a>`
    // 		: ``
    // }

    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 14px;"></i>
				${el.fileName}
			</a>
			<a href="#" type="button" class="btn-delete gj-jr-gisung" data-uid="${el.UID}">
				<i class="fas fa-plus text-danger"></i>
			</a>
		</div>
	`;
}

// 조립공장 리스트 업데이트
function listsFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        // console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "변경승인도면_BOM_CP_스트럽":
                    $("#content-gsd-seung").append(lists(el, false));
                    break;
                case "송장_색도면_상차사진":
                    $("#content-jr").append(lists(el, true));
                    break;
                default:
                    return;
            }
        });
    });
}

// 조립공장 자료 업로드
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
                case "조립공장_기성":
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

// 기성 자료 삭제
function DELETE_PROJECT_GJ_JR_GISUNG(UID) {
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

function kakaoShare() {
    Kakao.Share.sendCustom({
        templateId: templateId,
        templateArgs: {
            text: `●태성건업 설계도면 발송공지●
현장명: ${scheduleCode}
구간명: 설계-조립공장
발송일: ${moment().format("YYYY-MM-DD")}`,
        },
    });
}

$(function () {
    Kakao.init(kakaoKey); // 사용하려는 앱의 JavaScript 키 입력

    // 공장-조립공장 입력 팝업
    $(document).on("click", ".aps-button.active", function () {
        const productUid = $(this).parents("tr").data("uid");
        const divUid = $(this).data("div-uid");
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parents("td").data("date");
        const stts = $(this).data("stts");

        switch (stts) {
            case 4:
                $("#handlePurpleSubmit").attr("disabled", false);
                $("#handleGreenSubmit").attr("disabled", true);
                break;
            case 5:
                $("#handlePurpleSubmit").attr("disabled", true);
                $("#handleGreenSubmit").attr("disabled", false);
                break;
            case 6:
                $("#handlePurpleSubmit").attr("disabled", true);
                $("#handleGreenSubmit").attr("disabled", true);
                break;
            default:
                null;
        }

        projectUID = productUid;
        divUID = divUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-jorip").modal();
        $("#deckInputDate").datepicker();

        listsFecth();

        // 옵저버 설정
        const sessionPtKey = sessionStorage.getItem("ptKey");
        if (sessionPtKey !== "null") {
            // $(
            //     "#kakaotalk-sharing-btn, #handlePurpleSubmit, #handleGreenSubmit"
            // ).hide();
        } else {
            // $(".auth-display").attr("style", "display: flex !important");
        }
    });

    // 자료 삭제
    $(document).on("click", ".gj-jr-delete", function () {
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
            if (res) DELETE_PROJECT_GJ_JR(uid);
        });
    });

    // 공장 - 조립공장 제작완료 등록
    $("#handlePurpleSubmit").click(function () {
        PUT_FACTORY(5);
    });

    // 공장 - 조립공장 입고확정 등록
    $("#handleGreenSubmit").click(function () {
        PUT_FACTORY(6);
    });

    // 공장 - 조립공장 송장_색도면_상차사진 업로드
    $("#handleFileJr").click(function () {
        const file = $("#file-jr")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_DESIGN_FILE("공장", "송장_색도면_상차사진", file.files);
    });

    // 공장-조립공장 기성 팝업
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

    // 공장-조립공장 기성 업로드
    $("#handleFileGisung").click(function () {
        const file = $("#file-gisung")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PROJECT_FILE("공장", "조립공장_기성", file.files);
    });

    // 기성 자료 삭제
    $(document).on("click", ".gj-jr-gisung", function () {
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
            if (res) DELETE_PROJECT_GJ_JR_GISUNG(uid);
        });
    });

    //     Kakao.init(kakaoKey); // 사용하려는 앱의 JavaScript 키 입력
    //     Kakao.Share.createDefaultButton({
    //         container: "#kakaotalk-sharing-btn",
    //         objectType: "text",
    //         text: `●태성건업 설계도면 발송공지●
    // 현장명: ${scheduleCode}
    // 구간명: 설계-조립공장
    // 발송일: ${moment().format("YYYY-MM-DD")}`,
    //         link: {
    //             // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
    //             mobileWebUrl: "https://developers.kakao.com",
    //             webUrl: "https://developers.kakao.com",
    //         },
    //     });
});
