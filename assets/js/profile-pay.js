// 급여명세서 상세
function GET_PAY(page, UID) {
    http({
        method: "GET",
        url: "pay/" + UID,
    }).then((res) => {
        const { paging, result, totalCount } = res.data.data;
        const listCount = Math.abs((page - 1) * 10 - totalCount);

        $("#pay-list tbody").empty();

        if (result.length === 0) {
            $("#pay-list tbody").append(`
				<tr>
					<td colspan="6">조회된 페이지가 없습니다.</td>
				</tr>
			`);
        } else {
            result.forEach((el, i) => {
                $("#pay-list tbody").append(`
					<tr>
						<td>${listCount - i}</td>
						<td>${el.userName}</td>
						<td>${el.year}</td>
						<td>${el.month}</td>
						<td>${el.regDate}</td>
						<td>
							<a
								href="${el.filePath}" 
								class="btn btn-default btn-sm"
								download="${el.fileName}"
							>
								다운로드
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
                    GET_PAY(page);
                },
            });
        }
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
    const sessionUserUID = sessionStorage.getItem("userUID");
    // 급여명세서 리스트
    GET_PAY(1, sessionUserUID);
});
