$(document).ready(function () {
    LoadPersonalTraining();
    var personalTraining;
});

function LoadPersonalTraining() {
    
    $("#wait").css("display", "block");

    $.ajax({
        type: 'GET',
        url: $("#LoadPersonalTraining").val(),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                personalTraining = Result;
                if (personalTraining.length != 0) {
                    bindPersonalTraining(personalTraining);
                    $("#noRecords").css("display", "none");
                    $("#tblstaff").css("display", "table");
                }
                else {
                    $("#noRecords").css("display", "block");
                    $("#tblstaff").css("display", "none");

                    var tr = [];
                    $("#tbodyid").empty();
                    $('.tblstaff').append($(tr.join('')));
                }

            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblstaff").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblstaff').append($(tr.join('')));
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

function bindPersonalTraining(Result) {
    var tr = [];

    $.each(Result, function (key, payment) {
        tr.push('<tr>');
        tr.push("<td>" + payment.memberId + "</td>");
        tr.push("<td>" + payment.staffId + "</td>");
        tr.push("<td>" + payment.branch + "</td>");
        tr.push("<td>" + payment.staffName + "</td>");
        tr.push("<td>" + payment.trainingAmount + "</td>");
        tr.push("<td>" + getFormattedDate(new Date(payment.trainingDate)) + "</td>");

        var td = [];
        td.push('<td>');
        if ($('#delete').val() == 1 || $('#delete').val() == 2)
            td.push("<button type=\"button\" onclick=\"DeletePersonalTraining('" + payment.id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button>");
        td.push('</td>');

        tr.push(td.join(' '));

        tr.push('</tr>');
    });

    $("#tbodyid").empty();
    $('.tblstaff').append($(tr.join('')));
    $("#noRecords").css("display", "none");
    $("#tblstaff").css("display", "table");
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function DeletePersonalTraining(Id) {

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
                url: $("#DeletePersonalTraining").val(),
                data: { Id: parseInt(Id) },
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem('token'),
                },
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
 
                    LoadPersonalTraining();
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
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
    })
}