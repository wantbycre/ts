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
    $("#handleSubmit").click(function () {
        const userId = $("#userId").val();
        const password = $("#password").val();

        // TODO: 비번 틀렸을때 얼럿 하기
        POST_LOGIN(userId, password)
            .then((res) => {
                const { data } = res;
                console.log(res);

                // 1. partnerUID : 0 직원 , 아니면 거래처

                // 2. 0 이면 level을 가지고 페이지 이동

                // 3. 0 아니면 ptKey를 가지고 페이지 이동

                // FIXME: 레벨을 주면 레벨에 따라 index를 다르게

                // 실제 5-1, 2-1 이런식
                // partnerUID : 0 직원 , 아니면 옵저버는 다운로드만 가능

                // ptKey = false 없이 level만 올경우
                // level1 : 최고관리자
                // level2 :	공무
                // level3 :	설계-데크보
                // level4 :	설계-코너철판
                // level5 :	공사-데크보
                // level6 :	조립공장-데크보
                // level7 :	판재공장-데크보
                // level8 :	공장-코너철판
                // level9 :	공장-데크
                // level11 : 설치
                // level12 : 옵저버 (사실 필요없음)

                // ptKey = true (온리 뷰, 다운로드)
                // 종합건설 : 공사-데크보
                // 전문건설 : 공사-데크보
                // 판재판매처 : 공장-판재공장
                // 조립공장 : 공장-조립공장
                // 설계업체 : 설계
                // 코너철판 : 설계-코너철판
                // 난간대 : 설치
                // 철물업체 : 공사-데크보
                // DECK업체 : 공장-DECK
                // 테이블업체 : 공사-데크보
                // 설치팀 : 설치
                // 기타 : 공사-데크보

                // 종합건설 : jhPartner;
                // 전문건설 : jmPartner;
                // 판재판매처 : pjPartner;
                // 조립공장 : jrPartner;
                // 설계업체 : sgPartner;
                // 코너철판 : cornerPartner;
                // 난간대 : ngdPartner;
                // 철물업체 : cmPartner;
                // DECK업체 : deckPartner;
                // 테이블업체 : tablePartner;
                // 설치팀 : scPartner;

                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("level", data.level);
                sessionStorage.setItem("userUID", data.userUID);
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
