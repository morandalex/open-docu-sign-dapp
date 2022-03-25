import {useEffect} from 'react'
import {
  ChakraProvider,
  useColorMode
} from '@chakra-ui/react'
import theme from '../lib/theme'
export function ForceLightMode(props: { children: JSX.Element }) {
  const { colorMode, toggleColorMode } = useColorMode();
  useEffect(() => {
    if (colorMode === "dark") 
    return;
    toggleColorMode();
  }, [colorMode]);
  return props.children;
}
export default function Chakra({ cookies, children }) {
  return (
    <ChakraProvider theme={theme} >
       <ForceLightMode>
       {children}
       </ForceLightMode>
    </ChakraProvider>
  )
}
