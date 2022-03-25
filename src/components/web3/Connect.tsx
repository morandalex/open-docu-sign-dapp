import React, { useContext } from 'react'
import {
  Text,
  Box,
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react'
import { GrConnectivity } from 'react-icons/gr'
import MetamaskIcon from '../icons/metamask'
import WalletconnectIcon from '../icons/walletconnect'
import CoinbasewalletIcon from '../icons/coinbasewallet'
import { useConnect, useAccount } from 'wagmi'
import { StateContext } from '../../context/state'
export const Connect = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { state } = useContext(StateContext);
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data, error }, connect] = useConnect()
  if (!accountData) {
    return (
      <>
        <Box
          mx='1'
          my='2'
        >
          <Button

            display={{ base: 'none', xl: 'flex' }}
            variant='outline'
            onClick={onOpen}
          >
            Connect
          </Button>
          <Box
            as={IconButton}
            display={{ base: 'flex', xl: 'none' }}
            variant='outline'
            onClick={onOpen}
            icon={(<MetamaskIcon />)}
          >

          </Box>
        </Box>
        <Modal
          isCentered
          motionPreset='slideInBottom'
          isOpen={isOpen}
          onClose={onClose}>
          <ModalOverlay />
          <ModalContent >

            <ModalCloseButton />
            <ModalBody>
              <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
              >
                <Text fontSize='2xl'>Select provider</Text>
                {data.connectors.map((connector, i) => (
                  <Box
                    as='button'
                    display='flex'
                    key={i}
                    m='3'
                    p='3'
                    border='1px'
                    borderRadius='16'
                    borderColor='gray.600'
                    // display='space-around'

                    onClick={() => connect(connector)}
                  >

                    <Text mx='2'> {connector.name}{!connector.ready && ' (unsupported)'}</Text>


                  </Box>
                ))}
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
        {error && <div>{error?.message ?? 'Failed to connect'}</div>}
      </>
    )
  }
  return (<></>)
}