// let projectUID = 0;
let divUID = 0;
let scheduleUID = 0;
let scheduleCode = "";
let scheduleDate = "";
/**
 *
 * common-project 호출하는 함수
 * @param {Array} DATAS - 실제 데이터
 * @param {Array} thisYear - 해당 년
 * @param {Array} thisMonth - 해당 월
 */
function SET_CLASS_PROJECT(DATAS, thisYear, thisMonth) {
    console.log(DATAS, thisYear, thisMonth);

    // 설계 완료 데이터만 추출
    // 설계완료 / 코너철판입고전
    const sgdArray = DATAS.filter(
        (n) => n.stts === 3 || n.stts === 4 || n.stts === 5 || n.stts === 6
    );

    sgdArray.forEach((data, i) => {
        let sttsColor = ``;

        if (data.stts === 5) {
            sttsColor = `purple`;
        } else {
            if (data.stts === 6) {
                sttsColor = `green`;
            } else {
                sttsColor = `gray blur`;
            }
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
    			<button 
					type="button" 
					class="aps-button active ${sttsColor}"
					data-product-uid="${data.UID}"
					data-schedule-uid="${data.scheduleUID}"
					data-div-uid="${data.divUID}"
					data-stts="${data.stts}"
				>
    				<div class="aps-content">
    					<div class="aps-top">${data.floor}F ${data.section}구간</div>
    					<div class="d-flex aps-middle">
    						<div>${data.area}</div>
    						<div>${data.strup}</div>
    					</div>
    					<div class="d-flex aps-bottom">
    						<div>${data.dkbCnt}</div>
    						<div></div>
    					</div>
    				</div>
    			</button>
    		`);
    });
}

// 공장 - 조립공장 입력
function PUT_FACTORY(stts) {
    http({
        method: "PUT",
        url: "factory/jr",
        data: {
            divUID,
            stts,
        },
    })
        .then((res) => {
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((res) => {
                location.href = "/index-gj-jr.html";
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 조립공장 자료 조회
async function GET_DESIGN_FILE(scheduleUID) {
    const res = await http({
        method: "GET",
        url: "design/file/" + scheduleUID,
    });

    return res.data;
}

// 조립공장 상세 리스트
function lists(el) {
    return `
		<div class="d-flex justify-content-between">
			<a href="${el.filePath}" class="file-list" download="${el.fileName}">
				<i class="fas fa-file-alt" style="font-size: 14px;"></i>
				${el.fileName}
			</a>
			<a href="#" type="button" class="btn-delete" data-uid="${el.UID}">
				<i class="fas fa-plus text-danger"></i>
			</a>
		</div>
	`;
}

// 조립공장 리스트 업데이트
function listsSgdFecth() {
    GET_DESIGN_FILE(scheduleUID).then((res) => {
        // console.log(res.data);
        $(".file-content").empty();

        res.data.forEach((el) => {
            switch (el.fileType) {
                case "송장색도면상차사진":
                    $("#content-jr").append(lists(el));
                    break;
                default:
                    return;
            }
        });
    });
}

// 조립공장 자료 업로드
async function POST_SGD_FILE(filePath, fileType, files) {
    const formData = new FormData();

    // 다중 파일
    for (let i = 0; i < files.length; i++) {
        formData.append(
            `project/${scheduleCode}/${filePath}/${fileType}`,
            files[i]
        );
    }

    formData.append("scheduleUID", scheduleUID);
    formData.append("fileType", fileType);

    http({
        headers: {
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        url: "design/file",
        data: formData,
    })
        .then((res) => {
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            }).then((_) => {
                $("input[type=file]").val("");
                listsSgdFecth();
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

function alertError(text) {
    swal(text, {
        icon: "error",
        buttons: {
            confirm: {
                className: "btn btn-danger",
            },
        },
    });
}

$(function () {
    // 공장-조립공장 입력 팝업
    $(document).on("click", ".aps-button.active", function () {
        // const productUid = $(this).parents("tr").data("uid");
        const divUid = $(this).data("div-uid");
        const scheduleUid = $(this).data("schedule-uid");
        const code = $(this).parents("tr").data("code");
        const date = $(this).parent().data("date");

        const stts = $(this).data("stts");

        if (stts === 5) {
            $("#handleGreenSubmit").attr("disabled", false);
        } else {
            if (stts === 6) {
                console.log(2);
                $("#handlePurpleSubmit, #handleGreenSubmit").attr(
                    "disabled",
                    true
                );
            } else {
                $("#handlePurpleSubmit").attr("disabled", false);
                $("#handleGreenSubmit").attr("disabled", true);
            }
        }

        // projectUID = productUid;
        divUID = divUid;
        scheduleUID = scheduleUid;
        scheduleCode = code;
        scheduleDate = date;

        $(".modal-jorip").modal();
        $("#deckInputDate").datepicker();

        listsSgdFecth();
    });

    // 공장 - 조립공장 제작완료 등록
    $("#handlePurpleSubmit").click(function () {
        PUT_FACTORY(5);
    });

    // 공장 - 조립공장 입고확정 등록
    $("#handleGreenSubmit").click(function () {
        PUT_FACTORY(6);
    });

    // 공장 - 조립공장 송장색도면상차사진 업로드
    $("#handleFileJr").click(function () {
        const file = $("#file-jr")[0];

        if (file.files.length === 0) return alertError("파일을 첨부하세요.");

        POST_SGD_FILE("공장", "송장색도면상차사진", file.files);
    });
});
