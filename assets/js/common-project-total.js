function GET_TOTAL(projectStts, startDate, endDate) {
    http({
        method: "GET",
        url: "project/total",
        params: { projectStts, startDate, endDate },
    }).then((res) => {
        const data = res.data.data;

        let uniqueData = [];

        // console.log(data);

        $("#chart-sum table thead tr.table-sum-thead th").empty();
        $("#chart-sum table tbody tr").empty();

        data.forEach((el, i) => {
            if (el.UID === data[i - 1]?.UID) {
                if (el.scheduleUID !== data[i - 1]?.scheduleUID) {
                    const addData = uniqueData.map((n) => {
                        if (
                            n?.UID === el.UID &&
                            n?.scheduleUID !== el.scheduleUID
                        ) {
                            return {
                                ...n,
                                area: n.area + el.area,
                                cnCnt: n.cnCnt + el.cnCnt,
                                dkbCnt: n.dkbCnt + el.dkbCnt,
                                strup: n.strup + el.strup,
                            };
                        } else {
                            return {
                                ...n,
                            };
                        }
                    });

                    uniqueData = [...addData];
                }
            } else {
                uniqueData.push(el);
            }
        });

        // console.log("uniqueData", uniqueData);

        const sum = {
            totalArea: 0,
            totalDkbCnt: 0,
            totalStrup: 0,
            totalCnCnt: 0,
        };

        const projectLength = $("#chart-content table:eq(0) tbody tr");

        let stateProject = [];

        $.each(projectLength, (i, el) => {
            const uid = $(el).data("uid");

            if (uniqueData.some((n) => n.UID === uid)) {
                const filter = uniqueData.filter((n) => n.UID === uid)[0];

                stateProject.push({
                    UID: uid,
                    totalArea: filter.area,
                    totalDkbCnt: filter.dkbCnt,
                    totalStrup: filter.strup,
                    totalCnCnt: filter.cnCnt,
                });
            } else {
                stateProject.push({
                    UID: uid,
                    totalArea: null,
                    totalDkbCnt: null,
                    totalStrup: null,
                    totalCnCnt: null,
                });
            }
        });

        // console.log("stateProject", stateProject);

        stateProject.forEach((el) => {
            // console.log("el", el.totalStrup);
            // 차트 삽입
            $("#chart-sum table tbody  tr[data-uid=" + el.UID + "] ").append(`
					<td>${comma(String(parseFloat((el.totalArea || 0).toFixed(2))))}</td>
            		<td>${comma(String(el.totalDkbCnt || 0))}</td>
            		<td>${comma(
                        String(parseFloat((el.totalStrup || 0).toFixed(2)))
                    )}</td>
            		<td>${comma(String(el.totalCnCnt || 0))}</td>
				`);

            // 합계
            sum.totalArea += Number(el.totalArea || 0);
            sum.totalDkbCnt += Number(el.totalDkbCnt || 0);
            sum.totalStrup += Number(el.totalStrup || 0);
            sum.totalCnCnt += Number(el.totalCnCnt || 0);
        });

        $("#chart-sum table thead tr.table-sum-thead th")
            .eq(0)
            .text(comma(sum.totalArea));
        $("#chart-sum table thead tr.table-sum-thead th")
            .eq(1)
            .text(comma(sum.totalDkbCnt));
        $("#chart-sum table thead tr.table-sum-thead th")
            .eq(2)
            .text(comma(sum.totalStrup.toFixed(2)));
        $("#chart-sum table thead tr.table-sum-thead th")
            .eq(3)
            .text(comma(sum.totalCnCnt));
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
    // 합계
    setTimeout(() => {
        GET_TOTAL(1, null, null);
    }, 300);

    $(".calendar-ico").datepicker();

    $("#handleSearchTotals").click(function () {
        const startDate = $("#total-start-date").val();
        const endDate = $("#total-end-date").val();

        if (!startDate) alertError("검색 시작날짜를 선택하세요");
        if (!endDate) alertError("검색 종료날짜를 선택하세요");

        GET_TOTAL(1, startDate, endDate);
    });
});
