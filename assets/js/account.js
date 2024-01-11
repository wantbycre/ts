const path = $(location).attr("pathname");
const tabNum = path === "/account-income.html" ? 3 : 1;

// 거래처 리스트
async function GET_ACCOUNT(PARAM_UID) {
    const res = await http({
        method: "GET",
        url: "partner",
    });

    const { data } = res.data;
    const list = data.filter((n) => n.ptUID === PARAM_UID);
    let listCount = list.length;

    $("#account-table tbody").empty();

    console.log(list);

    if (list.length === 0) {
        $("#account-table tbody").append(`
			<tr>
				<td colspan="9">거래처가 없습니다.</td>
			</tr>
		`);
    } else {
        list.forEach((el, i) => {
            $("#account-table tbody").append(`
				<tr>
					<td>${listCount - i}</td>
					<td>${el.partnerName}</td>
					<td>${el.partnerTel}</td>
					<td>${el.manager}</td>
					<td>${el.bank}</td>
					<td>${el.bankNum}</td>
					<td>${el.addr1} ${el.addr2}</td>
					<td>${el.regDate}</td>
					<td>
						${
                            tabNum === 3
                                ? `<a href="/account-income-form-detail.html?uid=${el.UID}&tab=${PARAM_UID}"
							class="btn btn-warning btn-sm">조회</a>`
                                : `<a
                                    href="/account-outcome-form-detail.html?uid=${el.UID}&tab=${PARAM_UID}"
                                    class="btn btn-warning btn-sm"
                                >
                                    조회
                                </a>`
                        }
						
					</td>
				</tr>
			`);
        });
    }
}

// 거래처 항목
async function GET_PARTNER_MASTER(PARAM_UID) {
    const res = await http({
        method: "GET",
        url: "pt_master",
    });

    $("#pills-tab").empty();

    // console.log("tab", PARAM_UID);

    res.data.data.forEach((el, i) => {
        if (tabNum === 3) {
            if (el.orderNo > 2) {
                $("#pills-tab").append(`
					<li class="nav-item submenu account-tab">
						<a
							class="nav-link ${PARAM_UID === el.UID ? `active show` : ``}" 
							href="#"
							data-index="${el.UID}"
						>
							${el.ptName}
						</a>
					</li>
				`);
            }
        } else {
            if (el.orderNo < 3) {
                $("#pills-tab").append(`
					<li class="nav-item submenu account-tab">
						<a
							class="nav-link ${PARAM_UID === el.UID ? `active show` : ``}" 
							href="#"
							data-index="${el.UID}"
						>
							${el.ptName}
						</a>
					</li>
				`);
            }
        }
    });
}

$(function () {
    const TAB_UID = new URL(window.location.href).searchParams.get("tab");

    // console.log(TAB_UID);

    GET_PARTNER_MASTER(TAB_UID ? Number(TAB_UID) : tabNum);
    GET_ACCOUNT(TAB_UID ? Number(TAB_UID) : tabNum);

    // 거래처 탭 변경
    $(document).on("click", ".account-tab a", function () {
        const index = $(this).data("index");
        GET_PARTNER_MASTER(index);
        GET_ACCOUNT(index);
    });
});
