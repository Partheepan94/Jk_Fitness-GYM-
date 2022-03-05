$(document).ready(function () {
    var InternalExpensesArray = [];
    //ListInternalExpensesDetails();
    LoadMonths();
    $("#AdvanceSalary").attr("hidden", true);
});

$(function () {

    $('#Pdate').datetimepicker({
        format: 'L'
    })
});

$('#btnSearch').click(function () {
    $("#wait").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetEmployeeDetails").val(),
        dataType: 'json',
        data: { employeeid: $('#EmployeeId').val(), Month: parseInt($('#Months').val()) },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                $("#AdvanceSalary").attr("hidden", true);
                var Result = myData.data;
                $("#Fname").val(Result['firstName']);
                $("#Lname").val(Result['lastName']);
                $("#Branch").val(Result['branch']);
                $("#Fsalary").val(Result['fixedSalary']);
                $("#Adamount").val(Result['totalAdvanceAmount']);
                $("#Commission").val(Result['commishanAmount']);
                $("#Tamount").val(Result['totalAmount']);
                $("#PaymentDate").val(getFormattedDate(new Date(Result['salaryDate'])));

                if (Result.advancePaymentStaffs.length > 0) {

                    var tr = [];
                    for (var i = 0; i < Result.advancePaymentStaffs.length; i++) {
                        tr.push('<tr>');
                        tr.push("<td>" + getFormattedDate(new Date(Result.advancePaymentStaffs[i].paymentDate)) + "</td>");;
                        tr.push("<td>" + Result.advancePaymentStaffs[i].advancePayment.toFixed(2) + "</td>");
                        tr.push('</tr>');
                    }

                    $("#tbodyid").empty();
                    $('.tblAdvSalary').append($(tr.join('')));
                    $("#tblAdvSalary").css("display", "table");

                    $("#AdvanceSalary").attr("hidden", false);
                    
                }
                

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }
        },
        error: function (jqXHR, exception) {
        }
    });
});

function LoadMonths() {
    $('#Months').find('option').remove().end();
    Salutation = $('#Months');
    var SalutationList = [
        { Id: 1, Name: "1" },
        { Id: 2, Name: "2" },
        { Id: 3, Name: "3" },
        { Id: 4, Name: "4" },
        { Id: 5, Name: "5" },
        { Id: 6, Name: "6" },
        { Id: 7, Name: "7" },
        { Id: 8, Name: "8" },
        { Id: 9, Name: "9" },
        { Id: 10, Name: "10" },
        { Id: 11, Name: "11" },
        { Id: 12, Name: "12" }
    ];
    Salutation.append($("<option/>").val(0).text("-Select Months-"))
    $.each(SalutationList, function () {
        Salutation.append($("<option/>").val(this.Id).text(this.Name));
    });
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

$("#btnSalaryPay").click(function () {


    $("#wait").css("display", "block");
    $("#btnSalaryPay").attr("disabled", true);
    $('.card-body').addClass('freeze');



    var data = new FormData();
    data.append("EmployeeId", $('#EmployeeId').val());
    data.append("SalaryDate", $('#PaymentDate').val());
    data.append("FixedSalary", $('#Fsalary').val());
    data.append("AdvancePayment", $('#Adamount').val());
    data.append("CommishanAmount", $('#Commission').val());
    data.append("TotalAmount", $('#Tamount').val());

    $.ajax({
        type: 'POST',
        url: $("#SaveStaffSalaryPayment").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));

            $("#wait").css("display", "none");
            $("#btnSalaryPay").attr("disabled", false);
            $('.card-body').removeClass('freeze');

            if (myData.code == "1") {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                });
                
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }
            Clear();
        }
    });


})

$('#Commission').bind('keyup', function () {
    var value = $('#Commission').val();
   
    if ($.isNumeric(value)) {

        $("#Tamount").val((parseFloat($("#Fsalary").val()) - (parseFloat($("#Commission").val()) + parseFloat($("#Adamount").val()))).toFixed(2));
       
    }
    
});


function Clear() {
    $('#Months').val(0);
    $("#EmployeeId").val("");
    $('#Fname').val("");
    $('#Lname').val("");
    $('#Branch').val("");
    $('#Fsalary').val("");
    $("#Commission").val("");
    $("#Adamount").val("");
    $("#Tamount").val("");
    $("#PaymentDate").val(getFormattedDate(new Date()));
   /* $("#Comment").val("");*/
    $("#AdvanceSalary").attr("hidden", true);
}

$("#btnClear").click(function () {
    Clear();
})