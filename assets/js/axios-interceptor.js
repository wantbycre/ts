const instance = axios.create({
    baseURL: domain + "/api/",
    timeout: 1000,
    headers: { "X-Custom-Header": "foobar" },
});

// 요청 인터셉터 추가하기
instance.interceptors.request.use(
    // 요청이 전달되기 전에 헤더에 토큰 넣기
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.token = token;
            console.log("1", "토큰있네");
            return config;
        }
        return config;
    },
    (error) => {
        console.log(2);
        // 요청 오류가 있는 작업 수행
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가하기
instance.interceptors.response.use(
    (response) => {
        // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
        // 응답 데이터가 있는 작업 수행
        console.log(3);
        return response;
    },
    (error) => {
        // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
        // 응답 오류가 있는 작업 수행
        const statusCode = error.response?.status;
        if (statusCode === 401) {
            error.response.statusText = "Unauthorized";
            error.response.status = 401;
            console.log(4);
            console.log("href 로그인 이동");
        }
        return Promise.reject(error);
    }
);
