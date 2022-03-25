import { SignMessage } from '../components/web3/SignMessage'
import {
  Container,
  Box,
  Heading
} from '@chakra-ui/react'
const Home = () => (
  <Container>
    <Box
      display='flex'
      flexDirection
      alignItems='center'
      justifyContent='center'
      mt='20px'
    >
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        textAlign='center'
        justifyContent='center'
      >
        <SignMessage />
      </Box>
    </Box>
  </Container>
)
export default Home
//export { getStaticProps } from '../components/chakra'
