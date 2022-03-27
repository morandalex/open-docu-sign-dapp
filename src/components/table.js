import React, { forwardRef, useEffect } from "react";
import { ellipseAddress } from '../helpers/utilities'
import { CopyIcon } from '@chakra-ui/icons'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Button,
  Heading,
  Tr,
  Th,
  Td,
  TableCaption,
  Spinner,
  useToast,
  Link,
  useClipboard,
  IconButton,
} from "@chakra-ui/react";
const gateway=process.env.NEXT_PUBLIC_IPFS_GATEWAY;
import Pagination from "@choc-ui/paginator";
const TablePaginated = ({ table }) => {
  const toast = useToast();
  const [data, setData] = React.useState(table);
  const [loading, setLoading] = React.useState(true);
  const [current, setCurrent] = React.useState(1);
  const [strToCopy, setStrToCopy] = React.useState('')
  const { hasCopied, onCopy } = useClipboard(strToCopy)
  const pageSize = 5;
  const offset = (current - 1) * pageSize;
  const rows = data.slice(offset, offset + pageSize);
  useEffect(() => {
    function init() {
      console.log(table)
      setData(table)
    }
    init()
  }, [table])
  function copyStr(cid) {
    console.log(cid)
    setStrToCopy(cid)
    onCopy()
  }
  const Prev = forwardRef((props, ref) => (
    <Button ref={ref} {...props}>
      Prev
    </Button>
  ));
  const Next = forwardRef((props, ref) => (
    <Button ref={ref} {...props}>
      Next
    </Button>
  ));
  const itemRender = (_, type) => {
    if (type === "prev") {
      return Prev;
    }
    if (type === "next") {
      return Next;
    }
  };
  return (
    <>
      <Table
        size='sm'
        shadow="base"
        rounded="lg"
        variant="simple"
      >
        <TableCaption
          mb='10'
        >
          <Pagination
            current={current}
            onChange={(page) => {
              setCurrent(page);
              /*   toast({
                   title: "Pagination.",
                   description: `You changed to page ${page}`,
                   variant: "solid",
                   duration: 9000,
                   isClosable: true,
                   position: "top-right"
                 });*/
            }}
            pageSize={pageSize}
            total={data.length}
            itemRender={itemRender}
            paginationProps={{
              display: "flex",
              pos: "absolute",
              left: "50%",
              transform: "translateX(-50%)"
            }}
            colorScheme="purple"
            focusRing="gray"
          />
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Doc Id</Th>
            <Th>Extension</Th>
            <Th>Cid</Th>
            <Th >Block timestamp</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            rows.map((item, i) => {
              return (
                <Tr key={i}>
                  <Td>{item.docId.split('|')[1]}</Td>
                  <Td>{item.docId.split('|')[0]}</Td>
                  <Td>
                    <Box
                      display='flex'
                      flexDirection='row'
                      justifyContent="space-between"
                      alignItems="center"
                      textAlign="center"
                    >
                      <Link mx='2' isExternal color='yellow' href={gateway + item.cid}>
                        {ellipseAddress(item.cid)}
                      </Link>
                      <IconButton onClick={() => copyStr(item.cid)} icon={<CopyIcon />} />
                    </Box>
                  </Td>
                  <Td >{item.blockTimeStamp}</Td>
                </Tr>
              )
            })
          }
        </Tbody>
      </Table>
    </>
  );
};
TablePaginated.defaultProps = {
  table: []
};
export default TablePaginated;
