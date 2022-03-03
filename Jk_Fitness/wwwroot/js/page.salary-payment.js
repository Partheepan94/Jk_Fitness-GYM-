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
        data: { employeeid: $('#EmployeeId').val(), Month:parseInt($('#Months').val()) },
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

                    //$("#PartialPay").attr("disabled", true);
                    $("#AdvanceSalary").attr("hidden", false);
                    //isUpdate = true;
                    //$("#PartialPayTbl").attr("hidden", false);
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