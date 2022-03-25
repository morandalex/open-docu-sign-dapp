import React, { useState, useEffect } from 'react'
import { id, splitSignature, defaultAbiCoder, keccak256, verifyMessage, arrayify } from 'ethers/lib/utils'
import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import HOME from '../../md/home.md'
import HOWTO from '../../md/howTo.md'
import { useAccount, useSigner, useContract, useBalance, useNetwork, useConnect } from 'wagmi'
import contractData from '../../json/contracts.json'
import TablePaginated from '../table'
import {
  Code,
  Heading,
  List,
  ListItem,
  ListIcon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Progress,
  useClipboard,
  Input,
  Text,
  Link,
  Box,
  Button,
  VStack,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react'
import { ellipseAddress, encrypt, decrypt, getWordArray } from '../../helpers/utilities'
import { create } from "ipfs-http-client";

// @ts-ignore
const client = create(process.env.NEXT_PUBLIC_IPFS_RPC)

export const SignMessage = () => {

  const toast = useToast()
  const [{ data: connectData }] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data: networkData, error, loading }, switchNetwork] = useNetwork()
  const [{ data: signer, error: signerError, loading: signerLoading }, getSigner] = useSigner()
  const signContractMumbai = useContract({
    addressOrName: contractData.mumbai.opensign.address,
    contractInterface: contractData.mumbai.opensign.abi,
    signerOrProvider: signer
  })
  const signContractPolygon = useContract({
    addressOrName: contractData.polygon.opensign.address,
    contractInterface: contractData.polygon.opensign.abi,
    signerOrProvider: signer
  })
  const [addressBalance, setAddressBalance] = useState('')
  const [{ data: balanceData }, getBalance] = useBalance({
    addressOrName: addressBalance,
    watch: false,
    skip: !connectData.connected
  })
  const [message, setMessage] = useState('')
  const [toggleSign, setToggleSign] = useState(false)
  const [toggleBuy, setToggleBuy] = useState(false)
  const [loadingString, setLoadingString] = useState([]);
  const [table, setTable] = useState([]);
  const [userCidList, setUserCidList] = useState([]);
  const [progressValue, setProgressValue] = useState(0)
  const [docsOrdered, setDocsOrdered] = useState(1)
  const [allowanceCredit, setAllowanceCredit] = useState(0)
  const [fileExtension, setFileExtension] = useState('txt')
  const [selectedCid, setSelectedCid] = useState('')
  const [decryptingPassphrase, setDecryptingPassphrase] = useState('')
  const [signatureInfo, setSignatureInfo] = useState(
    {
      message: '',
      hash: '',
      description: '',
      signer: '',
      sig_v: 0,
      sig_r: '',
      sig_s: '',
      signature: '',
      payload: '',
      payloadHash: '',
    }
  )
  const { hasCopied, onCopy } = useClipboard(JSON.stringify(signatureInfo, null, 4))
  const [docEncrypted, setDocEncrypted] = useState(null);
  const [key, setKey] = useState('')
  const [keyChecked, setKeyChecked] = useState('')
  const [docTypeOrName, setDocTypeOrName] = useState("ID#1")
  const [enableSign, setEnableSign] = useState(false)
  const [priceInDollar, setPriceInDollar] = useState(0)
  const [priceInWei, setPriceInWei] = useState(0)
  useEffect(() => {
    async function initData() {
      if (connectData.connected) {
        if (addressBalance != accountData.address) {
          await console.log(accountData.address)
          await setAddressBalance(accountData.address)
          await getBalance()
          //if (signer) {
          //}
        }
        await getBalance()
        await getCashierProductPriceDollar()
        await getCashierProductPriceWei()
        await getSignAllowanceCredit()
        setTimeout(async () => await getAccountSignatures(), 2000)
      }
    }
    initData()
  }, [connectData?.connected, accountData?.address, signer])
  const setupDecryptingPassphrase = (e) => {
    setDecryptingPassphrase(e.target.value)
  }
  const changeCid = (e) => {
    console.log(e.target.value)
    setSelectedCid(e.target.value)
  }
  const setupPassphrase = (e) => {
    setKey(e.target.value)
  }
  const setupPassphraseChecked = (e) => {
    setKeyChecked(e.target.value)
  }
  const setupDocType = (e) => {
    setDocTypeOrName(e.target.value)
  }
  const retrieveFile = (e) => {
    setEnableSign(false)
    setMessage('')
    setSignatureInfo(
      {
        message: '',
        hash: '',
        description: '',
        signer: '',
        sig_v: 0,
        sig_r: '',
        sig_s: '',
        signature: '',
        payload: '',
        payloadHash: '',
      }
    )
    const data = e.target.files[0];
    let file = (e.target.files[0].name)
    let ext = file.split('.').pop()
    console.log('extension:' + ext)
    setFileExtension(ext)
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      //console.log("Buffer data ");
      //console.log(reader.result)
      // var keyChecked = "1234567887654321";
      let wordArray = getWordArray(reader.result);
      let encrypted = encrypt(wordArray, keyChecked)
      //            // Convert: ArrayBuffer -> WordArray
      //var encrypted = CryptoJS.AES.encrypt(wordArray, aeskey);        // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)
      setDocEncrypted(encrypted)
    }
    e.preventDefault();
  }
  async function handleSubmit() {
    console.log('Upload on ipfs encrypted file')
    if (docEncrypted != null) {
      setKeyChecked('')
      try {
        const created = await client.add(docEncrypted, {
          pin: true  // <-- this is the default
        });
        console.log(created.path)
        if (created.path == message) {
          setEnableSign(false)
          alert('already signed. change document')
        } else {
          setEnableSign(true)
          setMessage(created.path)
        }
      } catch (e) {
        console.log(e.message);
        toast({
          title: 'Error',
          description: e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    } else { console.log('docEncrypted null') }
  };
  function handleChange(e) {
    if (e.target.value != message) {
      setMessage(e.target.value);
    } else {
    }
  }
  async function sign(docContent) {
    setLoadingString(loadingString.filter((item) => item == ''));
    setLoadingString((old) => [...old, 'Start of signing process'])
    if (docContent != '') {
      setToggleSign(true)
      console.log('ipfs creation')
      //handleSubmit()
      setProgressValue(25)
      setSignatureInfo(
        {
          message: '',
          hash: '',
          description: '',
          signer: '',
          sig_v: 0,
          sig_r: '',
          sig_s: '',
          signature: '',
          payload: '',
          payloadHash: '',
        }
      )
      let docContentHash = id(docContent);
      let _id = fileExtension + '|' + docTypeOrName
      console.log('check content->' + docContent + '=' + docContentHash)
      setLoadingString((old) => [...old, 'CID created'])
      setProgressValue(40)
      let payload = defaultAbiCoder.encode(["bytes32", "string"], [docContentHash, _id]);
      console.log("Payload:", payload);
      let payloadHash = keccak256(payload);
      console.log("PayloadHash:", payloadHash);
      setLoadingString((old) => [...old, 'Payload hash created'])
      setProgressValue(65)
      // This adds the message prefix
      let signatureRes = await signer.signMessage(arrayify(payloadHash));
      let sig = splitSignature(signatureRes);
      console.log("Signature r : ", sig.r);
      console.log("Signature s : ", sig.s);
      console.log("Signature v : ", sig.v);
      setLoadingString((old) => [...old, 'Documents signed'])
      let address = verifyMessage(arrayify(payloadHash), sig);
      console.log("Check if signature is correcte recovering address:", address);
      setLoadingString((old) => [...old, 'Address verified. Please confirm transaction.'])
      setProgressValue(70)
      try {
        const gasPrice = await getGasPrice()
        console.log('GAAAAS' + gasPrice)
        let tx;
        if (networkData.chain?.id === 80001) {
          tx = await signContractMumbai.registerOnBehalfOf(docContentHash, _id, docContent, address, sig.v, sig.r, sig.s, { gasPrice: gasPrice });
        } else if (networkData.chain?.id === 137) {
          tx = await signContractPolygon.registerOnBehalfOf(docContentHash, _id, docContent, address, sig.v, sig.r, sig.s, { gasPrice: gasPrice });
        }
        console.log("Transaction:", tx.hash);
        setLoadingString((old) => [...old, 'Signature registered onchain...wait 1 minute for the event'])
        setProgressValue(80)
        let receipt = await tx.wait();
        console.log("Receipt Status:", receipt.status);
        setLoadingString((old) => [...old, 'Event received'])
        setProgressValue(90)
        setLoadingString((old) => [...old, 'Got onchain data about list of cids '])
        let row = { docId: docTypeOrName, cid: docContent, blockTimeStamp: '' }
        setTable(prev => [...prev, row])
        receipt.events.forEach((event) => {
          console.log("Event:", event.eventSignature, event.args);
        });
        await getSignAllowanceCredit()
        setProgressValue(100)
      }
      catch (e) {
        toast({
          title: 'Error',
          description: e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        console.log(e.message)
        setToggleSign(false)
        setProgressValue(0)
        setEnableSign(false)
        setLoadingString((old) => [...old, 'End of signing process'])
      }
      setSignatureInfo(
        {
          message: docContent,
          hash: docContentHash,
          description: docTypeOrName,
          signer: address,
          sig_v: sig.v,
          sig_r: sig.r,
          sig_s: sig.s,
          signature: signatureRes,
          payload: payload,
          payloadHash: payloadHash,
        }
      )
      setToggleSign(false)
      setProgressValue(0)
      setSelectedCid(message)
    } else {
      alert('message empty')
    }
    setEnableSign(false)
    setLoadingString((old) => [...old, 'End of signing process'])
  }
  async function getAccountSignatures() {
    setUserCidList(userCidList.filter((item) => item == ''));
    setTable(table.filter((item) => item == ''));
    //console.log(userCidList)
    let list = []
    let tx;
    try {
      if (networkData.chain?.id === 80001) {
        tx = await signContractMumbai.getDocSignedByUsers();
      } else if (networkData.chain?.id === 137) {
        tx = await signContractPolygon.getDocSignedByUsers();
      }
      // console.log(tx)
    } catch (e) {
      console.log(e.message)
    }
    try {
      await tx.map((item, i) => {
        let row = { docId: item[0], cid: item[1], blockTimeStamp: item[2].toString() }
        list.push(row)
      })
      setUserCidList(list)
    } catch (e) {
      console.log(e.message)
    }
    try {
      let list = []
      await userCidList.map((item, i) => {
        let row = { docId: item.docId, cid: item.cid, blockTimeStamp: item.blockTimeStamp }
        list.push(row)
      })
      let listOrdered = list.sort(function (a, b) { return parseFloat(b.blockTimeStamp) - parseFloat(a.blockTimeStamp) })
      setTable(listOrdered)
    } catch (e) {
      console.log(e.message);
    }
  }
  function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index = 0, word, i;
    for (i = 0; i < length; i++) {
      word = arrayOfWords[i];
      uInt8Array[index++] = word >> 24;
      uInt8Array[index++] = (word >> 16) & 0xff;
      uInt8Array[index++] = (word >> 8) & 0xff;
      uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
  }
  async function fetchIPFSDoc(ipfsHash) {
    try {
      const url = 'https://ipfs.io/ipfs/' + ipfsHash;
      const response = await fetch(url);
      return await response.text();
    }
    catch (e) {
      alert(e.message)
    }
  }
  async function getDecryptedFile() {
    try {
      console.log(selectedCid)
      let enc = await fetchIPFSDoc(selectedCid)
      //console.log('enc'+enc)
      let pass = decryptingPassphrase; // user entered pwrd    salt  = 'some system determined salt';
      var decrypted = decrypt(enc, pass);               // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
      var typedArray = convertWordArrayToUint8Array(decrypted);               // Convert: WordArray -> typed array
      var fileDec = new Blob([typedArray]);                                   // Create blob from typed array
      var a = document.createElement("a");
      var url = window.URL.createObjectURL(fileDec);
      var filename = 'decrypted' + "." + fileExtension.replace(/(.*)\//g, '');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.log(e.message)
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }
  function getEncryptedFile(encrypted) {
    var fileDec = new Blob([encrypted]);
    var a = document.createElement("a");
    var url = window.URL.createObjectURL(fileDec);
    var filename = 'encrypted' + ".txt";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  /* Ottieni info da funzione get */
  async function getCashierProductPriceWei() {
    console.log("get cashier product price")
    try {
      let tx
      if (networkData.chain?.id === 80001) {
        tx = await signContractMumbai.GetProductPriceInWei('SIGN');
      } else if (networkData.chain?.id === 137) {
        tx = await signContractPolygon.GetProductPriceInWei('SIGN');
      }
      console.log("GetProductPriceInWei: " + tx)
      setPriceInWei(tx)
    } catch (e) {
      console.log(e.message)
      return 0
    }
  }
  /* Ottieni info da funzione get */
  async function getCashierProductPriceDollar() {
    try {
      let res;
      if (networkData.chain?.id === 80001) {
        res = await signContractMumbai.Prices('SIGN')
      } else
        if (networkData.chain?.id === 137) {
          res = await signContractPolygon.Prices('SIGN')
        }
      console.log("GetProductPriceInDollar: " + res)
      setPriceInDollar(parseInt(res))
    } catch (e) {
      console.log(e.message)
      return 0
    }
  }
  /* Ottieni info da funzione get */
  async function getSignAllowanceCredit() {
    //console.log(accountData.address)
    try {
      let tx;
      if (networkData.chain?.id === 80001) {
        tx = await signContractMumbai.signAllowance(accountData.address)
      } else if (networkData.chain?.id === 137) {
        tx = await signContractPolygon.signAllowance(accountData.address)
      }
      //console.log(tx)
      setAllowanceCredit(parseInt(tx.toString()))
      console.log('new credit' + tx.toString())
    } catch (e) {
      console.log(e.message)
      return 0
    }
  }
  /* Richiamo funzione buy dal contratto cashier */
  async function buySignService() {
    setToggleBuy(true)
    try {
      let price;
      if (networkData.chain?.id === 80001) {
        price = await signContractMumbai.GetProductPriceInWei('SIGN')
      } else if (networkData.chain?.id === 137) {
        price = await signContractPolygon.GetProductPriceInWei('SIGN')
      }
      console.log('buy at price: ' + price)
      const gasPrice = await getGasPrice()
      console.log('GAAAAS' + gasPrice)
      console.log(typeof gasPrice)
      const amount = BigInt(parseInt(price) * docsOrdered)
      console.log('buy at price+gasfee: ' + amount)
      let tx;
      if (networkData.chain?.id === 80001) {
        tx = await signContractMumbai.BuySignService('SIGN', docsOrdered, { gasPrice: gasPrice, from: accountData.address, value: amount })
      } else if (networkData.chain?.id === 137) {
        tx = await signContractPolygon.BuySignService('SIGN', docsOrdered, { gasPrice: gasPrice, from: accountData.address, value: amount })
      }
      let receipt = await tx.wait();
      console.log("Receipt Status:", receipt.status);
      await console.log(tx)
      await console.log('update credit')
      await setTimeout(async () => getSignAllowanceCredit(), 2000)
    } catch (e) {
      console.log(e.message)
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    setToggleBuy(false)
  }
  /* ottieni prezzo del gas */
  async function getGasPrice() {
    let res = 0
    await fetch('https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        res = data.result.FastGasPrice
      });
    return res * 1000000000
  }
  if (accountData) {
    return (
      <>
        <Box
          w={{ base: 'none', xl: '800px' }}
          display='flex'
          flexDirection='column'
          border='2px'
          borderRadius='16'
          borderColor='gray.700'
          p='5'
          m='2'
        >
          <Text mb='3'> Follow the five steps.</Text>
          <Tabs colorScheme='green' align='center'>
            <TabList >
              {
                /*
                <Tab>CREDIT MANAGEMENT</Tab>
                <Tab>ENCRYPT FILE AND IPFS LOAD </Tab>
                <Tab>SIGN ON CHAIN </Tab>
                <Tab>PING AND GET DECRYPTED FILES  </Tab>
                <Tab>SIGNING HISTORY TABLE  </Tab>
                */
              }
              <Tab>#README</Tab>
              <Tab>#1</Tab>
              <Tab>#2</Tab>
              <Tab>#3</Tab>
              <Tab>#4</Tab>
              <Tab>#5</Tab>
            </TabList>
            <TabPanels>
              <TabPanel textAlign='left'>
                <ReactMarkdown
                  components={ChakraUIRenderer()}
                  skipHtml
                  children={HOWTO} />
              </TabPanel>
              <TabPanel>
                {/*SECTION #1 - CREDIT MANAGEMENT */}
                <Box
                  border='1px'
                  borderColor='gray.600'
                  borderRadius='16'
                  m='2'
                  p='2'
                  display='flex'
                  flexDirection='column'
                >
                  <Heading as='h3' size='xl' my='3'><Code>CREDIT MANAGEMENT</Code></Heading>
                  <Box border='1px' p='2' borderRadius='16' borderColor='gray.600'>
                    <Text>Network : {networkData.chain?.name}  {networkData.chain?.id}</Text>
                    <Text>Connected address : {ellipseAddress(accountData.address)}</Text>
                    <Text>Your MATIC balance : {balanceData ? balanceData.formatted.substring(0, 6) : ''}</Text>
                    <Text as='mark' my='3'>Your current credit is  {allowanceCredit}<br></br></Text>
                    <Text as='i'>When credit is zero , <br></br>you cannot use this service</Text>
                  </Box>
                  <NumberInput
                    onChange={(value) => setDocsOrdered(parseInt(value))}
                    my='2'
                    defaultValue={1}
                    min={1}
                    max={1000}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>You are ordering {' ' + docsOrdered + ' '} documents</Text>
                  <Text>Price in dollar : {priceInDollar * docsOrdered} $ </Text>
                  <Text>You pay in MATIC: {Math.round((priceInWei * docsOrdered / 1000000000000000000) * 1000) / 1000} MATIC </Text>
                  <Button disabled={toggleBuy} onClick={() => buySignService()}>Buy sign service</Button>
                </Box>
              </TabPanel>
              <TabPanel>
                {/*SECTION #2 - ENCRYPT FILE AND ENABLE SIGN  */}
                <Box
                  border='1px'
                  borderColor='gray.600'
                  borderRadius='16'
                  m='2'
                  p='2'
                >
                  <Heading as='h3' size='xl' my='3'><Code>ENCRYPT FILE AND ENABLE SIGN</Code></Heading>
                  <Input value={docTypeOrName} placeholder='setup here a doc type or a note' m='1' onChange={setupDocType} />
                  <Input type='password' placeholder='setup here a password to encrypt your document' m='1' onChange={setupPassphrase} />
                  <Input type='password' placeholder='retype for a password check' m='1' onChange={setupPassphraseChecked} />
                  <Input isDisabled={keyChecked === '' ? true : false} m='1' p='1' type="file" name="data" onChange={retrieveFile} />
                  <Button onClick={() => { handleSubmit() }}>EnableSign</Button>
                </Box>
              </TabPanel>
              <TabPanel>
                {/*SECTION #3 - SIGN ON CHAIN*/}
                <Box
                  border='1px'
                  borderColor='gray.600'
                  borderRadius='16'
                  m='2'
                  p='2'
                  display='flex'
                  flexDirection='column'
                >
                  <Heading as='h3' size='xl' my='3'><Code>SIGN ON CHAIN</Code></Heading>
                  <Button
                    type='submit'
                    onClick={() => { sign(message) }}
                    disabled={enableSign || toggleSign ? false : true}
                    my={4}
                  >
                    Sign
                  </Button>
                  <List>
                    {
                      loadingString.map((item, i) => {
                        return (<ListItem>{item}</ListItem>)
                      })
                    }
                  </List>
                  {toggleSign && <Progress isAnimated={true} hasStripe value={progressValue} />}
                  <Button
                    disabled={toggleSign || !message.length}
                    onClick={onCopy} ml={2}
                  >
                    {hasCopied ? 'Copied' : 'Copy all about last sig'}
                  </Button>
                </Box>
              </TabPanel>
              <TabPanel>
                {/*SECTION #4 - PING AND GET DECRYPTED FILES */}
                <Box
                  border='1px'
                  borderColor='gray.600'
                  borderRadius='16'
                  m='2'
                  p='2'
                >
                  <VStack>
                    <Heading as='h3' size='xl' my='3'><Code>PING AND GET DECRYPTED FILES </Code></Heading>
                    <Text mb='2' > Ipfs CID of an encrypted document  that has to be signed: </  Text>
                    <Input m='1' onChange={changeCid} />
                    <Text>{selectedCid}</Text>
                    <Link color='purple' isExternal href={'https://iplocation.io/ping/https://ipfs.io/ipfs/' + selectedCid}>Ping service 1</Link>
                    <Link color='green' isExternal href={'  https://check-host.net/check-ping?host=https://ipfs.io/ipfs/' + selectedCid}> Ping service 2</Link>
                    <Link color='pink' isExternal href={'   https://networkappers.com/tools/ping-tool'}>Ping service 3 : here you have to copy the ipfs link</Link>
                    <Link color='yellow' isExternal href={'https://ipfs.io/ipfs/' + selectedCid}> See encrypted document on ipfs</Link>
                    NOTE: the file will be available on ipfs after some minute because ipfs has to index it
                    <Input placeholder='write here the password to decrypt the document' m='1' onChange={setupDecryptingPassphrase} />
                    <Button
                      onClick={() => getDecryptedFile()}
                      m='2'
                    >
                      Get back doc 	&nbsp; <Text color='green.600'>decrypted</Text>
                    </Button>
                  </VStack>
                </Box>
              </TabPanel>
              <TabPanel>
                {/*SECTION #5 - SIGNATURE TABLE */}
                <Box
                  border='1px'
                  borderColor='gray.600'
                  borderRadius='16'
                >  <Heading as='h3' size='xl' my='3'><Code>SIGNATURES TABLE </Code></Heading>
                  <Button m='2' onClick={() => getAccountSignatures()}> Reload doc sig list</Button>
                  <TablePaginated table={table}></TablePaginated>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </>
    )
  }
  return (<>
    <Box my='4'
      display='flex'
      flexDirection='column'
      textAlign='left'
    >
      <ReactMarkdown
        components={ChakraUIRenderer()}
        skipHtml
        children={HOME} />
    </Box>
  </>)
}