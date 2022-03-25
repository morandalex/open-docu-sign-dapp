import { useAccount } from 'wagmi'
import { Box, Text } from '@chakra-ui/react'
import { ellipseAddress } from '../../helpers/utilities'
export const AccountData = () => {
    
    const [{ data: accountData }, disconnect] = useAccount()
    if (accountData) {
        return (
            <Box
          
            justifyContent='center'
            alignItems='center'
            my='3'
            >
           
                <Text >
                    {accountData.ens?.name
                        ? `${accountData.ens?.name} (${accountData.address})`
                        : ellipseAddress(accountData.address)}
                </Text>
              
            </Box>
        )
    }
    
    return (<>Not Connected</>)
}