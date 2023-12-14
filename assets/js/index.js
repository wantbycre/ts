let projectData = [];
let currentSuc = "1";

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

    projectData = [];
    projectData.push(sttsData);

    // console.log(sttsData);

    sttsData.forEach((data, i) => {
        const currentDate =
            currentSuc === "1" ? data.dkbDesignDate : data.inputDate;

        $(
            "#chart-content table[data-index=" +
                (thisYear + thisMonth) +
                "] tbody tr[data-uid=" +
                data.UID +
                "] td[data-date=" +
                currentDate +
                "] .add-section .nbsp"
        ).remove();

        $(
            "#chart-content table[data-index=" +
                (thisYear + thisMonth) +
                "] tbody tr[data-uid=" +
                data.UID +
                "] td[data-date=" +
                currentDate +
                "] .add-section"
        ).append(`
			<div class="d-flex">
				<button 
					type="button" 
					class="
						aps-button
						active
						${data.stts === 7 ? `green blur` : `green`} 
						${currentSuc === "2" ? `fianl-gray` : ``}
					"
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

// 프로젝트 완료
async function PUT_SUC(projectUID) {
    const res = await http({
        method: "PUT",
        url: "project/suc",
        data: {
            projectUID,
        },
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
    // 공통자료 팝업 오버라이드
    $(document).on("click", ".handleProjectCodePop", function () {
        const uid = $(this).data("uid");
        const code = $(this).data("code");
        const data = projectData[0];
        const filter = data.filter((n) => n.UID === uid).map((n) => n.stts);

        projectUID = uid;

        $(".project-name").text(code);

        if (filter.length > 0 && filter.every((n) => n === 7)) {
            $(".final-section").attr("style", "display: block !important");
        } else {
            $(".final-section").attr("style", "display: none !important");
        }

        if (data[0]?.projectStts === 2) {
            $(".after-final").attr("style", "display: none !important");
        }
    });

    $("#handleFinalSuc").click(function () {
        PUT_SUC(projectUID).then((res) => {
            swal(res.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then(() => {
                location.reload();
            });
        });
    });

    $("#handleSearchProject").click(function () {
        const val = $("#select-to-project").val();

        $("#chart-title tbody").empty();
        $("#chart-content").empty();

        currentSuc = val;

        GET_PROJECT(val).then((res) => {
            setChart(res.data);

            if (currentSuc === "2") {
                $(
                    "#chart-title tbody tr td, #chart-content table tbody .aps-button, #chart-title tbody tr td, #chart-content table tbody td"
                ).css({
                    background: "rgb(194 194 194)",
                });
            }
        });
    });
});
