$(document).ready(function () {
    LoadBranch();
    var ProductArray;
});


function LoadBranch() {
    $("#wait").css("display", "block");
    $('#BranchforSearch').find('option').remove().end();
    BranchforSearch = $('#BranchforSearch');

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
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                BranchArray = myData.data;
                $.each(Result, function () {
                    BranchforSearch.append($("<option/>").val(this.branchCode).text(this.branchName));
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }
            ListProductDetails();
        },
        error: function (jqXHR, exception) {
        }
    });
}


function ListProductDetails() {
    $("#wait").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetProductDetails").val(),
        data: { BranchId: $('#BranchforSearch').val() },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            
            if (myData.code == "1") {
                var ProdList = myData.data;
                ProductArray = myData.data;
                BindProductList(ProdList);
               
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }
            $("#wait").css("display", "none");
        },
        error: function (jqXHR, exception) {
        }
    });
}


function increase(id,AvailableStock) {
    document.getElementById("Decr" + id).disabled = false;
    var textBox = document.getElementById("text" + id);
    textBox.value++;
    if (parseInt(textBox.value) > parseInt(AvailableStock)) {
        document.getElementById("Incr" + id).disabled = true;
        textBox.value--;
    } else {
        document.getElementById("Incr" + id).disabled = false;
    }
    
}

function decrease(id) {
    document.getElementById("Incr" + id).disabled = false;
    var textBox = document.getElementById("text" + id);
    textBox.value--;
    if (parseInt(textBox.value) ==0) {
        document.getElementById("Decr" + id).disabled = true;
    }
}

$("#BranchforSearch").change(function () {
    $('#PnameforSearch').val("");
    ListProductDetails();
});

function Sold(id) {
    var textBox = document.getElementById("text1");
    

    $("#wait").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#UpdateProductQuantity").val(),
        data: { Productid: parseInt(id), count: parseInt(textBox.value) },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Updated',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
            ListProductDetails();
        },
        error: function (jqXHR, exception) {
        }
    });
}

function BindProductList(ProdList) {
    const Product = document.querySelector(".productHolder");
    Product.innerHTML = "";
    let code;
    for (var i = 0; i < ProdList.length; i++) {

        code = '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">' +
            '<div class="cui-ecommerce--catalog--item">' +
            '<div class="cui-ecommerce--catalog--item--img">' +
            '<div class="cui-ecommerce--catalog--item--like cui-ecommerce--catalog--item--like__selected">' +
            '<i class="icmn-heart3 cui-ecommerce--catalog--item--like--liked"> </i>' +
            '<i class="icmn-heart4 cui-ecommerce--catalog--item--like--unliked"> </i>' +
            '</div>' +
            '<a href="javascript: void(0);">' +
            '<img src="data:image/jgp;base64,' + ProdList[i].productImage + ' " />' +
            //     '<img src="data:image/jgp;base64,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">'+
            ' </a>' +
            ' </div>' +
            '<div class="cui-ecommerce--catalog--item--title">' +
            ' <a href="javascript: void(0);">' + ProdList[i].productName + '</a>' +
            '  </div>' +
            '<div class="cui-ecommerce--catalog--item--description">' +
            ' <a href="javascript: void(0);" style="color: black;">' + ProdList[i].description + '</a>' +
            ' <div class="cui-ecommerce--catalog--item--price">  Rs. ' + ProdList[i].pricePerProduct + ' ' +
            '</div>' +
            '  </div>' +
            ' <div class="cui-ecommerce--catalog--item--descr">' +
            '<label style="padding-right: 5px;color: black;">Quantity </label>' +
            '<button type="button" id="Decr' + ProdList[i].productId + '" onclick="decrease(' + ProdList[i].productId + ')" class="btn-primary" disabled>-</button>' +
            '<input type="text" id="text' + ProdList[i].productId + '" value="0" style="width: 30px;">' +
            '<button type="button" id="Incr' + ProdList[i].productId + '" onclick="increase(' + ProdList[i].productId + ',' + ProdList[i].availableStock + ')" class="btn-primary">+</button>' +
            '<label style="font-size: small;font-style: normal;padding-left: 5px;">Only ' + ProdList[i].availableStock + ' items left </label>' +
            ' </div>' +
            '<div class="cui-ecommerce--catalog--item--descr"> <button type="button" onclick="Sold(' + ProdList[i].productId + ')" class="btn btn-danger"style="width: -webkit-fill-available;">Sold</button>  </div>' +
            ' </div>' +
            '</div>';


        Product.innerHTML += code;

    }

}

$("#PnameforSearch").bind('keyup', function () {
    $("#wait").css("display", "block");

    var ProductName = $('#PnameforSearch').val();
    var Result = $.grep(ProductArray, function (v) {
        return (v.productName.search(new RegExp(ProductName, "i")) != -1);
    })

    $("#wait").css("display", "none");
    BindProductList(Result);
});