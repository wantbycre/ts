let num = 0;

/**
 *
 * common-project 호출하는 함수
 * @param {Array} DATAS - 실제 데이터
 * @param {Array} thisYear - 해당 년
 * @param {Array} thisMonth - 해당 월
 */
function SET_CLASS_PROJECT(DATAS, thisYear, thisMonth) {
    // 실제 데이터 오버라이딩
    // TODO: 모든 데이터 다온다. 그중에 로그인시 LEVEL에 따라 filter해서 써야한다
    // TODO: LEVEL에 따라 입고/확정/출고 보이는게 다르다
    // TODO: 10-1 + 10 + 5 모든 날짜가 확정된 일정이 보이는 데이터 inputDate (설계제외)
    DATAS.forEach((data, i) => {
        // 일반
        if (data.duplicate === 0) {
            $(
                "#chart-content table[data-index=" +
                    (thisYear + thisMonth) +
                    "] tbody tr[data-uid=" +
                    data.UID +
                    "] td[data-date=" +
                    data.inputDate +
                    "]"
            ).empty().append(`
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
                data.scheduleUID !== DATAS[i - 1]?.scheduleUID &&
                data.scheduleUID === DATAS[i + 1]?.scheduleUID
            ) {
                num += 1;
            } else if (data.scheduleUID === DATAS[i - 1]?.scheduleUID) {
                num += 1;
            } else {
                num = 0;
            }
            $(
                "#chart-content table[data-index=" +
                    (thisYear + thisMonth) +
                    "] tbody tr[data-uid=" +
                    data.UID +
                    "] td[data-date=" +
                    data.inputDate +
                    "]"
            ).empty().append(`
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
    							<span>${data.scheduleUID}${num > 0 ? `-${num}` : ``}</span>
    						</div>
    					</div>
    				</div>
    			</button>
    		`);
        }
    });
}

$(function () {});
