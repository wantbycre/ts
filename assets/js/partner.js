function options(el) {
    return `<option value="${el.UID}">${el.partnerName}</option>`;
}

// 프로젝트 기준정보 리스트
async function GET_PARTNER(page) {
    const res = await http({
        method: "GET",
        url: "partner",
    });

    const { data } = res.data;

    // console.log(data);

    data.forEach((el) => {
        switch (el.ptUID) {
            case 1: // 종합건설
                $("#jhPartner").append(options(el));
                break;
            case 2: // 전문건설
                $("#jmPartner").append(options(el));
                break;
            case 3: // 판재판매처
                $("#pjPartner").append(options(el));
                break;
            case 4: // 조립공장
                $("#jrPartner").append(options(el));
                break;
            case 5: // 설계업체
                $("#sgPartner").append(options(el));
                break;
            case 6: // 코너철판
                $("#cornerPartner").append(options(el));
                break;
            case 7: // 난간대
                $("#ngdPartner").append(options(el));
                break;
            case 8: // 철물업체
                $("#cmPartner").append(options(el));
                break;
            case 9: // DECK업체
                $("#deckPartner").append(options(el));
                break;
            case 10: // 테이블업체
                $("#tablePartner").append(options(el));
                break;
            case 11: // 설치팀
                $("#scPartner").append(options(el));
                break;
            default:
                return;
        }
    });
}

// 신규 프로젝트 생성
async function POST_PROJECT(
    projectCode,
    projectName,
    jhPartner,
    jmPartner,
    pjPartner,
    jrPartner,
    sgPartner,
    cornerPartner,
    ngdPartner,
    cmPartner,
    deckPartner,
    tablePartner,
    scPartner
) {
    const res = await http({
        method: "POST",
        url: "project",
        data: {
            projectCode,
            projectName,
            jhPartner,
            jmPartner,
            pjPartner,
            jrPartner,
            sgPartner,
            cnsgPArtner: sgPartner,
            cornerPartner,
            ngdPartner,
            cmPartner,
            deckPartner,
            tablePartner,
            scPartner,
        },
    });

    return res;
}

// 프로젝트 ID 등록
async function POST_PROJECT_ID(projectUID, userId, pw) {
    const res = await http({
        method: "POST",
        url: "project/projectId",
        data: {
            projectUID,
            userId,
            pw,
        },
    });

    return res;
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
    $("#handleNewProject").click(function () {
        GET_PARTNER();
    });

    // 신규프로젝트 생성
    $("#handleNewProjectSubmit").click(function () {
        const projectCode = $("#projectCode").val();
        const projectName = $("#projectName").val();
        const jhPartner = $("#jhPartner").val();
        const jmPartner = $("#jmPartner").val();
        const pjPartner = $("#pjPartner").val();
        const jrPartner = $("#jrPartner").val();
        const sgPartner = $("#sgPartner").val();
        const cornerPartner = $("#cornerPartner").val();
        const ngdPartner =
            $("#ngdPartner").val() === "default" ? 0 : $("#ngdPartner").val();
        const cmPartner =
            $("#cmPartner").val() === "default" ? 0 : $("#cmPartner").val();
        const deckPartner =
            $("#deckPartner").val() === "default" ? 0 : $("#deckPartner").val();
        const tablePartner =
            $("#tablePartner").val() === "default"
                ? 0
                : $("#tablePartner").val();
        const scPartner = $("#scPartner").val();

        if (!projectCode) return alertError("공사코드를 입력하세요");
        if (!projectName) return alertError("공사명을 입력하세요");

        if (jhPartner === "default")
            return alertError("종합건설 항목을 선택하세요");
        if (jmPartner === "default")
            return alertError("전문건설 항목을 선택하세요");
        if (pjPartner === "default")
            return alertError("판재판매처 항목을 선택하세요");
        if (jrPartner === "default")
            return alertError("조립공장 항목을 선택하세요");
        if (sgPartner === "default")
            return alertError("설계업체 항목을 선택하세요");
        if (cornerPartner === "default")
            return alertError("코너철판 항목을 선택하세요");
        if (scPartner === "default") return alertError("설치팀을 선택하세요");

        const userId = $("#jp-jm-userId").val();
        const pw = $("#jp-jm-pw").val();
        const confirmPw = $("#jp-jm-confirm-pw").val();

        if (!userId) return alertError("아이디를 입력하세요");
        if (!pw) return alertError("패스워드를 입력하세요");
        if (!pw.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/)) {
            return alertError("영문 숫자 조합 8자리 이상 입력하세요.");
        }
        if (!confirmPw) return alertError("패스워드 재확인 하세요");

        if (pw !== confirmPw) {
            return alertError("비밀번호 재확인 하세요.");
        }

        POST_PROJECT(
            projectCode,
            projectName,
            Number(jhPartner),
            Number(jmPartner),
            Number(pjPartner),
            Number(jrPartner),
            Number(sgPartner),
            Number(cornerPartner),
            Number(ngdPartner),
            Number(cmPartner),
            Number(deckPartner),
            Number(tablePartner),
            Number(scPartner)
        )
            .then((res) => {
                if (res.data.status === 200) {
                    // console.log("res", res);
                    POST_PROJECT_ID(res.data.data, userId, pw).then(
                        (finalRes) => {
                            // console.log("finalRes", finalRes);

                            swal(finalRes.data.message, {
                                icon: "success",
                                buttons: {
                                    confirm: {
                                        className: "btn btn-success",
                                    },
                                },
                            }).then((res) => {
                                location.href = "/index.html";
                            });
                        }
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
                // swal(res.data.message, {
                //     icon: "success",
                //     buttons: {
                //         confirm: {
                //             className: "btn btn-success",
                //         },
                //     },
                // }).then((res) => {
                //     location.href = "/index.html";
                // });
            });
    });
});
