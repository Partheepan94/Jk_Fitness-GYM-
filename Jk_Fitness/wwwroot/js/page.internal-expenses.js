$(document).ready(function () {
    var InternalExpensesArray = [];
    ListInternalExpensesDetails();
});

$(function () {
    
    $('#Pdate').datetimepicker({
        format: 'L'
    })
});

$('#btnAdd').click(function () {
    LoadExpensesType();
    $('#IntModal').modal('show');
   
});

$('#btnSearch').click(function () {
    $("#waitform").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetEmployeeDetails").val(),
        dataType: 'json',
        data: { employeeid: $('#EmployeeId').val() },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#waitform").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                $("#Employeename").val(Result['firstName']);
               

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

function LoadExpensesType() {
    $('#Expensecode').find('option').remove().end();
    Expensecode = $('#Expensecode');

    $.ajax({
        type: 'GET',
        url: $("#GetExpensesType").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
              
                Expensecode.append($("<option/>").val(0).text("-Select Expense Type-"));
                $.each(Result, function () {
                    Expensecode.append($("<option/>").val(this.expenseCode).text(this.expenseName));
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
        },
        error: function (jqXHR, exception) {
        }
    });
}

$('#btnAddInternalExpenses').click(function () {

    var Id = $('#Id').val();
    var Expensecode = $('#Expensecode').val();

    var data = new FormData();
    data.append("Id", $('#Id').val());
    data.append("EmployeeId", $('#EmployeeId').val());
    data.append("ExpenseCode", $('#Expensecode').val());
    data.append("ExpenseAmount", $('#ExpenseAmount').val());
    data.append("PaymentDate", $('#Paymentdate').val());
    data.append("Description", $('#Description').val());

    if (!$('#EmployeeId').val() ) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    } else if (Expensecode == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select a Value!',
        });
    } else {
        $("#waitform").css("display", "block");
        $('.modal').addClass('freeze');
        $('.modal-content').addClass('freeze');
        $("#btnAddInternalExpenses").attr("disabled", true);
        if (Id == "0" || Id == "") {

            $.ajax({
                type: 'POST',
                url: $("#SaveInternalExpenses").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnAddInternalExpenses").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        //Cancel();
                        //ListMemberDetails();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                       // Cancel();
                    }
                },
                error: function (jqXHR, exception) {
                }
            });

        }
        else {

            $.ajax({
                type: 'POST',
                url: $("#UpdateMemberShip").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,



                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnAddMember").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListMemberDetails();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                        Cancel();
                    }
                },
                error: function (jqXHR, exception) {
                }
            });

        }

    }
});


function ListInternalExpensesDetails() {
    $("#wait").css("display", "block");
   

    $.ajax({
        type: 'GET',
        url: $("#GetInternalExpenses").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',

        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                    var Result = myData.data;
                InternalExpensesArray = Result;
                var tr = [];
                for (var i = 0; i < Result.length; i++) {
                    tr.push('<tr>');
                    tr.push("<td>" + Result[i].employeeId + "</td>");;
                    tr.push("<td>" + Result[i].expenseAmount + " </td>");
                    tr.push("<td>" + getFormattedDate(new Date(Result[i].paymentDate)) + "</td>");;
                   

                    var td = [];
                    td.push('<td>');
                  
                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td.push("<button onclick=\"EditInternalExpenses('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2)
                        td.push("<button onclick=\"DeleteInternalExpenses('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
                    td.push('</td>');

                    tr.push(td.join(' '));

                    tr.push('</tr>');
                }

                $("#tbodyid").empty();
                $('.tblInternalExpense').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblInternalExpense").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblInternalExpense").css("display", "none");
              
                var tr = [];
                $("#tbodyid").empty();
                $('.tblInternalExpense').append($(tr.join('')));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
        },
        error: function (jqXHR, exception) {
        }
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

function EditInternalExpenses(Id) {
    //$('#btnAddMember').attr('hidden', false);
    //$('#btnCancel').attr('hidden', false);
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
  /*  $("#Branch").attr("disabled", true);*/
    //$("#FreeMembership").attr("disabled", true);
    //$("#JoinDate").attr("disabled", true);
    //LoadGender();
    //LoadBranches();
    //LoadMemberShipPackage();
    LoadExpensesType();
    var InternalExpenses = $.grep(InternalExpensesArray, function (v) {
        return v.id == Id;
    })

    if (InternalExpenses.length != 0) {
        var Result = InternalExpenses[0];
        
        $("#Id").val(Result['id']);
        $("#EmployeeId").val(Result['employeeId']);
        $("#Expensecode").val(Result['expenseCode']);
        $("#ExpenseAmount").val(Result['expenseAmount']);
        $("#Paymentdate").val(getFormattedDate(new Date(Result.paymentDate)));
        $("#Description").val(Result['description']);
      
        $("#wait").css("display", "none");
        $('#IntModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}
