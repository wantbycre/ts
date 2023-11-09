const domain = "http://decodeit.kr:3010";

function comma(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
