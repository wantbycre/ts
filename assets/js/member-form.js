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

// 공지사항 등록
function POST_USER(
    userName,
    userId,
    position,
    pw,
    confirmPw,
    levelUID,
    telNum,
    postNum,
    addr1,
    addr2,
    joiningDate
) {
    http({
        method: "POST",
        url: "user",
        data: {
            userName,
            userId,
            position,
            pw,
            confirmPw,
            levelUID,
            telNum,
            postNum,
            addr1,
            addr2,
            joiningDate,
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
                location.href = "/member.html";
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
    let isDuplicate = false;

    $("#joiningDate").datepicker();

    // 아이디 중복확인
    $(".handleDuplicate").click(function () {
        const userId = $("#userId").val();
        if (!userId) return alertError("아이디를 입력하세요");

        http({
            method: "POST",
            url: "user/duplicate",
            data: {
                userId,
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    isDuplicate = true;
                    swal("사용가능한 아이디 입니다.", {
                        icon: "success",
                        buttons: {
                            confirm: {
                                className: "btn btn-success",
                            },
                        },
                    });
                }
            })
            .catch((res) => {
                isDuplicate = false;
                swal("이미사용중인 아이디 입니다.", {
                    icon: "error",
                    buttons: {
                        confirm: {
                            className: "btn btn-danger",
                        },
                    },
                });
            });
    });

    // 등록/수정
    $(".handleSubmit").click(function () {
        const userName = $("#userName").val();
        const userId = $("#userId").val();
        const position = $("#position").val();
        const pw = $("#pw").val();
        const confirmPw = $("#confirmPw").val();
        const levelUID = $("#levelUID").val();
        const telNum = $("#telNum").val() || "";
        const postNum = $("#postNum").val() || "";
        const addr1 = $("#addr1").val() || "";
        const addr2 = $("#addr2").val() || "";
        const joiningDate = $("#joiningDate").val() || null;

        if (!userName) return alertError("이름을 입력하세요");
        if (!userId) return alertError("아이디를 입력하세요");
        if (!position) return alertError("직급을 입력하세요");
        if (!pw) return alertError("패스워드를 입력하세요");
        // if (!pw.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/)) {
        //     return alertError("영문 숫자 조합 8자리 이상 입력하세요.");
        // }
        if (!confirmPw) return alertError("패스워드 재확인 하세요");

        if (pw !== confirmPw) {
            return alertError("비밀번호 재확인 하세요.");
        }

        if (levelUID === "default") {
            return alertError("권한을 선택하세요.");
        }
        if (!isDuplicate) return alertError("아이디 중복확인 하세요.");

        POST_USER(
            userName,
            userId,
            position,
            pw,
            confirmPw,
            levelUID,
            telNum,
            postNum,
            addr1,
            addr2,
            joiningDate
        );
    });
});
