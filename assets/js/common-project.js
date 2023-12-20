let _DATAS = [];
let _CALENDAR = [];
let _UNIQUE_OBJ_ARR = [];
let _THIS_YEAR = [];
let _THIS_MONTH = [];

let scrollDate = moment().format("YYYY-MM-DD");

function setChart(DATAS) {
    // 최소 월 / 최대 월 배열 (inputDate가 있는 항목만)
    const dateRange = DATAS.filter((n) => n.inputDate).map((n) =>
        moment(n.inputDate)
    );

    // 프로젝트 시작 DATE
    // const startMoment = moment("2023-01-01");
    const startMoment = moment.min(dateRange);

    // 프로젝트 종료 DATE
    // const endMoment = moment("2024-05-22");
    const endMoment = moment.max(dateRange);

    // 해당 월 (0~11 표기하기에 +1)
    const startMonth = startMoment.month() + 1;
    const endMonth = endMoment.month() + 1;

    // 같은 년 일경우
    if (startMoment.year() === endMoment.year()) {
        // 같은 월 일경우
        if (startMonth === endMonth) {
            // 분할 중복제거 / 좌측 타이틀 세팅
            const uniqueObjArr = setUniqueObj(DATAS);

            // 프로젝트 시작 DATE -> 한달 수치
            const startMomentStartWeek = startMoment
                .clone()
                .startOf("month")
                .week();
            const startMomentEndWeek =
                startMoment.clone().endOf("month").week() === 1
                    ? 53
                    : startMoment.clone().endOf("month").week();

            // 월 한달 수치 그리기
            const calendar = setDayCalendar(
                startMoment,
                startMomentStartWeek,
                startMomentEndWeek
            );

            const thisYear = startMoment.format("YYYY");
            const thisMonth = startMoment.format("MM");

            _DATAS = DATAS;
            _CALENDAR = calendar;
            _UNIQUE_OBJ_ARR = uniqueObjArr;
            _THIS_YEAR = thisYear;
            _THIS_MONTH = thisMonth;

            // console.log("1");
            setChartTable(DATAS, calendar, uniqueObjArr, thisYear, thisMonth);
        } else {
            // 다른 월 일경우

            // 분할 중복제거 / 좌측 타이틀 세팅
            const uniqueObjArr = setUniqueObj(DATAS);

            const monthRange = Math.abs(startMonth - endMonth);

            for (let mm = 0; mm <= monthRange; mm++) {
                const addMoment = startMoment.clone().add(mm, "months");

                const startMomentStartWeek = addMoment
                    .clone()
                    .startOf("month")
                    .week();
                const startMomentEndWeek =
                    addMoment.clone().endOf("month").week() === 1
                        ? 53
                        : addMoment.clone().endOf("month").week();

                // 월 한달 수치 그리기
                const calendar = setDayCalendar(
                    startMoment,
                    startMomentStartWeek,
                    startMomentEndWeek
                );

                // 해당 년/월 표기
                const thisYear = addMoment.format("YYYY");
                const thisMonth = addMoment.format("MM");

                _DATAS = DATAS;
                _CALENDAR = calendar;
                _UNIQUE_OBJ_ARR = uniqueObjArr;
                _THIS_YEAR = thisYear;
                _THIS_MONTH = thisMonth;

                // console.log("2");
                setChartTable(
                    DATAS,
                    calendar,
                    uniqueObjArr,
                    thisYear,
                    thisMonth
                );
            }
        }
    } else {
        // 다른 년 일경우

        // 분할 중복제거 / 좌측 타이틀 세팅
        const uniqueObjArr = setUniqueObj(DATAS);

        // 현재 날짜에서 1년 기준 남은 월 계산
        const startRange = Math.abs(startMonth - 12);

        // 마지막 날짜에서 1년 기준 이전 월 계산
        const endRange = Math.abs(endMonth - 1);

        // 년도 텍스트 맞춤
        // let yearLength = [startRange];

        // 캘린더
        let calendar = [];

        // 현재 날짜 월 한달 수치
        for (let mm = 0; mm <= startRange; mm++) {
            const addMoment = startMoment.clone().add(mm, "months");

            const startMomentStartWeek = addMoment
                .clone()
                .startOf("month")
                .week();
            const startMomentEndWeek =
                addMoment.clone().endOf("month").week() === 1
                    ? 53
                    : addMoment.clone().endOf("month").week();

            // 현재 날짜 월 한달 수치
            calendar.push(
                setDayCalendar(
                    startMoment,
                    startMomentStartWeek,
                    startMomentEndWeek
                )
            );
        }

        // let yearData = [startMoment.year(),endMoment.year()];

        const yearRange = Math.abs(startMoment.year() - endMoment.year());

        // 기준년도를 위에서 실행하기에 기준년도를 제외한 년도를 구해야합니다.
        for (let yyyy = 1; yyyy <= yearRange; yyyy++) {
            const addYear = startMoment.clone().add(yyyy, "year").year();
            const nowMoment = addYear === endMoment.year() ? endRange : 11;

            // key 세팅시 필요한 년도
            // yearData.push(addYear);

            // 마지막 날짜 월 한달 수치
            for (let mm = 0; mm <= nowMoment; mm++) {
                const addMoment = moment(addYear + "-01-01")
                    .clone()
                    .add(mm, "months");
                const startMomentStartWeek = addMoment
                    .clone()
                    .startOf("month")
                    .week();
                const startMomentEndWeek =
                    addMoment.clone().endOf("month").week() === 1
                        ? 53
                        : addMoment.clone().endOf("month").week();

                // 현재 날짜 월 한달 수치
                calendar.push(
                    setDayCalendar(
                        startMoment,
                        startMomentStartWeek,
                        startMomentEndWeek,
                        "end"
                    )
                );
            }
        }

        let isYearCheck = 0;
        let nextYearIndex = startMoment.year();
        let endMonthIndex = 1;

        calendar.forEach((calendarData, i) => {
            let thisYear = 0;
            let thisMonth = 0;

            // 시작 년
            if (i <= startRange) {
                const padMonth = Number(
                    startMoment.clone().add(i, "months").format("MM")
                );

                thisYear = startMoment.year();
                thisMonth =
                    String(padMonth).length === 1
                        ? String(padMonth).padStart(2, "0")
                        : String(padMonth);
                // 마지막 년
            } else if (i >= calendar.length - endRange - 1) {
                endMonthIndex > 12 ? (endMonthIndex = 1) : endMonthIndex;
                thisYear = endMoment.year();
                thisMonth =
                    String(endMonthIndex).length === 1
                        ? String(endMonthIndex).padStart(2, "0")
                        : String(endMonthIndex);
                endMonthIndex++;
            } else {
                if (isYearCheck === 12) {
                    nextYearIndex += 1;
                    isYearCheck = 0;
                    endMonthIndex = 1;
                }
                thisYear = nextYearIndex + 1;
                thisMonth =
                    String(endMonthIndex).length === 1
                        ? String(endMonthIndex).padStart(2, "0")
                        : String(endMonthIndex);

                endMonthIndex++;
                isYearCheck++;
            }

            _DATAS = DATAS;
            _CALENDAR = calendarData;
            _UNIQUE_OBJ_ARR = uniqueObjArr;
            _THIS_YEAR = String(thisYear);
            _THIS_MONTH = thisMonth;

            // console.log("3");
            setChartTable(
                DATAS,
                calendarData,
                uniqueObjArr,
                String(thisYear),
                thisMonth
            );
        });
    }
}

/**
 *
 * 해당 월 day 그리기
 *
 * @param {Number} today - 현재 날짜
 * @param {Number} startWeek - 현재 월 첫주
 * @param {Number} endWeek - 현재 월 마지막주
 * @param {String} endType - 년 변경시 today week 해제
 * @returns calendar - 5주에 해당한 5개의 배열
 */
function setDayCalendar(today, startWeek, endWeek, endType) {
    let calendar = [];

    // 해당 월 -> 한달 수치 그리기
    for (let week = startWeek; week <= endWeek; week++) {
        if (endType === "end") {
            calendar.push(
                Array(7)
                    .fill(0)
                    .map((n, i) => {
                        let current = today
                            .clone()
                            .week(week)
                            .startOf("week")
                            .add(n + i, "day");
                        return current.format("D");
                    })
            );
        } else {
            // 현재 날짜보다 작은 주일이 있다면 배제
            if (today.week() <= week) {
                calendar.push(
                    Array(7)
                        .fill(0)
                        .map((n, i) => {
                            let current = today
                                .clone()
                                .week(week)
                                .startOf("week")
                                .add(n + i, "day");
                            return current.format("D");
                        })
                );
            } else {
                calendar.push(
                    Array(7)
                        .fill(0)
                        .map((n, i) => {
                            return null;
                        })
                );
            }
        }
    }

    if (calendar[0].some((n) => n === "1")) {
        calendar[0] = calendar[0].map((n) =>
            n !== "1" &&
            n !== "2" &&
            n !== "3" &&
            n !== "4" &&
            n !== "5" &&
            n !== "6" &&
            n !== "7"
                ? null
                : n
        );
    }

    calendar[calendar.length - 1] = calendar[calendar.length - 1].map((n) =>
        n !== "22" &&
        n !== "23" &&
        n !== "24" &&
        n !== "25" &&
        n !== "26" &&
        n !== "27" &&
        n !== "28" &&
        n !== "29" &&
        n !== "30" &&
        n !== "31"
            ? null
            : n
    );

    // console.log(calendar)

    return calendar;
}

/**
 *
 * 분할 중복제거 / 좌측 타이틀 적용
 *
 * @param {Array} DATAS - 실제 데이터
 * @returns uniqueObjArr - 중복제거된 배열
 */
function setUniqueObj(DATAS) {
    // 분할 중복제거
    const uniqueObjArr = [
        ...new Map(DATAS.map((obj) => [obj.UID, obj])).values(),
    ];

    // console.log(uniqueObjArr);

    // TODO: 공무/설계에 따라 링크 제거 및 추가
    // TODO: 권한에 따라 기성/노무비 컬럼을 추가해야합니다.

    const currentPath = window.location.pathname;

    uniqueObjArr.forEach((el, i) => {
        // 좌측 타이틀 적용
        $("#chart-title tbody").append(`
			<tr data-uid="${el.UID}">
				<td>
					<a
						href="#"
						data-toggle="modal"
						data-target=".modal-code"
						data-uid="${el.UID}"
						data-code="${el.projectCode}"
						class="handleProjectCodePop"
					>
						${el.projectCode}
					</a>
				</td>
				<td>
					${el.jhName}<br/>
					${el.jmName}<br/>
				</td>
				<td>
					${el.pjName}<br/>
					${el.jrName}<br/>
					${el.sgName}
				</td>
				<td>
					${el.cornerName}<br/>
					${el.sgName}<br/>
				</td>
				<td>
					<a 
						href="#"
						data-toggle="modal"
						data-target=".modal-seolchi"
						data-uid="${el.UID}" 
						data-name="${el.scName}"
						data-code="${el.projectCode}"
						data-schedule-uid="${el.scheduleUID}" 
						class="handleProjectSeolchi"
					>
						${el.scName}
					</a>
				</td>
				<td>
					<a 
						href="#"
						data-toggle="modal"
						data-target=".modal-joning"
						data-uid="${el.UID}" 
						class="handleProjectJoningPop"
					>
						<i class="fas fa-file-alt" style="font-size: 18px;"></i>
					</a>
				</td>
				${
                    currentPath === `/index-gpj.html` ||
                    currentPath === `/index-gj-corner.html` ||
                    currentPath === `/index-gj-jr.html` ||
                    currentPath === `/index-gj-deck.html` ||
                    currentPath === `/index-sc-team.html`
                        ? `
						<td>
							<a 
								href="#"
								data-toggle="modal"
								data-target=".modal-gisung"
								data-uid="${el.UID}" 
								data-code="${el.projectCode}"
								data-schedule-uid="${el.scheduleUID}"
								data-name="${
                                    currentPath === `/index-gpj.html`
                                        ? el.pjName
                                        : currentPath ===
                                          `/index-gj-corner.html`
                                        ? el.cornerName
                                        : currentPath === `/index-gj-jr.html`
                                        ? el.jrName
                                        : currentPath === `/index-gj-deck.html`
                                        ? el.deckName
                                        : currentPath === `/index-sc-team.html`
                                        ? el.scName
                                        : ``
                                }"
								class="handleProjectGisungPop"
							>
								<i class="fas fa-file-alt" style="font-size: 18px;"></i>
							</a>
						</td>		
					`
                        : ``
                }
			</tr>
		`);

        // 우측 합계 적용
        $("#chart-sum table tbody").append(`
			<tr data-uid="${el.UID}"></tr>
		`);
    });

    return uniqueObjArr;
}

/**
 *
 * 차트 데이터 오버라이딩
 *
 * @param {Array} DATAS - 실제 데이터
 * @param {Array} calendar - 달력데이터
 * @param {Array} uniqueObjArr - 중복처리 데이터
 * @param {Array} thisYear - 해당 년
 * @param {Array} thisMonth - 해당 월
 */
function setChartTable(DATAS, calendar, uniqueObjArr, thisYear, thisMonth) {
    let th = [];
    let td = [];

    // 우측 켈린더 Day 세팅
    calendar.forEach((el) => {
        el.forEach((day, i) => {
            if (day) {
                th.push(`<th>${day}</th>`);
                td.push(`<td
							data-date="${thisYear}-${thisMonth}-${
                    String(day).length === 1
                        ? String(day).padStart(2, "0")
                        : String(day)
                }" 
							class="${i === 0 || i === 6 ? "bg-gray" : ""}"
						>
							<div class="d-flex add-section">
								<button type="button" class="aps-button nbsp">&nbsp;</button>
							</div>
						</td>
				`);
            }
        });
    });

    // table
    $("#chart-content").append(`
		<table class="table v2" data-index="${thisYear}${thisMonth}">
			<thead></thead>
			<tbody></tbody>
		</table>
	`);

    // thead
    $("#chart-content table[data-index=" + (thisYear + thisMonth) + "] thead")
        .append(`
		<tr>
			<th colspan="${th.length}" style="width: 80px;">${thisYear}년 ${thisMonth}월</th>
		</tr>
		<tr>${th}</tr>
	`);

    // tbody
    uniqueObjArr.forEach((el) => {
        $(
            "#chart-content table[data-index=" +
                (thisYear + thisMonth) +
                "] tbody"
        ).append(`
			<tr data-uid="${el.UID}" data-code="${el.projectCode}">${td}</tr>
		`);
    });

    SET_CLASS_PROJECT(DATAS, thisYear, thisMonth);
}

async function GET_PROJECT(projectStts) {
    const res = await http({
        method: "GET",
        url: "project",
        params: {
            projectStts,
        },
    });
    return res.data;
}

function setOffsetPosition(letDate) {
    setTimeout(() => {
        const todayYear = String(moment(letDate).year());
        const todayMonth = String(moment(letDate).month() + 1);
        const thisTableLeft = $("#chart-content").offset().left;

        // console.log("스크롤", letDate, todayYear, todayMonth, thisTableLeft);

        const currentOffset = $(
            "#chart-content table[data-index=" +
                (todayYear + todayMonth) +
                "] tbody tr:first-child td[data-date='" +
                letDate +
                "']"
        ).offset().left;

        $(".table-scroll-section").animate(
            { scrollLeft: currentOffset - thisTableLeft },
            100
        );
    }, 500);
}

$(function () {
    GET_PROJECT(null).then((res) => {
        setChart(res.data);
    });

    const sessionScrollLeft = sessionStorage.getItem("left");

    setOffsetPosition(
        sessionScrollLeft ? sessionScrollLeft : moment().format("YYYY-MM-DD")
    );
});
