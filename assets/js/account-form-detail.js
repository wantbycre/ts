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

// 거래처 수정
function PUT_PARTNER(
    UID,
    manager,
    partnerTel,
    bank,
    bankNum,
    postNum,
    addr1,
    addr2,
    memo
) {
    http({
        method: "PUT",
        url: "partner",
        data: {
            UID,
            manager,
            partnerTel,
            bank,
            bankNum,
            postNum,
            addr1,
            addr2,
            memo,
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
                history.back();
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 거래처 상세
async function GET_PARTNER_DETAIL(UID) {
    const res = await http({
        method: "GET",
        url: "partner/" + UID,
    });
    return res.data;
}

// 거래처 삭제
function DELETE_PARTNER(UID, PARAM_TAB) {
    http({
        method: "DELETE",
        url: "partner/" + UID,
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
                location.href = "/account.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 거래처 아이디 등록
async function POST_PARTNER_ID(partnerUID, userId, pw) {
    http({
        method: "POST",
        url: "partner/partnerId",
        data: {
            partnerUID,
            userId,
            pw,
        },
    }).then((res) => {
        if (res.status === 200) {
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((res) => {
                location.reload();
            });
        }
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
                location.reload();
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
    const PARAM_UID = new URL(window.location.href).searchParams.get("uid");
    const PARAM_TAB = new URL(window.location.href).searchParams.get("tab");

    GET_PARTNER_DETAIL(PARAM_UID).then((res) => {
        const { data } = res;
        console.log(data);
        $("#ptUID").val(data.ptUID).attr("selected", "selected");
        $("#partnerName").val(data.partnerName);
        $("#manager").val(data.manager);
        $("#partnerTel").val(data.partnerTel);
        $("#bank").val(data.bank);
        $("#bankNum").val(data.bankNum);
        $("#postNum").val(data.postNum);
        $("#addr1").val(data.addr1);
        $("#addr2").val(data.addr2);
        $("#memo").val(data.memo);

        if (data.userId) {
            $("#userId").attr("readonly", true);
            $("#userId").val(data.userId);
            $("#handleNewPw").hide();
            $("#handleChangePw").show();
        } else {
            $("#userId").attr("readonly", false);
            $("#handleNewPw").show();
            $("#handleChangePw").hide();
        }
    });

    // 등록/수정
    $("#handleSubmit").click(function () {
        const manager = $("#manager").val();
        const partnerTel = $("#partnerTel").val();
        const bank = $("#bank").val();
        const bankNum = $("#bankNum").val();
        const postNum = $("#postNum").val();
        const addr1 = $("#addr1").val();
        const addr2 = $("#addr2").val();
        const memo = $("#memo").val();

        PUT_PARTNER(
            Number(PARAM_UID),
            manager,
            partnerTel,
            bank,
            bankNum,
            postNum,
            addr1,
            addr2,
            memo
        );
    });

    // 삭제
    $("#handleDelete").click(function () {
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
            if (res) DELETE_PARTNER(PARAM_UID, PARAM_TAB);
        });
    });

    // 비밀번호 신규
    $("#handleNewPw").click(function () {
        const userId = $("#userId").val();
        const pw = $("#newPw").val();

        if (!userId) return alertError("아이디를 입력하세요");
        if (!pw) return alertError("패스워드를 입력하세요");
        // if (!pw.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/)) {
        //     return alertError("영문 숫자 조합 8자리 이상 입력하세요.");
        // }

        swal("신규 거래처 계정을 생성 하시겠습니까?", {
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
                POST_PARTNER_ID(PARAM_UID, userId, pw);
            }
        });
    });

    // 비밀번호 변경
    $("#handleChangePw").click(function () {
        const userId = $("#userId").val();
        const pw = $("#newPw").val();

        if (!userId) return alertError("아이디를 입력하세요");
        if (!pw) return alertError("패스워드를 입력하세요");
        if (!pw.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/)) {
            return alertError("영문 숫자 조합 8자리 이상 입력하세요.");
        }

        swal("비밀번호를 변경 하시겠습니까?", {
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
