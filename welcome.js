const ipc = require('electron').ipcRenderer;
const fs = require("fs");

var cryp = require("./utils/cryptography");
const handleData = require("./utils/handleData");

const submitBtn = document.querySelector('#pswd-submit');
const titleHead = document.querySelector('#title');
let masterKey = "";
let isMasterPassword = false;

fs.readFile("./data/data.json", "utf8", function (err, data) {
    if (err) return null;
    jsonData = JSON.parse(data);
    if (jsonData.masterKey) {
        isMasterPassword = true;
        masterKey = cryp.decrypt(jsonData.masterKey);
        titleHead.innerHTML = "Enter your Master Password"
    } else {
        titleHead.innerHTML = "Create your Master Password"
    }
    // console.log(jsonData.masterKey);
});

submitBtn.addEventListener('click', function () {
    enteredPass = document.querySelector("#master-key").value;
    if (isMasterPassword) {
        if (enteredPass === masterKey) {
            ipc.send('load-page', 'file://' + __dirname + '/index.html');
        } else {
            console.log("Wrong Password");
        }
    }
    else {
        handleData.loadJsonData(function (jsonData) {
            let data = jsonData;
            data.masterKey = cryp.encrypt(enteredPass);
            // console.log(jsonData);
            fs.writeFile("./data/data.json", JSON.stringify(jsonData, null, 2), function (err) {
                if (err) {
                    console.log(err);
                }
                ipc.send('load-page', 'file://' + __dirname + '/index.html');
            });
        });
    }
});

$('.unmask').on('click', function () {
    console.log("CLICKED Eye");
    if ($(this).prev('input').attr('type') == 'password')
        $(this).prev('input').prop('type', 'text');
    else
        $(this).prev('input').prop('type', 'password');
    return false;
});
//Begin supreme heuristics 
$('.password').on('keyup', function () {
    var p = $('#master-key');
    if(p.val().length == 0){
        $('#strong span').removeClass().html("");

    }
    else if (p.val().length > 0) {
        var s = 'weak'
        if (p.val().length > 5 && p.val().match(/\d+/g)){
            s = 'medium';
            console.log("medium");
        }
        if (p.val().length > 6 && p.val().match(/[^\w\s]/gi)){
            s = 'strong';
            console.log("strong");
        }
        // console.log("weak");
        $('#strong span').removeClass();
        $('#strong span').addClass(s).html(s);
    }
});