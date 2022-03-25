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

const infuraId = process.env.NEXT_PUBLIC_INFURA_NODE_PROVIDER


// Chains for connectors to support
const chains = [defaultL2Chains[2], defaultL2Chains[3]]
// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0]


  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
  /*  new WalletConnectConnector({
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
  

  return  new providers.InfuraProvider(chainId, infuraId)
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
