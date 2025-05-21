var defaultPage = {

    doLoad: function() {

        // general.InitI18next(general.GetLanguage(), "default", null);
    },

    //---預約賞屋

    getReservationData: function() {
        let strmsg = $('#enterpriseTitile').val();
        let inputValue = {
            name: $('#txtContactUsName').val(),
            email: $('#txtContactUsEmail').val(),
            tel: $('#txtContactUsTel').val(),
            expectedDate: $("#txtContactDtView").val(),
            source: "集團首頁",
            title: strmsg,
            remark: strmsg,
            contactID: "",
            houseID: ""
        };

        return inputValue;
    },
    GetInputValueSaler: function() {
        console.log("in GetInputValue");
        let inputValue = {
            ContactName: $('#txtContactUsName').val(),
            PhoneNumber: $('#txtContactUsTel').val(),
            expectedDate: $("#txtContactDtView").val(),
            HousingID: "Ryy9000005",
        };
        console.log(inputValue);
        return inputValue;
    },
    SaveContactUsSale: function(inputVal) {
        general.ProcessAjax(true, "/api/jeanReservationRecords/SendToSpadmin", "POST", JSON.stringify(inputVal),
            function(result) {
                console.log(result);
            },
            function(result) {
                if (result.failText === "") {
                    console.log(result.textStatus);
                    //swal(result.textStatus, "", "warning");
                } else {
                    console.log("銷售家送出失敗：" + result.failText);
                    //swal(result.failText, "", "warning");
                }
            }
        );
    },
    validatePhone: function() {
        var Name = $('#txtContactUsName').val();
        var Phone = $('#txtContactUsTel').val();
        var Email = $('#txtContactUsEmail').val();
        var Date = $('#txtContactDtView').val();
        var msg = '';
        if (Name === "") {
            msg += '請填寫名字 \n';
        }
        if (Phone === "") {
            msg += '請填寫手機號碼 \n';
        }
        if (Email === "") {
            msg += '請填寫名字 \n';
        }
        if (Date === "") {
            msg += '請填寫名字 \n';
        }
        if (Phone != "") {
            var re = /^09[0-9]{8}$/;
            if (!re.test(Phone)) {
                msg += '請填寫手機格式 Ex:0912123123';
            }
        }
        console.log(msg)
        if (msg === '') {
            return true;
        } else {
            alert(msg)
        }


    },
    checkData: function() {
        var data = this.getReservationData();

        if (data.name.length === 0) return false;
        if (data.email.length === 0) return false;
        if (data.tel.length === 0) return false;
        if (data.expectedDate.length === 0) return false;
    },

    reservation: function() {
        //Validate Data
        if (this.validatePhone()) {

            //Sent to 銷售家
            var dataforsaler = this.GetInputValueSaler();
            this.SaveContactUsSale(dataforsaler);


            //Sent to Backend
            var data = this.getReservationData();
            var api = "/api/jeanReservationRecords/AddReservationRecord";
            general.ProcessAjax(true, api, "POST", JSON.stringify(data),
                function(result) {
                    $(".form-wrap li,.delete-line-wrap li:nth-child(1),.delete-line-wrap li:nth-child(2),.btn-wrap-form li,.box-wraper-inner").removeClass("active");
                    $(".cover-box").removeClass("active");
                    $('.wrap').removeClass("active");
                    alert("感謝您的預約，我們將安排專人盡速與您聯絡");
                },
                function(error) {
                    alert("送出失敗");
                });

        }
    }
};

$(function() {

    defaultPage.doLoad();

});