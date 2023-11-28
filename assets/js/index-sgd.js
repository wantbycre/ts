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
    const sgdArray = DATAS.filter((n) => n.stts === 3);

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
					class="aps-button active ${data.cnStts === 8 ? `brown` : ``}"
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

        // TODO: 코너철판은 cnStts 번호보고 갈색 및 데이터 넣어주기
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

// 설계 자료 조회
async function GET_DESIGN_FILE(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "design/file/" + scheduleUID,
    });

    return res.data;
}

// 설계 자료 업로드
async function POST_SGD_FILE(filePath, fileType, files) {
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

// 공통자료 리스트 업데이트
function listsSgdFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        // console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "승인도면":
                    $("#content-sgd-seung").append(lists(el));
                    break;
                case "변경승인도면":
                    $("#content-sgd-byon").append(lists(el));
                    break;
                case "승인요청서":
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
    // 설계-데크보 입력 팝업
    $(document).on("click", ".aps-button", function () {
        const productUid = $(this).parents("tr").data("uid");
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parent().data("date");

        projectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

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

                $("#floor").val(data.floor);
                $("#section").val(data.section);
                $("#area").val(data.area);
                $("#strup").val(data.strup);
                $("#dkbCnt").val(data.dkbCnt);
                $("#pjInputDate").val(pjInputDate).attr("selected", "selected");
                $("#inputDate").val(inputDate).attr("selected", "selected");
                $("#dkbDesignDate").datepicker().datepicker("setDate", dkbDate);
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

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_SGD_FILE("설계", "승인도면", file.files);
    });

    // 변경승인도면 업로드
    $("#handleFileSgdByon").click(function () {
        const file = $("#file-sgd-byon")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_SGD_FILE("설계", "변경승인도면", file.files);
    });

    // 승인요청서 업로드
    $("#handleFileSgdYo").click(function () {
        const file = $("#file-sgd-yo")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_SGD_FILE("설계", "승인요청서", file.files);
    });
});
