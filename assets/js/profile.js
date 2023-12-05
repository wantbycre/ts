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
                location.href = "/profile.html";
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
    // 비밀번호 변경
    $("#headerHandleChangePw").click(function () {
        const pw = $("#header-newPw").val();
        const cPw = $("#header-confirmPw").val();

        if (!pw) return alertError("패스워드를 입력하세요");
        // if (!pw.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/)) {
        //     return alertError("영문 숫자 조합 8자리 이상 입력하세요.");
        // }
        if (pw !== cPw) {
            return alertError("비밀번호 재확인 하세요.");
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
                PUT_PASSWORD(getUserID, pw);
            }
        });
    });
});
