const PARAM_UID = new URL(window.location.href).searchParams.get("uid");
let currentUserUID = 0;

function sample6_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ""; // 주소 변수
            var extraAddr = ""; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === "R") {
                // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else {
                // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === "R") {
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== "" && data.apartment === "Y") {
                    extraAddr +=
                        extraAddr !== ""
                            ? ", " + data.buildingName
                            : data.buildingName;
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== "") {
                    extraAddr = " (" + extraAddr + ")";
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                // document.getElementById("sample6_extraAddress").value =
                extraAddr;
            } else {
                // document.getElementById("sample6_extraAddress").value = "";
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById("postNum").value = data.zonecode;
            document.getElementById("addr1").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("addr2").focus();
        },
    }).open();
}

// 급여명세서 상세
function GET_PAY(page) {
    http({
        method: "GET",
        url: "pay/" + PARAM_UID,
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
								href="#" 
								class="btn btn-warning btn-sm pay-edit"
								data-toggle="modal"
								data-target=".member-pay"
								data-uid=${el.UID}
								data-file-name="${el.fileName}"
								data-file-path="${el.filePath}"
								data-year="${el.year}"
								data-month="${el.month}"
							>
								상세
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

// 급여 등록
async function POST_PAY(year, month) {
    const res = await http({
        method: "POST",
        url: "pay",
        data: {
            year,
            month,
            userUID: PARAM_UID,
        },
    });
    return res.data;
}

// 급여 수정
async function PUT_PAY(year, month) {
    const res = await http({
        method: "PUT",
        url: "pay",
        data: {
            year,
            month,
            userUID: PARAM_UID,
            UID: currentUserUID,
        },
    });
    return res.data;
}

// 급여 삭제
function DELETE_PAY() {
    http({
        method: "DELETE",
        url: "pay/" + currentUserUID,
    }).then((res) => {
        swal(res.data.message, {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        }).then((res) => {
            location.reload();
        });
    });
}

// 급여 파일등록
async function PUT_PAY_FILE(UID, file) {
    const formData = new FormData();

    formData.append("pay", file.files[0]);
    formData.append("UID", UID);

    await http({
        headers: {
            "Content-Type": "multipart/form-data",
        },
        method: "PUT",
        url: "pay/file",
        data: formData,
    }).then((res) => {
        swal("등록되었습니다.", {
            icon: "success",
            buttons: {
                confirm: {
                    className: "btn btn-success",
                },
            },
        }).then((res) => {
            location.reload();
        });
    });
}

// 연차 상세
function GET_OFF_DAY(page) {
    http({
        method: "GET",
        url: "off_day/" + PARAM_UID,
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

// 유저정보 상세
async function GET_USER_DETAIL(UID) {
    const res = await http({
        method: "GET",
        url: "user/" + UID,
    });
    return res.data;
}

// 유저정보 수정
function PUT_USER(
    position,
    levelUID,
    telNum,
    postNum,
    addr1,
    addr2,
    joiningDate,
    quittingDate,
    userUID
) {
    http({
        method: "PUT",
        url: "user/profile",
        data: {
            position,
            levelUID,
            telNum,
            postNum,
            addr1,
            addr2,
            joiningDate,
            quittingDate,
            userUID,
        },
    })
        .then((res) => {
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((res) => {
                // location.href = "/member.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 패스워드 변경
function PUT_PASSWORD(userUID, pw) {
    http({
        method: "PUT",
        url: "user/password",
        data: {
            userUID,
            pw,
        },
    })
        .then((res) => {
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((res) => {
                // location.href = "/member.html";
                $("#newPw").val("");
            });
        })
        .catch(function (error) {
            console.log(error);
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
    $("#joiningDate").datepicker();
    $("#quittingDate").datepicker();
    $("#offDate").datepicker();

    // 급여명세서 리스트
    GET_PAY(1);

    // 연차 리스트
    GET_OFF_DAY(1);

    // 직원정보
    GET_USER_DETAIL(PARAM_UID).then((data) => {
        const {
            userName,
            userId,
            position,
            levelUID,
            telNum,
            postNum,
            addr1,
            addr2,
            joiningDate,
            quittingDate,
        } = data.data[0];

        $("#userName, #pay-userName").val(userName);
        $("#userId").val(userId);
        $("#position").val(position);
        $("#levelUID").val(levelUID).attr("selected", "selected");
        $("#telNum").val(telNum);
        $("#postNum").val(postNum);
        $("#addr1").val(addr1);
        $("#addr2").val(addr2);
        $("#joiningDate").val(joiningDate);
        $("#quittingDate").val(quittingDate);
    });

    // 급여 신규등록 버튼
    $(".modal-pay-open").click(function () {
        $(".form-none").hide();
        $(".handlePayClick").show();
        $("#year").val("");
        $("#month").val("");
        $("#file").val("");
        $("#pay-file-down a").text("");
    });

    // 급여 신규등록
    $(".handlePayClick").click(function () {
        const year = $("#year").val();
        const month = $("#month").val();
        const file = $("#file")[0];

        if (!year) return alertError("년도를 입력하세요");
        if (!month) return alertError("월을 입력하세요");
        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_PAY(year, month).then((res) => {
            PUT_PAY_FILE(res.data, file);
        });
    });

    // 급여 수정 팝업
    $(document).on("click", ".pay-edit", function () {
        const uid = $(this).data("uid");
        const fileName = $(this).data("file-name");
        const filePath = $(this).data("file-path");
        const year = $(this).data("year");
        const month = $(this).data("month");

        currentUserUID = uid;

        $(".handlePayClick").hide();
        $(".form-none").show();
        $("#year").val(year);
        $("#month").val(month);
        $("#file").val("");
        $("#pay-file-down a")
            .text(fileName)
            .attr("href", filePath)
            .attr("download", fileName);
    });

    // 급여 수정
    $(".handlePayEdit").click(function () {
        const year = $("#year").val();
        const month = $("#month").val();
        const file = $("#file")[0];

        if (!year) return alertError("년도를 입력하세요");
        if (!month) return alertError("월을 입력하세요");

        if (file.files.length === 0) {
            PUT_PAY(year, month).then((res) => {
                swal(res.message, {
                    icon: "success",
                    buttons: {
                        confirm: {
                            className: "btn btn-success",
                        },
                    },
                }).then((res) => {
                    location.reload();
                });
            });
        } else {
            PUT_PAY(year, month).then(() => {
                PUT_PAY_FILE(currentUserUID, file);
            });
        }
    });

    // 급여 삭제
    $(".handlePayDelete").click(function () {
        DELETE_PAY();
    });

    // 연차 등록
    $("#handleOffDayClick").click(function () {
        const cnt = $("#cnt").val();
        const offDate = $("#offDate").val();

        if (!cnt) return alertError("사용개수를 입력하세요");
        if (!offDate) return alertError("사용날짜를 선택하세요");

        http({
            method: "POST",
            url: "off_day",
            data: {
                cnt,
                offDate,
                userUID: PARAM_UID,
            },
        }).then((res) => {
            swal("등록되었습니다.", {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((res) => {
                location.reload();
            });
        });
    });

    // 직원정보 수정
    $(".handleEditSubmit").click(function () {
        const position = $("#position").val();
        const levelUID = $("#levelUID").val();
        const telNum = $("#telNum").val() || "";
        const postNum = $("#postNum").val() || "";
        const addr1 = $("#addr1").val() || "";
        const addr2 = $("#addr2").val() || "";
        const joiningDate = $("#joiningDate").val() || null;
        const quittingDate = $("#quittingDate").val() || null;

        if (!position) return alertError("직급을 입력하세요.");
        if (levelUID === "default") {
            return alertError("권한을 선택하세요.");
        }

        PUT_USER(
            position,
            levelUID,
            telNum,
            postNum,
            addr1,
            addr2,
            joiningDate,
            quittingDate,
            PARAM_UID
        );
    });

    // 비밀번호 변경
    $(".handleChangePw").click(function () {
        const pw = $("#newPw").val();

        if (!pw) return alertError("패스워드를 입력하세요");
        if (!pw.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/)) {
            return alertError("영문 숫자 조합 8자리 이상 입력하세요.");
        }

        swal("비밀번호를 변경하시겠습니까?", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
                cancel: {
                    text: "아니요",
                    visible: true,
                    className: "btn btn-default btn-border",
                },
            },
        }).then((res) => {
            if (res) {
                PUT_PASSWORD(PARAM_UID, pw);
            }
        });
    });
});
