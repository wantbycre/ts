// 공지사항 리스트
async function GET_USER(page) {
    const res = await http({
        method: "GET",
        url: "user",
        params: {
            page,
        },
    });

    const { paging, result, totalCount } = res.data.data;
    const listCount = Math.abs((page || 1 - 1) * 10 - totalCount);

    // console.log(res.data);

    $("#table-list tbody").empty();

    if (result.length === 0) {
        $("#table-list tbody").append(`
			<tr>
				<td colspan="10">조회된 페이지가 없습니다.</td>
			</tr>
		`);
    } else {
        result.forEach((el, i) => {
            $("#table-list tbody").append(`
				<tr>
					<td>${listCount - i}</td>
					<td>${el.userName || ""}</td>
					<td>${el.position || ""}</td>
					<td>${el.userId}</td>
					<td>${el.levelName}</td>
					<td>${el.telNum || ""}</td>
					<td>${el.addr1 || ""} ${el.addr2 || ""}</td>
					<td>${el.quittingDate ? `<span class="text-danger">퇴사</span>` : `재직중`}</td>
					<td>${el.regDate}</td>
					<td>
						<a 
							href="/member-detail.html?uid=${el.UID}" 
							class="btn btn-warning btn-sm"
						>
							조회
						</a>
					</td>
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
                GET_USER(page);
            },
        });
    }
}

$(function () {
    GET_USER();
});
