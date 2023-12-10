const domain = "http://decodeit.kr:3010";
const kakaoKey = "24523c2e081a1bcaa9cfed95ce009faf";
const emailSender = "";

function comma(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {
    const sessionLevel = sessionStorage.getItem("level");

    if (sessionLevel === "2") {
        $(".auth-display").attr("style", "display: block !important");
    }
});
