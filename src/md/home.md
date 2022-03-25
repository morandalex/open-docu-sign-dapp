
![image](https://user-images.githubusercontent.com/9484568/159940021-0f88d42c-5b5d-43d1-901f-7d4990b243f9.png)

##  Docu Sign Dapp 
 **_A decentralised alternative to signing encrypted documents_**

This application allows documents to be uploaded encrypted with AES to ipfs and signed on the blockchain.

Compatible evm networks supported are Mumbai and Polygon mainnet.



**Starting using this dapp**

If you have already installed Metamask, click on connect.

Don't you have it? No problem,check the official website:

https://metamask.io/

If you want to test this app, you can do it asking MATIC on the mumbai faucet.

Check here:

https://faucet.polygon.technology/

### Tech used

**Backend**

Digital Ocean ubuntu server

Nginx 

**Frontend**

Nextjs

Chakraui

**Smart contract, web3 , ipfs**

Solidity smart contract deployed on Mumbai testnet and Polygon Mainnet

Wagmi hooks 

Ipfs node

### Security considerations 

The documents are encrypted with AES using crypto-js lib.

```js
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

var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
return transitmessage;
}
```
#### Disclaimer of liability 

The user assumes all responsibility and risk for the use of this website and the Internet generally. We accept no liability or responsibility to any person as a consequence of any reliance upon the information contained in this site. Under no circumstances, including negligence, shall anyone involved in creating or maintaining this website be liable for any direct, indirect, incidental, special or consequential damages, or loss profits that result from the use or inability to use the website and/or any other websites which are linked to this site. Nor shall they be liable for any such damages including, but not limited to, reliance by a member or visitor on any information obtained via the website; or that result from mistakes, omissions, interruptions, deletion of files, viruses, errors, defects, or failure of performance, communications failure, theft, destruction or unauthorised access. States or Countries which do not allow some or all of the above limitations of liability, liability shall be limited to the greatest extent allowed by law. 