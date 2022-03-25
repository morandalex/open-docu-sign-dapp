import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { Box, Button } from '@chakra-ui/react'
import { BiNetworkChart } from 'react-icons/bi'
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
export const Network = () => {
  const [{ data: networkData, error, loading }, switchNetwork] = useNetwork()
  return (
    <>
      <Box
        flexDirection='row'
        justifyContent='center'
        alignItems='center'
        mx='2'
        display={{ base: 'none', xl: 'flex' }}
      >
        {switchNetwork && (
          <Menu

            closeOnSelect={true}
          >
            <MenuButton
              as={Button}
              variant='outline'
              rightIcon={<BiNetworkChart />}
            >
              {networkData.chain?.name ?? networkData.chain?.id}{' '}
              {networkData.chain?.unsupported && '(unsupported)'}
            </MenuButton>
            <MenuList >
              {
                networkData.chains.map((x) =>
                  x.id === networkData.chain?.id ? null : (
                    <div key={x.id} >
                      <MenuItem onClick={() => switchNetwork(x.id)} key={x.id} value={x.id.toString()}  >
                        {x.name}
                      </MenuItem>
                      </div>
                    
                  ),
                )
              }
            </MenuList>
          </Menu>
        )}
      </Box>
      <Box
        flexDirection='row'
        justifyContent='center'
        alignItems='center'
        mx='2'
        display={{ base: 'flex', xl: 'none' }}
      >
        {switchNetwork && (
          <Menu closeOnSelect={true}
          >
            <MenuButton
              as={IconButton}
              variant='outline'
              aria-label='Options'
              icon={<BiNetworkChart />}

            >


            </MenuButton>
            <MenuList >
              {
                networkData.chains.map((x) =>
                  x.id === networkData.chain?.id ? null : (
                    <div key={x.id}>
                      <MenuItem onClick={() => switchNetwork(x.id)} key={x.id} value={x.id.toString()}  >
                        {x.name}
                      </MenuItem>
                      </div>
                    
                  ),
                )
              }
            </MenuList>
          </Menu>
        )}
      </Box>
      {error && <div>{error?.message}</div>}
    </>
  )
}