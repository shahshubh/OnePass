const configs = require("../configs/configs.json");

// password length for random generation
const PWDLENGTH = configs.PWDLENGTH;

// creates cryptographically strong random and complex password
exports.generateRandomPassword = () => {
    var alphabet = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwYyZz";
    var numbers = "0123456789";
    var signs = "!-@*";
    var random = [];
    var array = new Uint32Array(PWDLENGTH);
    //the Crypto.getRandomValues() method creates cryptographically strong random values
    window.crypto.getRandomValues(array);

    array.forEach(element => {
        if (element % 3 == 0)
            random.push(alphabet[element % 50]);
        else if (element % 3 == 1)
            random.push(numbers[element % 10]);
        else if (element % 3 == 2)
            random.push(signs[element % 4]);
    });

    return random.join("");
}