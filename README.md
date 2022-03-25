
![image](https://user-images.githubusercontent.com/9484568/159940021-0f88d42c-5b5d-43d1-901f-7d4990b243f9.png)

##  Docu Sign Dapp 
 **_A decentralised alternative to signing encrypted documents_**

This application allows documents to be uploaded encrypted with AES to ipfs and signed on the blockchain.

Compatible evm networks supported are Mumbai and Polygon mainnet.

Test it! https://opensigndapp.com:9043/

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




This application is divided into 5 steps.

#### Step 1 - Credit management
![STEP1](https://user-images.githubusercontent.com/9484568/159970658-8d40c4e0-8794-41da-8546-b3c0cdc066c5.gif)
If you want to use this service, credits must be purchased.

The credit corresponds to the number of documents you can upload to ipfs and sign.

So 1 credit = 1 upload on ipfs = 1 signature

On the mumbai network it is possible to use the service up to three credits per address (in order to limit spam and/or indiscriminate use of the ipfs upload).

####  Step 2 - Encrypt file and enable sign
![STEP2](https://user-images.githubusercontent.com/9484568/159970668-1d81bbcd-3764-4557-86f1-cd937442069a.gif)
Here you must decide which document to upload and which password to use.

The longer and more complicated your password, the more secure the encryption on ipfs will be.

Don't forget your password, otherwise it will not be possible to recover the decrypted document.

#### Step 3 - Sign on chain
![STEP3](https://user-images.githubusercontent.com/9484568/159970691-4dcabc79-42e2-4742-91cd-85a43905ac2b.gif)
Here you can sign the documents uploaded on step 2.

The button is not disabled if you have enabled it in step2.

During the process signing you will have to confirm two times

- the first time you confirm the ipfs link hashed which becomes the message to sign
- the second time you confirm the transaction on chain

#### Step 4 -  Ping and decrypt a ipfs file
![STEP4](https://user-images.githubusercontent.com/9484568/159970698-9d545671-aedf-47c1-b1f5-1c0c85922157.gif)
Here you can decrypt an encrypted file over ipfs.

To do this you need the document code ( cid ). 

You can paste it into the appropriate input, ping it, check then if you can see it encrypted in the browser clicking on the yellow link.

If you can see it, it means that you can download it by pressing the _decrypt_ button. 

Keep in mind that if it is the first time you download it from ipfs, it may take a few minutes until it is visible in the browser.

So keep the link _https://ipfs.io/ipfs/CID-CODE_ loading long enough for the file to be found on the network.

Before continuing you should know how to connect 

#### Step 5 - Signature table
![STEP5](https://user-images.githubusercontent.com/9484568/159970705-1f36d00b-e804-4b73-a5af-f87bc78b1fc2.gif)


Here you can see the list of your past signatures.

Click on the button reload one or two times , if you don't see your signed docs.

You can copy the cid to decrypt it in step4.

### Disclaimer of liability 

The user assumes all responsibility and risk for the use of this website and the Internet generally. We accept no liability or responsibility to any person as a consequence of any reliance upon the information contained in this site. Under no circumstances, including negligence, shall anyone involved in creating or maintaining this website be liable for any direct, indirect, incidental, special or consequential damages, or loss profits that result from the use or inability to use the website and/or any other websites which are linked to this site. Nor shall they be liable for any such damages including, but not limited to, reliance by a member or visitor on any information obtained via the website; or that result from mistakes, omissions, interruptions, deletion of files, viruses, errors, defects, or failure of performance, communications failure, theft, destruction or unauthorised access. States or Countries which do not allow some or all of the above limitations of liability, liability shall be limited to the greatest extent allowed by law. 