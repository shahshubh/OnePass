const ipc = require('electron').ipcRenderer;
const fs = require("fs");
const passwordValidator = require('password-validator');
const passwordStrength = require('check-password-strength')
const { Confirm } = require('./utils/confirm-dialog');

var cryp = require("./utils/cryptography");
const handleData = require("./utils/handleData");

const submitBtn = document.querySelector('#pswd-submit');
const titleHead = document.querySelector('#title');
const inputField = document.querySelector("#master-key");
let masterKey = "";
let isMasterPassword = false;
let schema = new passwordValidator();

// password validator schema
schema
    .is().min(6)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                            // Must have uppercase letters
    .has().lowercase(1)                              // Must have lowercase letters
    .has().digits(1)
    .has().symbols(1)                                // Must have at least 2 digits/
    .has().not().spaces();

// Flash message
$("#message-cross").on("click", function () {
    $("#message").parent()[0].style.display = "none";
});

$('#master-key').focus();

// submit
function submitBtnHandler() {
    enteredPass = document.querySelector("#master-key").value;
    if (isMasterPassword) {
        if (enteredPass === masterKey) {
            ipc.send('load-page', 'file://' + __dirname + '/index.html');
        } else {
            // show error msg
            $("#message").parent()[0].style.display = "flex";
            $("#message").text("Wrong Password !!");
        }
    }
    else {
        if (schema.validate(enteredPass)) {
            // let conf = confirm("Are you sure you want to set this as master password ?\nThere is no way back if you forget it !!");

            Confirm(
                'Alert',
                'Are you sure you want to set this as master password?\nThere is no way back if you forget it !!',
                'Yes, I\'m Sure',
                'Cancel',
                function(isConfirm){
                    if(isConfirm){
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
                    else{
                        return;
                    }
                }
            );            
        } else {
            // show error message
            $("#message").parent()[0].style.display = "flex";
            $("#message").text("Password must be 6-100 characters long and contain at least 1 upper case letter, 1 number, 1 special character");
        }
    }
}



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
});


// submit button click
submitBtn.addEventListener('click', submitBtnHandler);
// inputField.addEventListener('keyup', function(e){
//     if (e.keyCode  === 13) {
//         e.preventDefault();
//         console.log("ENTER");
//         // submitBtnHandler();
//     }
// });

function keyPressHandler(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        submitBtnHandler();
    }

}



$('.unmask').on('click', function () {
    if ($(this).prev('input').attr('type') == 'password')
        $(this).prev('input').prop('type', 'text');
    else
        $(this).prev('input').prop('type', 'password');
    return false;
});


$('.password').on('keyup', function (e) {

    // remove the error message only if enter key is not pressed
    e.keyCode !== 13 ? $("#message").parent()[0].style.display = "none" : null;

    var p = $('#master-key');
    if (p.val().length == 0) {
        $('#strong span').removeClass().html("");
    }
    else {
        let pwdStrength = passwordStrength(p.val()).value.toLowerCase();
        $('#strong span').removeClass();
        $('#strong span').addClass(pwdStrength).html(pwdStrength);
    }
});




