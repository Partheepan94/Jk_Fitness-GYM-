$(document).ready(function () {
    var BranchArray;
    var provisionalMembersDetailsArray;
    LoadBranchesforSearch();
});

$(function () {
    //Date picker
    $('#fromdate').datetimepicker({
        format: 'L'
    })
    $('#paymentdate').datetimepicker({
        format: 'L'
    })
});

$('#btnAdd').click(function () {
    var CurDate = new Date();
    $("#DOB").val(getFormattedDate(CurDate));
    $("#Pdate").val(getFormattedDate(CurDate));
    LoadBranches();
    LoadGender();
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#Branch").attr("disabled", false);
    $('#MemModal').modal('show');
});

function LoadBranchesforSearch() {
    $('#BranchforSearch').find('option').remove().end();
    BranchforSearch = $('#BranchforSearch');
    BranchArray = [];
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
                BranchArray = Result;
                $.each(Result, function () {
                    BranchforSearch.append($("<option/>").val(this.branchCode).text(this.branchName));
                });
                LoadGenderOptions();
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

function LoadGenderOptions() {
    $('#GenderSearch').find('option').remove().end();
    genderOptions = $('#GenderSearch');
    var genderOptionsList = [
        { Id: "", Name: "--All--" },
        { Id: "Male", Name: "Male" },
        { Id: "Female", Name: "Female" }
    ];
    $.each(genderOptionsList, function () {
        genderOptions.append($("<option/>").val(this.Id).text(this.Name));
    });
    ListprovisionalMemberDetails();
    LoadSearchOption();
}

function LoadSearchOption() {
    $('#SearchOptions').find('option').remove().end();
    searchOptions = $('#SearchOptions');
    var searchOptionsList = [
        { Id: 1, Name: "FullName" },
        { Id: 2, Name: "NIC/PassportNo" },
        { Id: 3, Name: "Phone Number" }
    ];
    $.each(searchOptionsList, function () {
        searchOptions.append($("<option/>").val(this.Id).text(this.Name));
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

function LoadBranches() {
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');
    $.each(BranchArray, function () {
        Branch.append($("<option/>").val(this.branchCode).text(this.branchName));
    });
}

function LoadGender() {
    $('#Gender').find('option').remove().end();
    Gender = $('#Gender');
    var genderOptionsList = [
        { Id: "", Name: "--All--" },
        { Id: "Male", Name: "Male" },
        { Id: "Female", Name: "Female" }
    ];
    $.each(genderOptionsList, function () {
        Gender.append($("<option/>").val(this.Id).text(this.Name));
    });
}

$('#btnSave').click(function () {

    var data = new FormData();
    data.append("Id", $('#Id').val());
    data.append("NIC_PassportNo", $('#NICPaasportNo').val());
    data.append("FullName", $('#fullName').val());
    data.append("DOB", $('#DOB').val());
    data.append("Gender", $('#Gender').val());
    data.append("Age", $('#Age').val());
    data.append("Branch", $('#Branch').val());
    data.append("ContactNo", $('#ContactNo').val());
    data.append("Email", $('#Email').val());
    data.append("HouseNo", $('#HouseNo').val());
    data.append("Street", $('#Street').val());
    data.append("District", $('#District').val());
    data.append("Province", $('#Province').val());
    data.append("Payment", $('#Payment').val());
    data.append("AttendDate", $('#Pdate').val());
    data.append("CreatedBy", $('#CreatedBy').val());
    data.append("CreatedDate", $('#CreatedDate').val());


    if (!$('#fullName').val() || !$('#ContactNo').val() || !$('#Email').val() || !$('#Payment').val() || !$('#Pdate').val()) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    } else if ($('#Branch').val() == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select a Value!',
        });
    } else {
        $("#waitform").css("display", "block");
        $('.modal').addClass('freeze');
        $('.modal-content').addClass('freeze');
        $("#btnSave").attr("disabled", true);
        if ($('#Id').val() == "0" || $('#Id').val() == "") {

            $.ajax({
                type: 'POST',
                url: $("#SaveProvisionalMember").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnSave").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListprovisionalMemberDetails();
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
        else {

            $.ajax({
                type: 'POST',
                url: $("#UpdateProvisionalMember").val(),
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
                        ListprovisionalMemberDetails();
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

function ListprovisionalMemberDetails() {
    $("#wait").css("display", "block");
    var data = new FormData();
    data.append("Branch", $('#BranchforSearch').val());

    $.ajax({
        type: 'POST',
        url: $("#GetProvisionalMemberDetails").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            var gender = $('#GenderSearch').val();
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result;

                provisionalMembersDetailsArray = myData.data;
           
                if (gender != "") {
                    Result = $.grep(myData.data, function (v) {
                        return v.gender == gender;
                    })
                }
                else
                    Result = provisionalMembersDetailsArray;

                var tr = [];
                for (var i = 0; i < Result.length; i++) {
                    tr.push('<tr>');
                    tr.push("<td>" + Result[i].niC_PassportNo + "</td>");;
                    tr.push("<td>" + Result[i].fullName + "</td>");
                    tr.push("<td>" + Result[i].gender + "</td>");
                    tr.push("<td>" + Result[i].payment + "</td>");;
                    tr.push("<td>" + getFormattedDate(new Date(Result[i].attendDate)) + "</td>");;
                    
                    var td = [];
                    td.push('<td>');
                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td.push("<button onclick=\"EditProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2)
                        td.push("<button onclick=\"DeleteProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
                    td.push('</td>');

                    tr.push(td.join(' '));

                    tr.push('</tr>');
                }

                $("#tbodyid").empty();
                $('.tblMember').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblMember").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblMember").css("display", "none");
                MembersDetailsArray = [];
                var tr = [];
                $("#tbodyid").empty();
                $('.tblMember').append($(tr.join('')));
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

function EditProvisionalMember(Id) {
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
    $("#Branch").attr("disabled", true);
    LoadBranches();
    LoadGender();

    var provisionalMemberDetail = $.grep(provisionalMembersDetailsArray, function (v) {
        return v.id == Id;
    })

    if (provisionalMemberDetail.length != 0) {
        var Result = provisionalMemberDetail[0];
       
        $("#Id").val(Result['id']);
        $("#NICPaasportNo").val(Result['niC_PassportNo']);
        $("#fullName").val(Result['fullName']);
        $("#DOB").val(getFormattedDate(new Date(Result.dob)));
        $("#Gender").val(Result['gender']);
        $("#Age").val(Result['age']);
        $("#Branch").val(Result['branch']);
        $("#ContactNo").val(Result['contactNo']);
        $("#Email").val(Result['email']);
        $("#HouseNo").val(Result['houseNo']);
        $("#Street").val(Result['street']);
        $("#District").val(Result['district']);
        $("#Province").val(Result['province']);
        $("#Payment").val(Result['houseNo']);
        $("#Street").val(Result['street']);
        $("#District").val(Result['district']);
        $("#Province").val(Result['province']);
        $("#Payment").val(Result['payment']);
        $("#Pdate").val(getFormattedDate(new Date(Result.attendDate)));
        $("#CreatedBy").val(Result['createdBy']);
        $("#CreatedDate").val(Result['createdDate']);
      
        $("#wait").css("display", "none");
        $('#MemModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}

function Cancel() {
    $('#MemModal').modal('toggle');
}

function DeleteProvisionalMember(Id) {

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
                url: $("#DeleteProvisionalMember").val(),
                dataType: 'json',
                data: '{"Id": "' + Id + '"}',
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
                        ListprovisionalMemberDetails();
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

$("#BranchforSearch").change(function () {
    ListprovisionalMemberDetails();
});

$("#GenderSearch").change(function () {
    $("#wait").css("display", "block");

    var Result = [];
    var gender = $('#GenderSearch').val();

    if (gender != "") {
        Result = $.grep(provisionalMembersDetailsArray, function (v) {
            return v.gender == gender;
        })
    }
    else
        Result = provisionalMembersDetailsArray;

    if (Result.length != 0) {

        var tr = [];
        for (var i = 0; i < Result.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + Result[i].niC_PassportNo + "</td>");;
            tr.push("<td>" + Result[i].fullName + "</td>");
            tr.push("<td>" + Result[i].gender + "</td>");
            tr.push("<td>" + Result[i].payment + "</td>");;
            tr.push("<td>" + getFormattedDate(new Date(Result[i].attendDate)) + "</td>");;

            var td = [];
            td.push('<td>');
            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
            td.push('</td>');

            tr.push(td.join(' '));

            tr.push('</tr>');
        }

        $("#tbodyid").empty();
        $('.tblMember').append($(tr.join('')));
        $("#noRecords").css("display", "none");
        $("#tblMember").css("display", "table");
    } else {
        $("#noRecords").css("display", "block");
        $("#tblMember").css("display", "none");

        var tr = [];
        $("#tbodyid").empty();
        $('.tblMember').append($(tr.join('')));
    }
    $("#wait").css("display", "none");
});

function SearchMembership() {
    $("#wait").css("display", "block");

    var Result = [];
    var gender = $('#GenderSearch').val();

    Result = provisionalMembersDetailsArray;
       

    if (gender != "") {
        Result = $.grep(Result, function (v) {
            return v.gender == gender;
        })
    }

    var searchVal = $('#ValueforSearch').val();
    var searchOpt = $('#SearchOptions').val();

    if (searchOpt == "1") {
        Result = $.grep(Result, function (v) {
            return (v.fullName.search(new RegExp(searchVal, "i")) != -1);
        })
    }
    else if (searchOpt == "2") {
        Result = $.grep(Result, function (v) {
            return (v.niC_PassportNo.search(new RegExp(searchVal, "i")) != -1);
        })
    }
    else {
        Result = $.grep(Result, function (v) {
            return (v.contactNo.search(new RegExp(searchVal, "i")) != -1);
        })
    }

    $("#wait").css("display", "none");
    if (Result.length != 0) {

        var tr = [];
        for (var i = 0; i < Result.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + Result[i].niC_PassportNo + "</td>");;
            tr.push("<td>" + Result[i].fullName + "</td>");
            tr.push("<td>" + Result[i].gender + "</td>");
            tr.push("<td>" + Result[i].payment + "</td>");;
            tr.push("<td>" + getFormattedDate(new Date(Result[i].attendDate)) + "</td>");;

            var td = [];
            td.push('<td>');
            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
            td.push('</td>');

            tr.push(td.join(' '));

            tr.push('</tr>');
        }

        $("#tbodyid").empty();
        $('.tblMember').append($(tr.join('')));
        $("#noRecords").css("display", "none");
        $("#tblMember").css("display", "table");
    } else {
        $("#noRecords").css("display", "block");
        $("#tblMember").css("display", "none");

        var tr = [];
        $("#tbodyid").empty();
        $('.tblMember').append($(tr.join('')));
    }

}

$("#ValueforSearch").bind('keyup', function () {
    SearchMembership();
});