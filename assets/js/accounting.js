async function GET_PROJECT(projectStts) {
    const res = await http({
        method: "GET",
        url: "project",
        params: {
            projectStts,
        },
    });

    // const { paging, result, totalCount } = res.data.data;
    // const listCount = Math.abs((page - 1) * 10 - totalCount);

    // console.log(res.data.data[0 + 1]);

    let setData = [];

    res.data.data.forEach((n, i) => {
        if (n.UID !== res.data.data[i + 1]?.UID) {
            setData.push(n);
        }
    });

    console.log("회계관리", res.data.data);

    $("#table-list tbody").empty();

    if (setData.length === 0) {
        $("#table-list tbody").append(`
			<tr>
				<td colspan="4">조회된 페이지가 없습니다.</td>
			</tr>
		`);
    } else {
        setData.forEach((el, i) => {
            $("#table-list tbody").append(`
				<tr>
					<td>${setData.length - i}</td>
					<td class="text-left">${el.projectCode}</td>
					<td>${el.dkbDesignDate}</td>
					<td>
						<a href="/accounting-detail.html?uid=${
                            el.UID
                        }&type=gisung" class="btn btn-dark btn-sm">
							기성
						</a>
						<a href="/accounting-detail.html?uid=${
                            el.UID
                        }&type=nomu" class="btn btn-secondary btn-sm ml-1">
							노무비
						</a>
					</td>
				</tr>
			`);
        });

        // 페이징처리
        // $("#pagination").twbsPagination({
        //     totalPages: paging.totalPage,
        //     visiblePages: 10,
        //     initiateStartPageClick: false,
        //     onPageClick: function (event, page) {
        //         window.scrollTo(0, 0);
        //         GET_PROJECT(page);
        //     },
        // });
    }
}

$(function () {
    GET_PROJECT(0);
});
