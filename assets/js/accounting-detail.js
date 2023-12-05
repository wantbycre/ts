async function GET_PROJECT_FILE(PARAM_UID, PARAM_TYPE) {
    const res = await http({
        method: "GET",
        url: "project/file/" + PARAM_UID,
    });

    // const { paging, result, totalCount } = res.data.data;
    // const listCount = Math.abs((page - 1) * 10 - totalCount);

    let setData = [];

    res.data.data.forEach((el) => {
        if (PARAM_TYPE === "gisung") {
            if (el.fileType.slice(-2) === "기성") {
                setData.push(el);
            }
        }

        if (PARAM_TYPE === "nomu") {
            if (el.fileType.slice(-3) === "노무비") {
                setData.push(el);
            }
        }
    });

    // console.log(setData);

    $("#table-list tbody").empty();

    if (setData.length === 0) {
        $("#table-list tbody").append(`
			<tr>
				<td colspan="5">조회된 페이지가 없습니다.</td>
			</tr>
		`);
    } else {
        setData.forEach((el, i) => {
            $("#table-list tbody").append(`
				<tr>
					<td>${setData.length - i}</td>
					<td class="text-left">${el.fileName}</td>
					<td>${el.regDate}</td>
					<td>
						<a href="${el.filePath}" class="btn btn-dark btn-sm" download="${el.fileName}">
							다운로드
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
    const PARAM_UID = new URL(window.location.href).searchParams.get("uid");
    const PARAM_TYPE = new URL(window.location.href).searchParams.get("type");

    GET_PROJECT_FILE(PARAM_UID, PARAM_TYPE);
});
