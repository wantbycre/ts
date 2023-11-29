// let projectUID = 0;
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
    const sgdArray = DATAS.filter((n) => n.stts === 3 || n.cnStts === 8);

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
					class="aps-button active ${data.cnStts === 8 ? `gray blur` : `gray`}"
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

// 공장 - 판재공장 입력
function PUT_FACTORY(pjInputDate) {
    http({
        method: "PUT",
        url: "factory/pj",
        data: {
            scheduleUID,
            pjInputDate,
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
                location.href = "/index-gpj.html";
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
    // 공장-판재공장 입력 팝업
    $(document).on("click", ".aps-button.active", function () {
        // const productUid = $(this).parents("tr").data("uid");
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parent().data("date");

        // projectUID = productUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-panjea").modal();
        $("#pjInputDate").datepicker();

        GET_DESIGN_DETAIL(scheduleUID).then((res) => {
            // const data = res.data[0];
            const today = moment(new Date()).format("YYYY-MM-DD");

            // TODO: 판재공장 입고일(data.pjInputDate)이 필요한가? 지금은 new Date()로 처리
            $("#pjInputDate").datepicker().datepicker("setDate", today);
        });
    });

    // 공장 - 판재공장 저장
    $("#handleSubmit").click(function () {
        const pjInputDate = $("#pjInputDate").val();

        PUT_FACTORY(pjInputDate);
    });
});
