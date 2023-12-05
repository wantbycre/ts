// 연차 상세
function GET_OFF_DAY(page, UID) {
    http({
        method: "GET",
        url: "off_day/" + UID,
    }).then((res) => {
        const { paging, result, totalCount } = res.data.data;
        const listCount = Math.abs((page - 1) * 10 - totalCount);
        // console.log(result);

        if (result.length === 0) {
            $("#off-list tbody").append(`
				<tr>
					<td colspan="4">조회된 페이지가 없습니다.</td>
				</tr>
			`);
        } else {
            $("#total-off").text(result[0].totaloffDay);

            result.forEach((el, i) => {
                $("#off-list tbody").append(`
				<tr>
					<td>${listCount - i}</td>
					<td>${el.userName}</td>
					<td>${el.cnt}</td>
					<td>${el.offDate}</td>
				</tr>
			`);
            });

            // 페이징처리
            $("#pagination2").twbsPagination({
                totalPages: paging.totalPage,
                visiblePages: 10,
                initiateStartPageClick: false,
                onPageClick: function (event, page) {
                    window.scrollTo(0, 0);
                    GET_OFF_DAY(page);
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
    const getUserID = sessionStorage.getItem("userUID");
    // 연차 리스트
    GET_OFF_DAY(1, getUserID);
});
