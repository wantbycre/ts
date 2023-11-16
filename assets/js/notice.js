// 공지사항 리스트
async function GET_NOTICE() {
    const res = await instance.get("notice");
    // TODO: 로그인 인증 틀렸을경우 catch 확인해봐야함
    // res.catch(function (error) {
    //     if (error.response) {
    //         console.log(error);
    //     }
    // });
    return res.data;
}

$(function () {
    GET_NOTICE().then((res) => {
        console.log("공지사항", res);
        // setChart(res.data);
    });
});
