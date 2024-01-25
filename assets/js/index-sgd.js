// let projectUID = 0;
let scheduleUID = 0;
let scheduleCode = "";
let scheduleDate = "";
let isSubmitType = true; // t = 신규, f = 수정
let emailFile = [];

let currentDkbDesignDate = "";
let currentPjInputDate = "";
let currentInputDate = "";

let setFloor = "";
let setSection = "";

/**
 *
 * common-project 호출하는 함수
 * @param {Array} DATAS - 실제 데이터
 * @param {Array} thisYear - 해당 년
 * @param {Array} thisMonth - 해당 월
 */
function SET_CLASS_PROJECT(DATAS, thisYear, thisMonth) {
    const sttsData = DATAS.filter((n) => n.stts === 3 || n.stts === 4);

    // const uniqueScheduleUID = [
    //     ...new Map(sttsData.map((obj) => [obj.scheduleUID, obj])).values(),
    // ];

    // console.log(sttsData);

    sttsData.forEach((data, i) => {
        if (data.scheduleUID !== sttsData[i - 1]?.scheduleUID) {
            $(
                "#chart-content table[data-index=" +
                    (thisYear + thisMonth) +
                    "] tbody tr[data-uid=" +
                    data.UID +
                    "] td[data-date=" +
                    data.dkbDesignDate +
                    "] .add-section .nbsp"
            ).remove();

            $(
                "#chart-content table[data-index=" +
                    (thisYear + thisMonth) +
                    "] tbody tr[data-uid=" +
                    data.UID +
                    "] td[data-date=" +
                    data.dkbDesignDate +
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
    inputDate,
    dkbChangeType,
    sgChangeType
) {
    // console.log(dkbChangeType, sgChangeType);
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
            dkbChangeType,
            sgChangeType,
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
                sessionStorage.setItem("left", dkbDesignDate);
                location.href = "/index-sgd.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 자료 삭제
function DELETE_PROJECT_SGD(UID) {
    http({
        method: "DELETE",
        url: "design/" + UID,
    })
        .then((res) => {
            listsSgdFecth();
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 설계 자료 조회
async function GET_DESIGN_FILE(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "design/file/" + scheduleUID,
    });

    return res.data;
}

// 설계 자료 업로드
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
                listsSgdFecth();
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

// 공통자료 상세 리스트
function lists(el) {
    // FIXME: 2024-01-04 옵저버 풀어주는 보수사항, 재사용시 아래 조건문 넣어주기
    // const sessionPtKey = sessionStorage.getItem("ptKey");
    // ${
    // 	sessionPtKey === "FIEXME"
    // 		? `<a href="#" type="button" class="btn-delete sgd-delete" data-uid="${el.UID}">
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
			<a href="#" type="button" class="btn-delete sgd-delete" data-uid="${el.UID}">
				<i class="fas fa-plus text-danger"></i>
			</a>
		</div>
	`;
}

// 공통자료 리스트 업데이트
function listsSgdFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        // console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "승인도면_BOM_CP_스트럽":
                    emailFile.push(el);
                    $("#content-sgd-seung").append(lists(el));
                    break;
                case "변경승인도면_BOM_CP_스트럽":
                    emailFile.push(el);
                    $("#content-sgd-byon").append(lists(el));
                    break;
                case "승인요청서":
                    emailFile.push(el);
                    $("#content-sgd-yo").append(lists(el));
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

function POST_MAIL(email, subject, content, fileData) {
    http({
        method: "POST",
        url: "mail",
        data: {
            email,
            subject,
            content,
            fileData,
        },
    })
        .then((res) => {
            swal("이메일 전송이 완료되었습니다.", {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((_) => {
                emailFile = [];
                $(".modal-email").modal("hide");
            });
        })
        .catch((error) => {
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
구간명: ${setFloor}F-${setSection}구간
발송일: ${moment().format("YYYY-MM-DD")}`,
        },
    });
}

$(function () {
    setTimeout(() => {
        $("#chart-content tbody tr td .add-section > div.d-flex:last-child")
            .append(`
			<button type="button" class="aps-plus">
				<span><i class="fas fa-plus"></i></span>
			</button>
		`);
    }, 300);

    Kakao.init(kakaoKey); // 사용하려는 앱의 JavaScript 키 입력

    // 설계-데크보 입력 팝업
    $(document).on("click", ".aps-button, .aps-plus", function () {
        const productUid = $(this).parents("tr").data("uid");
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const tdDate = $(this).parents("td").data("date");
        const date = $(this).parent().data("date");

        projectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = tdDate || date;

        $("#sender").val(emailSender);
        $(".modal-seol").modal();

        listsSgdFecth();

        // 수정
        if ($(this).hasClass("active")) {
            isSubmitType = false;

            GET_DESIGN_DETAIL(scheduleUID).then((res) => {
                const data = res.data[0];
                const dkbDate = data.dkbDesignDate;
                const pjDate = data.pjInputDate;
                const ipDate = data.inputDate;
                const pjInputDate = moment(pjDate).diff(
                    moment(dkbDate),
                    "days"
                );
                const inputDate = moment(ipDate).diff(moment(pjDate), "days");

                setFloor = data.floor;
                setSection = data.section;

                currentDkbDesignDate = dkbDate;
                currentPjInputDate = pjDate;
                currentInputDate = ipDate;

                $("#floor").val(data.floor);
                $("#section").val(data.section);
                $("#area").val(parseFloat(data.area.toFixed(3)));
                $("#strup").val(parseFloat(data.strup.toFixed(3)));
                $("#dkbCnt").val(data.dkbCnt);
                $("#pjInputDate").val(pjInputDate).attr("selected", "selected");
                $("#inputDate").val(inputDate).attr("selected", "selected");
                $("#dkbDesignDate").datepicker().datepicker("setDate", dkbDate);

                // 이메일 보내기 문구
                const emailText = `●태성건업 설계도면 발송공지●\n현장명: ${scheduleCode}\n구간명: ${setFloor}F-${setSection}구간\n발송일: ${moment().format(
                    "YYYY-MM-DD"
                )}`;

                $("#content").val(emailText);

                // console.log("emailText", emailText);
            });
        } else {
            // 신규
            $("#floor").val("");
            $("#section").val("");
            $("#area").val("");
            $("#strup").val("");
            $("#dkbCnt").val("");
            $("#pjInputDate").val(10);
            $("#inputDate").val(5);

            // 설계일자 세팅
            isSubmitType = true;
            $("#dkbDesignDate")
                .datepicker()
                .datepicker("setDate", scheduleDate);
        }

        // FIXME: 2024-01-04 옵저버 풀어주는 보수사항
        // 옵저버 설정
        const sessionPtKey = sessionStorage.getItem("ptKey");
        if (sessionPtKey !== "null") {
            // $("#kakaotalk-sharing-btn, #share-email, #handleSgdSubmit").hide();
            // $("input[type=text], textarea").attr("readonly", true);
        } else {
            // $(".auth-display").attr("style", "display: flex !important");
        }
    });

    // 설계 - 데크보 등록/저장
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

        const dkbChangeType = currentDkbDesignDate === dkbDesignDate ? 0 : 1;

        const sgChangeType =
            currentPjInputDate === pjInputDate && currentInputDate === inputDate
                ? 0
                : 1;

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
                inputDate,
                sgChangeType,
                dkbChangeType
            );
        }
    });

    // 자료 삭제
    $(document).on("click", ".sgd-delete", function () {
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
            if (res) DELETE_PROJECT_SGD(uid);
        });
    });

    // 이메일 공유 2중팝업 처리
    $(document).on(
        {
            "show.bs.modal": function () {
                const zIndex = 2040;

                $(this).css("z-index", zIndex);

                setTimeout(function () {
                    $(".modal-backdrop")
                        .not(".modal-stack")
                        .css("z-index", zIndex - 1)
                        .addClass("modal-stack");
                }, 0);
            },
            "hidden.bs.modal": function () {
                setTimeout(function () {
                    $(".modal-backdrop")
                        .css("z-index", 1040)
                        .addClass("modal-stack");
                    $("body").addClass("modal-open");
                }, 0);
            },
        },
        ".modal-email"
    );

    // 승인도면 업로드
    $("#handleFileSgdSeung").click(function () {
        const file = $("#file-sgd-seung")[0];

        if (!scheduleUID)
            return alertError("설계일 등록 후 파일첨부 가능합니다.");
        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_DESIGN_FILE("설계", "승인도면_BOM_CP_스트럽", file.files);
    });

    // 변경승인도면 업로드
    $("#handleFileSgdByon").click(function () {
        const file = $("#file-sgd-byon")[0];

        if (!scheduleUID)
            return alertError("설계일 등록 후 파일첨부 가능합니다.");
        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_DESIGN_FILE("설계", "변경승인도면_BOM_CP_스트럽", file.files);
    });

    // 승인요청서 업로드
    $("#handleFileSgdYo").click(function () {
        const file = $("#file-sgd-yo")[0];

        if (!scheduleUID)
            return alertError("설계일 등록 후 파일첨부 가능합니다.");
        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_DESIGN_FILE("설계", "승인요청서", file.files);
    });

    //     Kakao.init(kakaoKey); // 사용하려는 앱의 JavaScript 키 입력
    //     Kakao.Share.createDefaultButton({
    //         container: "#kakaotalk-sharing-btn",
    //         objectType: "text",
    //         text: `●태성건업 설계도면 발송공지●
    // 현장명: ${scheduleCode}
    // 구간명: 설계-데크보
    // 발송일: ${moment().format("YYYY-MM-DD")}`,
    //         link: {
    //             // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
    //             mobileWebUrl: "https://developers.kakao.com",
    //             webUrl: "https://developers.kakao.com",
    //         },
    //     });

    // 이메일 보내기
    $("#handleEmailSend").click(function () {
        const emailVal = $("#email").val();
        const subject = $("#subject").val();
        const content = $("#content").val();
        let fileData = [];

        if (!emailVal) return alertError("받는사람을 입력하세요.");
        if (!content) return alertError("내용을 입력하세요.");

        // sort ㄱ~ㅎ
        const sortEmail = emailFile.sort((a, b) =>
            a.fileName.localeCompare(b.fileName)
        );

        sortEmail.forEach((n) => {
            fileData.push({
                fileName: n.fileName,
                filePath: `${domain}/${n.filePath}`,
            });
        });

        const email = emailVal.replace(/\n\s*/g, "").split(",");

        POST_MAIL(email, subject, content.replace(/\n/g, "<br>"), fileData);
    });
});
