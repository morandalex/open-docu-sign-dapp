/* import the ipfs-http-client library */
const IPFS = require('ipfs-http-client');

const projectId = '';
const projectSecret = '';

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const client = IPFS.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth
  }
})

async function fun () {

     
    const cid = await client.add("test")
    
    console.log(cid)

   
}

fun ()
