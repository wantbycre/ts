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
    console.log(DATAS, thisYear, thisMonth);

    // 설계 완료 데이터만 추출
    const sgdArray = DATAS.filter((n) => n.stts === 3);

    // FIXME: cnCnt 를 넣어줘야 함.

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
    						<div>${data.cnCnt || 0}</div>
    					</div>
    				</div>
    			</button>
    		`);

        // TODO: 코너철판은 cnStts 번호보고 갈색 및 데이터 넣어주기
        // GITTEST
    });

    // console.log(sgdArray);
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
                location.href = "/index-sgd-corner.html";
            });
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
                case "코너철판설계도면":
                    $("#content-sgd-sul").append(lists(el));
                    break;
                case "코너철판변경설계도면":
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
    // 설계-코너철판 입력 팝업
    $(document).on("click", ".aps-button", function () {
        if (!$(this).hasClass("active")) return;

        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parent().data("date");

        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-seol").modal();

        listsSgdFecth();

        GET_DESIGN_DETAIL(scheduleUID).then((res) => {
            console.log(res.data);

            const data = res.data[0];
            const cnOutputDate = moment(data.cnOutputDate).diff(
                moment(data.cnInputDate),
                "days"
            );

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
        });
    });

    // 설계 - 코너철판 등록/저장
    $("#handleSgdSubmit").click(function () {
        const cnDesignDate = $("#cnDesignDate").val();
        const cnCnt = $("#cnCnt").val();
        const cnInputDate = $("#cnInputDate").val();
        const standardCnOutputDate = $("#cnOutputDate").val();

        if (!cnCnt) return alertError("부재수를 입력하세요.");

        const cnOutputDate = moment(cnInputDate)
            .add(standardCnOutputDate, "d")
            .format("YYYY-MM-DD");

        PUT_DESIGN(cnDesignDate, cnCnt, cnInputDate, cnOutputDate);
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

        POST_SGD_FILE("설계", "코너철판설계도면", file.files);
    });

    // 코너철판 변경설계도면 업로드
    $("#handleFileSgdBsul").click(function () {
        const file = $("#file-sgd-bsul")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_SGD_FILE("설계", "코너철판변경설계도면", file.files);
    });
});
