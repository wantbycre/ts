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
    console.log(DATAS, thisYear, thisMonth);

    // 설계 완료 데이터만 추출
    // 설계완료 / 코너철판입고전
    const sgdArray = DATAS.filter((n) => n.stts === 3 || n.stts === 4);

    // TODO: DECK 입고일과 면적 올리고 status를 어떤걸로..? stts 애매하면 deckInputDate 입고일 t/f가능

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
					class="aps-button active ${data.cnStts === 9 ? `pink` : `pink`}"
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
}

// 공장 - DECK 입력
function PUT_FACTORY(deckArea, deckInputDate) {
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
                location.href = "/index-gj-deck.html";
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

// DECK 자료 조회
async function GET_DESIGN_FILE(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "design/file/" + scheduleUID,
    });

    return res.data;
}

// DECK 상세 리스트
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

// DECK 리스트 업데이트
function listsSgdFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        // console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "DECK":
                    $("#content-deck").append(lists(el));
                    break;
                default:
                    return;
            }
        });
    });
}

// DECK 자료 업로드
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
        const date = $(this).parent().data("date");

        projectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-deck").modal();
        $("#deckInputDate").datepicker();

        listsSgdFecth();

        GET_DESIGN_DETAIL(scheduleUID).then((res) => {
            const data = res.data[0];
            const today = moment(new Date()).format("YYYY-MM-DD");

            $("#floor").val(data.floor);
            $("#section").val(data.section);

            // TODO: DECK 입고일(data.deckInputDate)이 필요한가? 지금은 new Date()로 처리
            $("#deckInputDate").datepicker().datepicker("setDate", today);
        });
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

        POST_SGD_FILE("공장", "DECK", file.files);
    });
});
