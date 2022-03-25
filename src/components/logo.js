import Link from 'next/link'
import { Image, Box } from '@chakra-ui/react'
import { motion } from "framer-motion";
const Logo = () => {
  return (
    <Link href="/" scroll={false}>
      <a>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ rotate: 360, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <Box >
            <Image src='/images/logo.png' width={100} height={50} alt="logo" />
          </Box>
        </motion.div>
      </a>
    </Link>
  )
}
export default Logo
