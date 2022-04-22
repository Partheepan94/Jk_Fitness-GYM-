$(document).ready(function () {
    var BranchArray;
    LoadBranches();
    var CurDate = new Date();
    $("#SoldDate").val(getFormattedDate(CurDate));
    
});


$(function () {
    //Date picker
    $('#date').datetimepicker({
        format: 'L'
    })
});

function LoadBranches() {
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');
   
    $.ajax({
        type: 'GET',
        url: $("#GetBranchDetails").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                BranchArray = myData.data;
                $.each(Result, function () {
                    Branch.append($("<option/>").val(this.branchCode).text(this.branchName));
                });
                ListSoldProductDetails();
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
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function ListSoldProductDetails() {

    var Branch = $('#Branch').val();
    var SoldDate = $('#SoldDate').val();

    var data = new FormData();
    data.append("Branch", $('#Branch').val());
    data.append("SoldDate", $('#SoldDate').val());

    $("#wait").css("display", "block");
    $.ajax({
        type: 'POST',
        url: $("#GetSoldProducts").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var ProdList = myData.data;
               
                var tr = [];
                for (var i = 0; i < ProdList.length; i++) {

                    var branch = $.grep(BranchArray, function (v) {
                        return v.branchCode == ProdList[i].branch;
                    })

                    tr.push('<tr>');
                    tr.push("<td>" + ProdList[i].productId + "</td>");
                    tr.push("<td>" + ProdList[i].productName + "</td>");;
                    tr.push("<td>" + branch[0].branchName + "</td>");;
                    tr.push("<td>" + ProdList[i].pricePerProduct.toFixed(2) + "</td>");;
                    tr.push("<td>" + ProdList[i].soldPricePerProduct.toFixed(2) + "</td>");;
                    tr.push("<td>" + ProdList[i].totalSoldPrice.toFixed(2) + "</td>");;
                    tr.push("<td>" + getFormattedDate(new Date(ProdList[i].soldDate)) + "</td>");;

                   

                    var td = [];
                    td.push('<td>');
                   
                    if ($('#delete').val() == 1 || $('#delete').val() == 2) {
                        td.push("<button onclick=\"DeleteSoldProduct('" + ProdList[i].soldId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
                    }
                    td.push('</td>');

                    tr.push(td.join(' '));

                    tr.push('</tr>');




                }
                $("#wait").css("display", "none");
                $("#tbodyid").empty();
                $('.tblSoldProduct').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblSoldProduct").css("display", "table");
            } else if (myData.code == "0") {
                $("#wait").css("display", "none");
                $("#noRecords").css("display", "block");
                $("#tblSoldProduct").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblSoldProduct').append($(tr.join('')));
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

$("#btnSearch").click(function () {
    ListSoldProductDetails();
});

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

$("#Branch").change(function () {
    ListSoldProductDetails();
});

function DeleteSoldProduct(Id) {

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $("#wait").css("display", "block");
            $.ajax({
                type: 'POST',
                url: $("#DeleteSoldProduct").val(),
                dataType: 'json',
                data: '{"SoldId": "' + Id + '"}',
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    $("#wait").css("display", "none");
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
                        });
                        ListSoldProductDetails();
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
    })
}
