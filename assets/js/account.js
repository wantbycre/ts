// 거래처 리스트
async function GET_ACCOUNT(PARAM_UID) {
    const res = await http({
        method: "GET",
        url: "partner",
    });

    const { data } = res.data;
    const list = data.filter((n) => n.ptUID === PARAM_UID - 1);
    let listCount = list.length;

    $("#account-table tbody").empty();

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
						<a href="/account-form-detail.html?uid=${el.UID}&tab=${PARAM_UID}"
							class="btn btn-warning btn-sm">조회</a>
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

    res.data.data.forEach((el, i) => {
        $("#pills-tab").append(`
			<li class="nav-item submenu account-tab">
				<a
					class="nav-link ${PARAM_UID === i + 1 ? `active show` : ``}" 
					href="#"
					data-index="${el.UID}"
				>
					${el.ptName}
				</a>
			</li>
		`);
    });
}

$(function () {
    GET_PARTNER_MASTER(1);
    GET_ACCOUNT(1);

    // 거래처 탭 변경
    $(document).on("click", ".account-tab a", function () {
        const index = $(this).data("index");
        GET_PARTNER_MASTER(index);
        GET_ACCOUNT(index);
    });
});
