var wutil = require("./windowUtil");

var templates = require("./templates");
var cryp = require("../utils/cryptography");

exports.templateContent = (element, index) => {
    var content = templates.pwdItemTemplate.replace('%KEY%', cryp.decrypt(element.key)).replace('%VALUE%', cryp.decrypt(element.value)).replace('%HDNKEY%', cryp.decrypt(element.key));
    content = content.replace('%ITEMID%', "item".concat("_", index.toString()));
    content = content.replace('%KEYID%', "key".concat("_", index.toString()));
    content = content.replace('%HDNKEYID%', "hdn".concat("_", index.toString()));
    content = content.replace('%VALUEID%', "value".concat("_", index.toString()));
    content = content.replace('%GENBTNID%', "gbtn".concat("_", index.toString()));
    content = content.replace('%SAVEBTNID%', "sbtn".concat("_", index.toString()));
    content = content.replace('%DELBTNID%', "dbtn".concat("_", index.toString()));

    return content;
}

exports.templateBinder = () => {
    $(".value").bind("focus", function() {
        wutil.showPassword(this);
    });

    $(".value").bind("blur", function() {
        wutil.hidePassword(this);
    });

    $(".generate").bind("click", function() {
        wutil.generatePassword(this);
    });

    $(".save").bind("click", function() {
        wutil.updateItem(this);
    });

    $(".delete" ).bind("click", function() {
        wutil.deleteItem(this);
    });
}