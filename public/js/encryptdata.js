const CryptoJS = require('crypto-js');
exports.encryptdata = (results) => {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(results), 'poi212').toString();
    return ciphertext;
}