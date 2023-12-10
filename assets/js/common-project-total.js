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

        data.forEach((el) => {
            // 차트 삽입
            $("#chart-sum table tbody  tr[data-uid=" + el.projectUID + "] ")
                .append(`
					<td>${comma(String(el.totalArea))}</td>
					<td>${comma(String(el.totalDkbCnt))}</td>
					<td>${comma(String(el.totalStrup))}</td>
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
            .text(sum.totalArea);
        $("#chart-sum table thead tr.table-sum-thead th")
            .eq(1)
            .text(sum.totalDkbCnt);
        $("#chart-sum table thead tr.table-sum-thead th")
            .eq(2)
            .text(sum.totalStrup.toFixed(2));
        $("#chart-sum table thead tr.table-sum-thead th")
            .eq(3)
            .text(sum.totalCnCnt);
    });
}

$(function () {
    // 합계
    setTimeout(() => {
        GET_TOTAL();
    }, 300);
});
