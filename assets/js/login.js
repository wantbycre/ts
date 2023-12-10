// 공지사항 등록
async function POST_LOGIN(userId, password) {
    const res = await axios({
        method: "POST",
        url: domain + "/api/login",
        data: {
            userId,
            password,
        },
    });
    return res.data;
}

$(function () {
    // if (sessionStorage.getItem("token")) {
    //     location.href = sessionStorage.getItem("href");
    // }

    $("#handleSubmit").click(function () {
        const userId = $("#userId").val();
        const password = $("#password").val();

        POST_LOGIN(userId, password)
            .then((res) => {
                const { level, partnerUID, ptKey, token, userUID } = res.data;

                sessionStorage.setItem("level", level);
                sessionStorage.setItem("partnerUID", partnerUID);
                sessionStorage.setItem("ptKey", ptKey);
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("userUID", userUID);

                console.log(level, partnerUID, ptKey, token, userUID);

                // 1. partnerUID : 0 직원 , 아니면 거래처
                // 2. 0 이면 level을 가지고 페이지 이동
                // 3. 0 아니면 ptKey를 가지고 페이지 이동
                // 실제 5-1, 2-1
                // partnerUID : 0 직원 , 아니면 옵저버는 다운로드만 가능

                // 직원
                if (partnerUID === 0) {
                    switch (level) {
                        case 1:
                            location.href = "/index-master.html";
                            sessionStorage.setItem(
                                "href",
                                "/index-master.html"
                            );
                            break;
                        case 2:
                            location.href = "/index.html";
                            sessionStorage.setItem("href", "/index.html");
                            break;
                        case 3:
                            location.href = "/index-sgd.html";
                            sessionStorage.setItem("href", "/index-sgd.html");
                            break;
                        case 4:
                            location.href = "/index-sg-corner.html";
                            sessionStorage.setItem(
                                "href",
                                "/index-sg-corner.html"
                            );
                            break;
                        case 5:
                            location.href = "/index-gsd.html";
                            sessionStorage.setItem("href", "/index-gsd.html");
                            break;
                        case 6:
                            location.href = "/index-gj-jr.html";
                            sessionStorage.setItem("href", "/index-gj-jr.html");
                            break;
                        case 7:
                            location.href = "/index-gpj.html";
                            sessionStorage.setItem("href", "/index-gpj.html");
                            break;
                        case 8:
                            location.href = "/index-gj-corner.html";
                            sessionStorage.setItem(
                                "href",
                                "/index-gj-corner.html"
                            );
                            break;
                        case 9:
                            location.href = "/index-gj-deck.html";
                            sessionStorage.setItem(
                                "href",
                                "/index-gj-deck.html"
                            );
                            break;
                        case 10:
                            location.href = "/index-sc-team.html";
                            sessionStorage.setItem(
                                "href",
                                "/index-sc-team.html"
                            );
                            break;
                        default:
                            return;
                    }
                } else {
                    // 거래처
                    switch (ptKey) {
                        case "jhPartner":
                        case "jmPartner":
                        case "cmPartner":
                        case "tablePartner":
                        case "jhPartner":
                            location.href = "/index-gsd.html";
                            sessionStorage.setItem("href", "/index-gsd.html");
                            break;
                        case "pjPartner":
                            location.href = "/index-gpj.html";
                            sessionStorage.setItem("href", "/index-gpj.html");
                            break;
                        case "jrPartner":
                            location.href = "/index-gj-jr.html";
                            sessionStorage.setItem("href", "/index-gj-jr.html");
                            break;
                        case "sgPartner":
                            location.href = "/index-sgd.html";
                            sessionStorage.setItem("href", "/index-sgd.html");
                            break;
                        case "cornerPartner":
                            location.href = "/index-sg-corner.html";
                            sessionStorage.setItem(
                                "href",
                                "/index-sg-corne.html"
                            );
                            break;
                        case "ngdPartner":
                        case "scPartner":
                            location.href = "/index-sc-team.html";
                            sessionStorage.setItem(
                                "href",
                                "/index-sc-team.html"
                            );
                            break;
                        case "deckPartner":
                            location.href = "/index-gj-deck.html";
                            sessionStorage.setItem(
                                "href",
                                "/index-gj-deck.html"
                            );
                            break;
                        default:
                            return;
                    }
                }
                // ptKey = false 없이 level만 올경우
                // level1 : 최고관리자		= /index-master.html
                // level2 :	공무			= /index.html
                // level3 :	설계-데크보		= /index-sgd.html
                // level4 :	설계-코너철판	= /index-sg-corner.html
                // level5 :	공사-데크보		= /index-gsd.html
                // level6 :	조립공장-데크보	= /index-gj-jr.html
                // level7 :	판재공장-데크보 = /index-gpj.html
                // level8 :	공장-코너철판	= /index-gj-corner.html
                // level9 :	공장-데크		= /index-gj-deck.html
                // level10 : 설치			= /index-sc-team.html

                // ptKey = true (온리 뷰, 다운로드)
                // 종합건설 : 공사-데크보 : jhPartner : /index-gsd.html
                // 전문건설 : 공사-데크보 : jmPartner : /index-gsd.html
                // 판재판매처 : 공장-판재공장 : pjPartner : /index-gpj.html
                // 조립공장 : 공장-조립공장 : jrPartner : /index-gj-jr.html
                // 설계업체 : 설계 : sgPartner : /index-sgd.html
                // 코너철판 : 설계-코너철판 : cornerPartner : /index-sg-corner.html
                // 난간대 : 설치 : ngdPartner : /index-sc-team.html
                // 철물업체 : 공사-데크보 : cmPartner : /index-gsd.html
                // DECK업체 : 공장-DECK : deckPartner : /index-gj-deck.html
                // 테이블업체 : 공사-데크보 : tablePartner : /index-gsd.html
                // 설치팀 : 설치 : scPartner : /index-sc-team.html
                // 기타 : 공사-데크보 : jhPartner : /index-gsd.html
            })
            .catch((res) => {
                swal(res.response.data.message, {
                    icon: "error",
                    buttons: {
                        confirm: {
                            className: "btn btn-danger",
                        },
                    },
                });
            });
    });

    $("#id, #password").on("keypress", function (e) {
        if (e.keyCode == "13") {
            $("#handleSubmit").click();
        }
    });
});
