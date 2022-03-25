//LAYOUT
import Layout from '../components/layouts/main'
import Fonts from '../components/fonts'
import { AnimatePresence } from 'framer-motion'
import Chakra from '../components/chakra'
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}
//WEB3
import React, { useState, createContext } from 'react'
import { StateContext } from '../context/state'
import { WagmiProvider, chain, defaultChains, developmentChains, defaultL2Chains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { providers } from 'ethers'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'
// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
//const infuraId = 'https://polygon-mainnet.g.alchemy.com/v2/-rPx9b6dd_H7M-2pTA8f0YckHKuYyB1B'
//const infuraId = 'https://eth-mainnet.alchemyapi.io/v2/HN-971sXOyKC7_PTkym_48bZm2aRxfPO'
//const infuraId = 'https://mainnet.infura.io/v3/75cdb70ef36741d99a8ec2f0db18843b'
//const infuraId = 'https://rinkeby.infura.io/v3/67a611b07570432e9d77b5dfaa2d2ccb'
//const infuraIdPolygon = 'https://polygon-mainnet.infura.io/v3/738ad3dab142418bb9651f43a54e6c30'
//const infuraIdMumbai = 'https://polygon-mumbai.infura.io/v3/738ad3dab142418bb9651f43a54e6c30'
const infuraIdPolygon = 'd15d18ba6d8b43ff9bfbe7e3cf6dbb41'
const infuraIdMumbai = 'd15d18ba6d8b43ff9bfbe7e3cf6dbb41'


// Chains for connectors to support
const chains = [defaultL2Chains[2], defaultL2Chains[3]]
// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0]
  /*
  let i ;
  if (chainId === 80001) {
    i = infuraIdMumbai
  } else if (chainId === 137) {
    i = infuraIdPolygon
  } else {
    i = infuraIdMumbai
  }*/
  //const infuraId = infuraIdMumbai



  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
   /* new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: 'My wagmi app',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),*/
  ]
}



// Use `chainId` to make ethers.js provider network-aware
const provider = ({ chainId }) =>{  
  
  if (chainId=== 80001 ) 
  {
   return  new providers.InfuraProvider(chainId, infuraIdMumbai)
  }
  if ( chainId ===137 ) {
    return   new providers.InfuraProvider(chainId, infuraIdPolygon)
  }

}

function Website({ Component, pageProps, router }) {
  const [state, setState] = useState({})
  return (
    <WagmiProvider autoConnect connectors={connectors} provider = {provider}>
      <StateContext.Provider value={{ state }} >
        <Chakra cookies={pageProps.cookies}>
          <Fonts />
          <Layout router={router}>
            <AnimatePresence
              exitBeforeEnter
              initial={true}
              onExitComplete={() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0 })
                }
              }}
            >
              <Component {...pageProps} key={router.route} />
            </AnimatePresence>
          </Layout>
        </Chakra>
      </StateContext.Provider>
    </WagmiProvider>
  )
}
export default Website
