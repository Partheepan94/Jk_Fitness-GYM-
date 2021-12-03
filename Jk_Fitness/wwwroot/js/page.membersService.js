$(document).ready(function () {

    LoadStatus();
    var BranchArray;
    var MembersDetailsArray = [];
});

function LoadStatus() {
    $('#StatusforSearch').find('option').remove().end();
    StatusforSearch = $('#StatusforSearch');
    var StatusList = [
        { Id: true, Name: "Active" },
        { Id: false, Name: "Deactive" }
    ];
    $.each(StatusList, function () {
        StatusforSearch.append($("<option/>").val(this.Id).text(this.Name));
    });
    LoadBranchesforSearch();
    LoadSearchOption();
}

$("#ValueforSearch").bind('keyup', function () {
    SearchMembership();
});

function LoadSearchOption() {
    $('#SearchOptions').find('option').remove().end();
    searchOptions = $('#SearchOptions');
    var searchOptionsList = [
        { Id: 1, Name: "Name" },
        { Id: 2, Name: "NIC" },
        { Id: 3, Name: "Phone Number" },
        { Id: 4, Name: "Membership Id" }
    ];
    $.each(searchOptionsList, function () {
        searchOptions.append($("<option/>").val(this.Id).text(this.Name));
    });
}

function SearchMembership() {
    $("#wait").css("display", "block");
    var searchVal = $('#ValueforSearch').val();

    var searchOpt = $('#SearchOptions').val();

    var Result = [];

    if (searchVal == "") {
        Result = MembersDetailsArray;
    } else {

        if (searchOpt == "1") {
            Result = $.grep(MembersDetailsArray, function (v) {
                return ((v.firstName.search(new RegExp(searchVal, "i")) != -1) || (v.lastName.search(new RegExp(searchVal, "i")) != -1));
            })
        }
        else if (searchOpt == "2") {
            Result = $.grep(MembersDetailsArray, function (v) {
                return (v.nic.search(new RegExp(searchVal, "i")) != -1);
            })
        }
        else if (searchOpt == "3") {
            Result = $.grep(MembersDetailsArray, function (v) {
                return (v.contactNo.search(new RegExp(searchVal, "i")) != -1);
            })
        }
        else {
            Result = $.grep(MembersDetailsArray, function (v) {
                return (v.memberId === parseInt(searchVal));
            })
        }
    }

    $("#wait").css("display", "none");
    if (Result.length != 0) {

        var tr = [];
        for (var i = 0; i < Result.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + Result[i].memberId + "</td>");;
            tr.push("<td>" + Result[i].firstName + " " + Result[i].lastName + "</td>");
            if (Result[i].nic != null)
                tr.push("<td>" + Result[i].nic + "</td>");
            else
                tr.push("<td> - </td>");
            
            tr.push("<td>" + Result[i].contactNo + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(Result[i].packageExpirationDate)) + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + "</td>");
            if (Result[i].active == true)
                tr.push("<td><strong style=\"color:green\">Active</strong></td>");
            else
                tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");
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
                ListMemberDetails();
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

function ListMemberDetails() {
    $("#wait").css("display", "block");
    var data = new FormData();
    data.append("Branch", $('#BranchforSearch').val());
    data.append("Active", $('#StatusforSearch').val());
    $.ajax({
        type: 'POST',
        url: $("#GetMemberDetails").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                MembersDetailsArray = Result;
                var tr = [];
                for (var i = 0; i < Result.length; i++) {
                    tr.push('<tr>');
                    tr.push("<td>" + Result[i].memberId + "</td>");;
                    tr.push("<td>" + Result[i].firstName + " " + Result[i].lastName + "</td>");

                    if (Result[i].nic != null)
                        tr.push("<td>" + Result[i].nic + "</td>");
                    else
                        tr.push("<td> - </td>");

                    tr.push("<td>" + Result[i].contactNo + "</td>");

                    tr.push("<td>" + getFormattedDate(new Date(Result[i].packageExpirationDate)) + "</td>");;
                    tr.push("<td>" + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + "</td>");;
                    if (Result[i].active == true)
                        tr.push("<td><strong style=\"color:green\">Active</strong></td>");
                    else
                        tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");                   

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

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

$("#BranchforSearch").change(function () {
    ListMemberDetails();
});

$("#StatusforSearch").change(function () {
    ListMemberDetails();
});

$("#SearchOptions").change(function () {
    $('#ValueforSearch').val('');
    SearchMembership();
});