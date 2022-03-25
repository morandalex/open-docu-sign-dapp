import Logo from '../logo'
import NextLink from 'next/link'
import {
  Container,
  Box,
  Link,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Connect } from '../web3/Connect'
import { Connected } from '../web3/Connected'
import { AccountData } from '../web3/AccountData'
import { Network } from '../web3/Network'
import { IoLogoGithub } from 'react-icons/io5'
const LinkItem = ({ href, path, target, children, ...props }) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900')
  return (
    <NextLink href={href} passHref scroll={false}>
      <Link
        p={2}
        bg={active ? 'grassTeal' : undefined}
        color={active ? '#202023' : inactiveColor}
        target={target}
        {...props}
      >
        {children}
      </Link>
    </NextLink>
  )
}
const Navbar = props => {
  const { path } = props
  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#ffffff40', '#20202380')}
      css={{ backdropFilter: 'blur(10px)' }}
      zIndex={1}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        //maxW="container.md"
        // wrap="wrap"
        alignItems="center"
        justifyContent="center"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            <Logo />
          </Heading>
        </Flex>
     
        <Box
          mx='5'
          display="flex"
          flexDirection={{ md: 'row' }}
          alignItems="center"
          justifyContent="center"
          m='2'
        >
             
          <Network></Network>
          <Connected></Connected>
          <Connect></Connect>
          <LinkItem
            target="_blank"
            href="https://github.com/morandalex/open-docu-sign-dapp"
            path={path}
            display="inline-flex"
            alignItems="center"
            style={{ gap: 4 }}
            pl={2}
          >
            <IconButton
              icon={<IoLogoGithub />}
              variant="outline"
            ></IconButton>
            
          
          </LinkItem>
        </Box>
        <Box display={{ base: 'flex', xl: 'none' }}>
          <Menu isLazy id="navbar-menu">
            <MenuButton
              as={IconButton}
              icon={<HamburgerIcon />}
              variant="outline"
              aria-label="Options"
            />
            <MenuList>
              <MenuItem >
                <AccountData></AccountData>
              </MenuItem>
             
                <MenuItem ><Link href = "">Github Repo</Link></MenuItem>
            
            </MenuList>
          </Menu>
        </Box>
      </Container>
    </Box>
  )
}
export default Navbar
