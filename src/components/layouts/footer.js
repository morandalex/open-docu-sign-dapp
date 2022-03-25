import { Box,Link,IconButton } from '@chakra-ui/react'
import HearthIcon from '../icons/hearth'
const Footer = () => {
  return (
    <Box align="center" opacity={0.8} fontSize="sm">
      Made with <HearthIcon color='red' /> by Alessandro Morandi a.morandi.info@gmail.com <br></br>
      <Link isExternal href = 'https://www.abeatbeyond.com/'>A Beat Beyond</Link> All Rights Reserved. &copy; {new Date().getFullYear()}
    </Box>
  )
}
export default Footer
