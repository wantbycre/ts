async function GET_NOTICE(page) {
    const res = await http({
        method: "GET",
        url: "notice",
        params: {
            page,
        },
    });

    const { paging, result, totalCount } = res.data.data;
    const listCount = Math.abs((page - 1) * 10 - totalCount);

    // console.log(paging, result, totalCount);

    $("#table-list tbody").empty();

    if (result.length === 0) {
        $("#table-list tbody").append(`
			<tr>
				<td colspan="3">조회된 페이지가 없습니다.</td>
			</tr>
		`);
    } else {
        result.forEach((el, i) => {
            $("#table-list tbody").append(`
				<tr>
					<td>${listCount - i}</td>
					<td class="text-left"><a href="/notice-detail.html?uid=${el.UID}">${
                el.title
            }</a></td>
					<td>${el.regDate}</td>
				</tr>
			`);
        });

        // 페이징처리
        $("#pagination").twbsPagination({
            totalPages: paging.totalPage,
            visiblePages: 10,
            initiateStartPageClick: false,
            onPageClick: function (event, page) {
                window.scrollTo(0, 0);
                GET_NOTICE(page);
            },
        });
    }
}

// async function GET_DESIGN_FILE(scheduleUID) {
//     const res = await http({
//         method: "GET",
//         url: "design/file/" + scheduleUID,
//     });

//     return res.data;
// }

$(function () {
    // TODO: 전체 프로젝트 파일 출력 API
    GET_NOTICE(1);
});
