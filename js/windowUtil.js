var hd = require("../utils/handleData");
var utils = require("../utils/utils");

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
    $("#message").text("The password is generated");
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
            $("#message").parent()[0].style.display = "flex";
            $("#message").text("Item already exists or error occured");
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
    let conf = confirm("Are you sure to delete the key ".concat(keyVal));
    if(!conf)
        return;

    hd.deleteJsonData($(hdnID).val(), function(message) {
        // refresh items list after remove
        $(itemID).remove();
        
        $("#message").parent()[0].style.display = "flex";
        $("#message").text(message);
    });
}