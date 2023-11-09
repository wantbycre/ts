// const DATAS = [
//     {
//         "UID": 1,
//         "projectCode": "원영-현대-230305",
//         "scheduleUID": 3,
//         "area": 400,
//         "strup": 4.2,
//         "dkbFloor": 5,
//         "dkbSection": 8,
//         "dkbCnt": 40,
//         "inputDate": "2023-11-25",
//         "duplicate": 1
//     },
//     {
//         "UID": 1,
//         "projectCode": "원영-현대-230305",
//         "scheduleUID": 3,
//         "area": 400,
//         "strup": 4.2,
//         "dkbFloor": 5,
//         "dkbSection": 8,
//         "dkbCnt": 40,
//         "inputDate": "2023-11-24",
//         "duplicate": 1
//     },
//     {
//         "UID": 1,
//         "projectCode": "원영-현대-230305",
//         "scheduleUID": 3,
//         "area": 400,
//         "strup": 4.2,
//         "dkbFloor": 5,
//         "dkbSection": 8,
//         "dkbCnt": 40,
//         "inputDate": "2023-11-23",
//         "duplicate": 1
//     },
//     {
//         "UID": 1,
//         "projectCode": "원영-현대-230305",
//         "scheduleUID": 2,
//         "area": 300,
//         "strup": 3.5,
//         "dkbFloor": 4,
//         "dkbSection": 6,
//         "dkbCnt": 35,
//         "inputDate": "2023-11-21",
//         "duplicate": 1
//     },
//     {
//         "UID": 1,
//         "projectCode": "원영-현대-230305",
//         "scheduleUID": 1,
//         "area": 512,
//         "strup": 5.413,
//         "dkbFloor": 3,
//         "dkbSection": 5,
//         "dkbCnt": 53,
//         "inputDate": "2023-11-19",
//         "duplicate": 1
//     },
//     {
//         "UID": 2,
//         "projectCode": "가산-삼성-230507",
//         "scheduleUID": 4,
//         "area": 200,
//         "strup": 3,
//         "dkbFloor": 6,
//         "dkbSection": 3,
//         "dkbCnt": 30,
//         "inputDate": "2023-11-19",
//         "duplicate": 1
// 	},
// 	{
//         "UID": 2,
//         "projectCode": "가산-삼성-230507",
//         "scheduleUID": 4,
//         "area": 200,
//         "strup": 3,
//         "dkbFloor": 6,
//         "dkbSection": 3,
//         "dkbCnt": 30,
//         "inputDate": "2023-11-22",
//         "duplicate": 1
//     }
// ]

function setChart(DATAS) {
	console.log(DATAS)

	// 프로젝트 시작 월 
	const startMonth = moment("2023-11-19");

	// 프로젝트 종료 월
	const endMonth = moment("2023-11-27");

	// 프로젝트 시작 월 -> 한달 수치
	const startMonthStartWeek = startMonth.clone().startOf('month').week();
	const startMonthEndWeek = startMonth.clone().endOf('month').week() === 1 ? 53 : startMonth.clone().endOf('month').week();

	// 프로젝트 종료 월 -> 한달 수치
	const endMonthStartWeek = endMonth.clone().startOf('month').week();
	const endMonthEndWeek = endMonth.clone().endOf('month').week() === 1 ? 53 : endMonth.clone().endOf('month').week();	

	// 같은 년 일경우
	if (startMonth.year() === endMonth.year()) {
		// 같은 월 일경우
		if (startMonth.month() === endMonth.month()) {
			// 월 한달 수치 그리기
			const calendar = setDayCalendar(startMonth, startMonthStartWeek, startMonthEndWeek);
		
			// 해당 월 (0~11 표기하기에 +1)
			const thisYear = startMonth.year();
			const thisMonth = startMonth.month() + 1;
			
			// 분할 중복제거
			const uniqueObjArr = [...new Map(DATAS.map((obj) => [obj.UID, obj])).values()];
		
			// 좌측 타이틀 적용
			uniqueObjArr.forEach((el, i) => {
				$("#chart-title tbody").append(`
					<tr>
						<td>
							<a href="#" data-toggle="modal" data-target=".modal-code">
								${el.projectCode}
							</a>
						</td>
						<td>원영<br />현앤</td>
						<td>음성<br />원하이텍<br />이지디테일</td>
						<td>삼호<br />마하나임</td>
						<td>삼호정공</td>
						<td>
							<a href="#" data-toggle="modal" data-target=".modal-joning">
								<i class="fas fa-file-alt" style="font-size: 18px;"></i>
							</a>
						</td>
					</tr>
				`);
			});

			let th = [];
			let td = [];
			
			// 우측 켈린더 적용
			calendar.forEach((el) => {
				el.forEach(day => {
					th.push(`<th>${day}</th>`);
					td.push(`<td data-date="${thisYear}-${thisMonth}-${day}"><button type="button" class="aps-button">&nbsp;</button></td>`);
				})
			});

			// thead
			$("#chart-content thead").append(`
				<tr>
					<th colspan="${th.length}" style="width: 80px;">${thisYear}년 ${thisMonth}월</th>
				</tr>
				<tr>${th}</tr>
			`);

			// tbody
			uniqueObjArr.forEach(el => {
				$("#chart-content tbody").append(`
					<tr data-uid="${el.UID}">${td}</tr>
				`);
			});
			

			let num = 0;

			// 실제 데이터 오버라이딩
			DATAS.forEach((data, i) => {
				// 일반
				if (data.duplicate === 0) {
					$("#chart-content tbody tr[data-uid="+data.UID+"] td[data-date=" + data.inputDate + "]").empty().append(`
						<button type="button" class="aps-button active">
							<div class="aps-content">
								<div class="aps-top">1F 5구간</div>
								<div class="d-flex aps-middle">
									<div>512</div>
									<div>5.4</div>
								</div>
								<div class="d-flex aps-bottom">
									<div>53</div>
									<div>&nbsp;</div>
								</div>
							</div>
						</button>
					`);
				// 다중/분할
				} else {
					if (
						(data.scheduleUID !== DATAS[i - 1]?.scheduleUID)
						&& 
						(data.scheduleUID === DATAS[i + 1]?.scheduleUID)
					) {
						num += 1
					} else if (data.scheduleUID === DATAS[i - 1]?.scheduleUID) {
						num += 1
					} else {
						num = 0
					}

					$("#chart-content tbody tr[data-uid=" + data.UID + "] td[data-date=" + data.inputDate + "]").empty().append(`
						<button type="button" class="aps-button v2 active green">
							<div class="d-flex">
								<div class="aps-content">
									<div class="aps-top">1F 5구간</div>
									<div class="d-flex aps-middle">
										<div>512</div>
										<div>5.4</div>
									</div>
									<div class="d-flex aps-bottom">
										<div>53</div>
										<div>&nbsp;</div>
									</div>
								</div>
								<div class="aps-side">
									<div>
										&nbsp;
									</div>
									<div>
										<span>${data.scheduleUID}${num > 0 ? `-${num}` : `` }</span>
									</div>
								</div>
							</div>
						</button>
					`);
				}				
			});

		// 다른 월 일경우
		} else {
			// const monthRange = Math.abs(startMonth.month() - endMonth.month());
			// setMonthEach(monthRange, startMonth, startMonthStartWeek, startMonthEndWeek);
		}
	};
};

/**
 * 
 * 해당 월 day 그리기
 * 
 * @param {Number} today - 현재 날짜
 * @param {Number} startWeek - 현재 월 첫주
 * @param {Number} endWeek - 현재 월 마지막주 
 * @returns calendar - 5주에 해당한 5개의 배열
 */
function setDayCalendar(today, startWeek, endWeek) {
	let calendar = [];

	// 해당 월 -> 한달 수치 그리기
	for (let week = startWeek; week <= endWeek; week++) {
		// 현재 날짜보다 작은 주일이 있다면 배제 
		if (today.week() <= week) {
			calendar.push(
				Array(7).fill(0).map((n, i) => {
					let current = today
						.clone()
						.week(week)
						.startOf('week')
						.add(n + i, 'day');
					return current.format('D')
				})
			);
		}
	}
	
	return calendar;
}

/**
 * 
 * @param {Number} today - 현재 날짜
 * @param {Number} today - 현재 날짜
 * @param {Number} startWeek - 현재 월 첫주
 * @param {Number} endWeek - 현재 월 마지막주 
 * @returns calendar - 5주에 해당한 배열
 */

// 다중 월 그리기
function setMonthEach() {
	
};

$(function () {
	GET_PROJECT()
		.then((res) => {
			setChart(res.data);
		});
});