const http = axios.create({
    baseURL: domain + "/api/",
    // timeout: 1000,
    headers: { "X-Custom-Header": "foobar" },
});

// req 인터셉터 추가
http.interceptors.request.use(
    // 요청이 전달되기 전에 헤더에 토큰 넣기
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            // if (config.url.includes("pay/file")) {
            if (config.url.slice(-4) === "file") {
                $("body").append(`
                	<div id="common-loading">
						<div>
							<img src="/assets/img/loading.gif" alt="">
							<p>업로드 중입니다</p>
						</div>
					</div>
                `);
            }

            config.headers.token = token;
            // console.log("1", "REQ - token");
            return config;
        }
        return config;
    },
    (error) => {
        // console.log("2", "REQ - error");
        // 요청 오류가 있는 작업 수행
        $("#common-loading").remove();
        return Promise.reject(error);
    }
);

// res 인터셉터 추가
http.interceptors.response.use(
    (response) => {
        // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
        // 응답 데이터가 있는 작업 수행
        // console.log("3", "RES - data");
        $("#common-loading").remove();
        return response;
    },
    (error) => {
        // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
        // 응답 오류가 있는 작업 수행
        $("#common-loading").remove();

        const statusCode = error.response?.status;
        if (statusCode === 401) {
            error.response.statusText = "Unauthorized";
            error.response.status = 401;
            // console.log("4", "RES - error");
            location.href = "/login.html";
        }
        return Promise.reject(error);
    }
);
