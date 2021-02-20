var hd = require("../utils/handleData");
var utils = require("../utils/utils");
const { Confirm } = require('../utils/confirm-dialog');


function removeFlashMessage(className){
    setTimeout(function(){
        $(className).fadeOut('fast');
    }, 2000);
}

// show password when input field is focused
exports.showPassword = (item) => {
    if (item.type === "password")
        item.type = "text";
}

// hide password when another field is focused
exports.hidePassword = (item) => {
    if (item.type === "text")
        item.type = "password";
}

// generate password and set to the password field
exports.generatePassword = (item) => {
    let btnID = $(item).attr("id");
    let index = parseInt(btnID.replace("gbtn_", ""));
    let valueID = "#value".concat("_", index.toString());

    let randomPassword = utils.generateRandomPassword();

    $(valueID).val(randomPassword);

    $("#message").parent()[0].style.display = "flex";
    $("#message").text("Random password generated.");
    removeFlashMessage(".alert.alert-success");
    
}

exports.loadItems = (callback) => {
    hd.loadJsonData(function(jsonData) {
        var elements = jsonData.data;
        callback(elements);
    });
}

// update item in the data file
exports.updateItem = (item) => {
    let btnID = $(item).attr("id");
    let index = parseInt(btnID.replace("sbtn_", ""));
    let hdnID = "#hdn".concat("_", index.toString());
    let keyID = "#key".concat("_", index.toString());
    let valueID = "#value".concat("_", index.toString());

    if ($(keyID).val().length == 0 || $(valueID).val().length == 0)
        return;

    hd.updateJsonData($(hdnID).val(), $(keyID).val(), $(valueID).val(), function(message) {
        $("#message").parent()[0].style.display = "flex";
        $("#message").text(message);
        removeFlashMessage(".alert.alert-success");
    });
    
    $(hdnID).val($(keyID).val());
}

// add item to the data file
exports.addItem = (item, callback) => {
    let btnID = $(item).attr("id");
    let index = parseInt(btnID.replace("sbtn_", ""));
    let keyID = "#key".concat("_", index.toString());
    let valueID = "#value".concat("_", index.toString());

    if ($(keyID).val().length == 0 || $(valueID).val().length == 0) {
        callback(null);
        return;
    }

    hd.addJsonData($(keyID).val(), $(valueID).val(), function(element) {
        if(element == null){
            $("#error-message").parent()[0].style.display = "flex";
            $("#error-message").text("Item already exists or error occured");
            removeFlashMessage(".alert.alert-danger");
        }
        $(keyID).val("");
        $(valueID).val("");
        callback(element);
    });
    callback(null);
}

// delete item from the data file
exports.deleteItem = (item) => {
    let btnID = $(item).attr("id");
    let index = parseInt(btnID.replace("dbtn_", ""));
    let hdnID = "#hdn".concat("_", index.toString());
    let keyID = "#key".concat("_", index.toString());
    let itemID = "#item".concat("_", index.toString());

    let keyVal = $(keyID).val();
    Confirm(
        "Confirm",
        "Are you sure to delete the key ".concat(keyVal),
        "Yes",
        "No", 
        function(isConfirm){
            if(isConfirm){
                hd.deleteJsonData($(hdnID).val(), function(message) {
                    // refresh items list after remove
                    $(itemID).remove();
    
                    $("#message").parent()[0].style.display = "flex";
                    $("#message").text(message);
                    removeFlashMessage(".alert.alert-success");
                });
            }
            else {
                return;
            }
        }
    );
}