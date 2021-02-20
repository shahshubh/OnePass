const crypto = require('crypto');
const configs = require("../configs/configs.json");

// encryption key
// get the encryption key from file or user environment
const ENCRYPTION_KEY = configs.ENCRYPTION_KEY;
const IV_LENGTH = configs.IV_LENGTH;
const ALGORITHM = configs.ALGORITHM;

exports.encrypt = (clearText) => {
    var iv = crypto.randomBytes(IV_LENGTH);
    var cipher = crypto.createCipheriv(ALGORITHM, new Buffer.from(ENCRYPTION_KEY), iv);
    var encrypted = cipher.update(clearText);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    let value = iv.toString('hex') + ':' + encrypted.toString('hex')

    return value;
}

exports.decrypt = (encrypted) => {
    var parts = encrypted.split(':');
    var iv = new Buffer.from(parts.shift(), 'hex');
    var encryptedText = new Buffer.from(parts.join(':'), 'hex');
    var decipher = crypto.createDecipheriv(ALGORITHM, new Buffer.from(ENCRYPTION_KEY), iv);
    var decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
}