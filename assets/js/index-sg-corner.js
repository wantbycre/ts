let scheduleUID = 0;
let scheduleCode = "";
let scheduleDate = "";
let emailFile = [];

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

    console.log(sttsData);

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
					class="aps-button active"
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

// 코너철판 등록수정
function PUT_DESIGN(cnDesignDate, cnCnt, cnInputDate, cnOutputDate) {
    http({
        method: "PUT",
        url: "design/corner",
        data: {
            scheduleUID,
            cnDesignDate, // 코너 설계일
            cnCnt, // 수량 - 부재수
            cnInputDate, // 제작완료일
            cnOutputDate, // 현장입고일
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
                location.href = "/index-sg-corner.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 자료 삭제
function DELETE_PROJECT_SG_CORNER(UID) {
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

// 코너철판 자료 조회
async function GET_DESIGN_FILE(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "design/file/" + scheduleUID,
    });

    return res.data;
}

// 코너철판 자료 업로드
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
			<a href="#" type="button" class="btn-delete sg-corner-delete" data-uid="${el.UID}">
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
                case "코너철판_설계도면":
                    emailFile.push(el);
                    $("#content-sgd-sul").append(lists(el));
                    break;
                case "코너철판_변경설계도면":
                    emailFile.push(el);
                    $("#content-sgd-bsul").append(lists(el));
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
    Kakao.init(kakaoKey); // 사용하려는 앱의 JavaScript 키 입력

    // 설계-코너철판 입력 팝업
    $(document).on("click", ".aps-button.active", function () {
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parents("td").data("date");

        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        // console.log("scheduleDate", scheduleDate);

        $("#sender").val(emailSender);
        $(".modal-seol").modal();

        listsSgdFecth();

        GET_DESIGN_DETAIL(scheduleUID).then((res) => {
            // console.log(res.data);

            const data = res.data[0];
            const cnOutputDate = moment(data.cnOutputDate).diff(
                moment(data.cnInputDate),
                "days"
            );

            setFloor = data.floor;
            setSection = data.section;

            $("#cnDesignDate")
                .datepicker()
                .datepicker(
                    "setDate",
                    data.cnDesignDate ? data.cnDesignDate : scheduleDate
                );

            $("#floor").val(data.floor);
            $("#section").val(data.section);
            $("#cnCnt").val(data.cnCnt);

            $("#cnInputDate")
                .datepicker()
                .datepicker(
                    "setDate",
                    data.cnInputDate ? data.cnInputDate : scheduleDate
                );

            $("#cnOutputDate").val(cnOutputDate || 10);

            // 이메일 보내기 문구
            const emailText = `●태성건업 설계도면 발송공지●\n현장명: ${scheduleCode}\n구간명: ${setFloor}F-${setSection}구간\n발송일: ${moment().format(
                "YYYY-MM-DD"
            )}`;

            $("#content").val(emailText);
        });

        // FIXME: 2024-01-04 옵저버 풀어주는 보수사항
        // 옵저버 설정
        const sessionPtKey = sessionStorage.getItem("ptKey");
        if (sessionPtKey !== "null") {
            // $("#kakaotalk-sharing-btn, #share-email, #handleSgdSubmit").hide();
            // $("input[type=text], textarea, select").attr("readonly", true);
        } else {
            // $(".auth-display").attr("style", "display: flex !important");
        }
    });

    // 설계 - 코너철판 등록/저장
    $("#handleSgdSubmit").click(function () {
        const cnDesignDate =
            $("#cnDesignDate").val() || moment().format("YYYY-MM-DD");
        const cnCnt = $("#cnCnt").val();
        const cnInputDate = $("#cnInputDate").val();
        const standardCnOutputDate = $("#cnOutputDate").val();

        if (!cnCnt) return alertError("부재수를 입력하세요.");

        const cnOutputDate = moment(cnInputDate)
            .add(standardCnOutputDate, "d")
            .format("YYYY-MM-DD");

        PUT_DESIGN(cnDesignDate, cnCnt, cnInputDate, cnOutputDate);
    });

    // 자료 삭제
    $(document).on("click", ".sg-corner-delete", function () {
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
            if (res) DELETE_PROJECT_SG_CORNER(uid);
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

    // 코너철판 설계도면 업로드
    $("#handleFileSgdSul").click(function () {
        const file = $("#file-sgd-sul")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_DESIGN_FILE("설계", "코너철판_설계도면", file.files);
    });

    // 코너철판 변경설계도면 업로드
    $("#handleFileSgdBsul").click(function () {
        const file = $("#file-sgd-bsul")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_DESIGN_FILE("설계", "코너철판_변경설계도면", file.files);
    });

    //     Kakao.init(kakaoKey); // 사용하려는 앱의 JavaScript 키 입력
    //     Kakao.Share.createDefaultButton({
    //         container: "#kakaotalk-sharing-btn",
    //         objectType: "text",
    //         text: `●태성건업 설계도면 발송공지●
    // 현장명: ${scheduleCode}
    // 구간명: 설계-코너철판
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
