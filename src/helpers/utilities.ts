
import CryptoJS from 'crypto-js'

export function ellipseAddress(
  address: string = "",
  width: number = 5
): string {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function encrypt(msg, pass) {
  var keySize = 256;
  
  var iterations = 30000 + Math.round(pass.lenght * Math.random() * 66);

  var salt = CryptoJS.lib.WordArray.random(128 / 8);

  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations
  });

  var iv = CryptoJS.lib.WordArray.random(128 / 8);

  var encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC

  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitmessage;
}

export function decrypt(transitmessage, pass) {
  var keySize = 256;
  
  var iterations = 30000 + Math.round(pass.lenght * Math.random() * 66);
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
  var encrypted = transitmessage.substring(64);

  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations
  });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC

  })
  return decrypted;
}

export function getWordArray(file){

  return   CryptoJS.lib.WordArray.create(file);
}