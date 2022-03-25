import { useAccount, useConnect } from 'wagmi'
import { Button, Box, Text, IconButton } from '@chakra-ui/react'
import { MdExitToApp } from 'react-icons/md'
export const Connected = () => {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount()
  if (accountData) {
    return (
      <Box

        justifyContent='center'
        alignItems='center'
        my='2'
        mx='1'
      >

        <Button
          display={{ base: 'none', xl: 'flex' }}
          variant='outline'
          onClick={disconnect}
        >
          Disconnect
        </Button>

        <Box
          as={IconButton}
          display={{ base: 'flex', xl: 'none' }}
          variant='outline'
          onClick={disconnect}
          icon={(<MdExitToApp />)}
        >

        </Box>
      </Box>
    )
  }
  return <></>
}