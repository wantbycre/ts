function GET_TOTAL() {
    http({
        method: "GET",
        url: "project/total",
    }).then((res) => {
        const data = res.data.data;
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

            if (data.some((n) => n.projectUID === uid)) {
                stateProject.push(data.filter((n) => n.projectUID === uid)[0]);
            } else {
                stateProject.push({
                    projectUID: uid,
                    totalArea: null,
                    totalDkbCnt: null,
                    totalStrup: null,
                    totalCnCnt: null,
                });
            }
        });

        // console.log(stateProject);

        stateProject.forEach((el) => {
            // 차트 삽입
            $("#chart-sum table tbody  tr[data-uid=" + el.projectUID + "] ")
                .append(`
					<td>${comma(String(el.totalArea || 0))}</td>
            		<td>${comma(String(el.totalDkbCnt || 0))}</td>
            		<td>${comma(String(el.totalStrup || 0))}</td>
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

$(function () {
    // 합계
    setTimeout(() => {
        GET_TOTAL();
    }, 300);
});
