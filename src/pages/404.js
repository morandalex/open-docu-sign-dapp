import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  Container,
  Divider,
  Button
} from '@chakra-ui/react'
const NotFound = () => {
  return (
    <Container>
      <Box
        flexDirection='column'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Heading
          mt='40px'
          as="h1"
        >Not found</Heading>
        <Text>The page you&apos;re looking for was not found.</Text>
      </Box>
      <Divider my={6} />
      <Box my={6} align="center">
        <NextLink href="/">
          <Button colorScheme="teal">Return to home</Button>
        </NextLink>
      </Box>
    </Container>
  )
}
export default NotFound
