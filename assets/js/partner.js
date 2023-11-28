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
            case 0: // 종합건설
                $("#jhPartner").append(options(el));
                break;
            case 1: // 전문건설
                $("#jmPartner").append(options(el));
                break;
            case 2: // 판재판매처
                $("#pjPartner").append(options(el));
                break;
            case 3: // 조립공장
                $("#jrPartner").append(options(el));
                break;
            case 4: // 설계업체
                $("#sgPartner").append(options(el));
                break;
            case 5: // 코너철판
                $("#cornerPartner").append(options(el));
                break;
            case 6: // 난간대
                $("#ngdPartner").append(options(el));
                break;
            case 7: // 철물업체
                $("#cmPartner").append(options(el));
                break;
            case 8: // DECK업체
                $("#deckPartner").append(options(el));
                break;
            case 9: // 테이블업체
                $("#tablePartner").append(options(el));
                break;
            case 10: // 설치팀
                $("#scPartner").append(options(el));
                break;
            default:
                return;
        }
    });
}

// 신규 프로젝트 생성
function POST_PROJECT(
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
    http({
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
                location.href = "/index.html";
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
        );
    });
});
