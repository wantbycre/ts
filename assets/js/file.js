const PARAM_TAB = new URL(window.location.href).searchParams.get("tab");
const PARAM_UID = new URL(window.location.href).searchParams.get("uid");
const PARAM_NAME = new URL(window.location.href).searchParams.get("name");

// 파일 리스트
async function GET_FILE(page) {
    const res = await http({
        method: "GET",
        url: "FOLDER_FILE/" + PARAM_UID,
        params: {
            page,
        },
    });

    const { paging, result, totalCount } = res.data.data;
    const listCount = Math.abs((page - 1) * 10 - totalCount);

    // console.log(listCount, totalCount);

    $("#table-list tbody").empty();

    if (result.length === 0) {
        $("#table-list tbody").append(`
			<tr>
				<td colspan="4">조회된 파일이 없습니다.</td>
			</tr>
		`);
    } else {
        result.forEach((el, i) => {
            $("#table-list tbody").append(`
				<tr>
					<td>${listCount - i}</td>
					<td class="text-left">${el.fileName}</td>
					<td>${el.regDate}</td>
					<td>
						<a
							href="${el.filePath}" 
							class="btn btn-dark btn-sm"
							download="${el.fileName}"
						>
							파일 다운로드
						</a>
						<a
							href="#"
							data-uid="${el.UID}" 
							class="btn btn-danger btn-sm ml-2 handleDelete auth-display"
						>
							파일 삭제
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
                GET_FILE(page);
            },
        });
    }
}

function DELETE_FILE(UID) {
    http({
        method: "DELETE",
        url: "FOLDER_FILE/" + UID,
    })
        .then((res) => {
            location.reload();
        })
        .catch(function (error) {
            console.log(error);
        });
}

$(function () {
    $(".page-title").text(`${PARAM_NAME} 파일 관리`);
    $(".page-new").text(`${PARAM_NAME} 파일 등록`);

    GET_FILE(1).then((res) => {
        const sessionLevel = sessionStorage.getItem("level");

        if (sessionLevel === "2") {
            $(".handleDelete.auth-display").attr(
                "style",
                "display: inline-block !important"
            );
        }
    });

    // 파일 신규등록
    $(".page-new").click(function () {
        location.href = `/file-form.html?tab=${PARAM_TAB}&uid=${PARAM_UID}&name=${PARAM_NAME}`;
    });

    // 삭제
    $(document).on("click", ".handleDelete", function () {
        const uid = $(this).data("uid");

        swal("삭제하시겠습니까?", {
            icon: "error",
            buttons: {
                confirm: {
                    text: "네, 삭제하겠습니다.",
                    className: "btn btn-danger",
                },
                cancel: {
                    text: "아니요",
                    visible: true,
                    className: "btn btn-default btn-border",
                },
            },
        }).then((res) => {
            if (res) {
                DELETE_FILE(uid);
            }
        });
    });
});
