import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    extendTheme
} from '@chakra-ui/react'

const theme = extendTheme({
    colors: {
        brand: {
            100: "#A5315B",
            // ...
            900: "#1a202c",
        },
    },
})

const TableChakra = () => {
    return (
        <TableContainer overflowY="auto" maxHeight="400px" margin={10}>
            <Table variant='striped' colorScheme='pink'>
                <TableCaption>Click on each transaction ID</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Wallet ID</Th>
                        <Th>Stablecoin</Th>
                        <Th isNumeric>Rand</Th>
                        <Th>Transaction ID</Th>
                        <Th isNumeric>Rcoin</Th>
                        <Th>fd</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr onClick={() => { console.log("yo s") }}>
                        <Td>fjq349rjfaskd</Td>
                        <Td>issued</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>12aidfjh3uda</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>created</Td>
                    </Tr>
                    <Tr onClick={() => { console.log("yo s") }}>
                        <Td>fjq3439rjfaskd</Td>
                        <Td>issued</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>12aidfjh3uda</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>created</Td>
                    </Tr>
                    <Tr onClick={() => { console.log("yo s") }}>
                        <Td>fjq3493rjfaskd</Td>
                        <Td>issued</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>12aidfjh3uda</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>created</Td>
                    </Tr>
                    <Tr onClick={() => { console.log("yo s") }}>
                        <Td>fjq349frjfaskd</Td>
                        <Td>issued</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>12aidfjh3uda</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>created</Td>
                    </Tr>
                    <Tr onClick={() => { console.log("yo s") }}>
                        <Td>fjq34f9rjfaskd</Td>
                        <Td>issued</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>12aidfjh3uda</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>created</Td>
                    </Tr>
                    <Tr onClick={() => { console.log("yo s") }}>
                        <Td>fjq34d9rjfaskd</Td>
                        <Td>issued</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>12aidfjh3uda</Td>
                        <Td isNumeric>25.4</Td>
                        <Td>created</Td>
                    </Tr>
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>Wallet ID</Th>
                        <Th>Stablecoin</Th>
                        <Th isNumeric>Rand</Th>
                        <Th>Transaction ID</Th>
                        <Th isNumeric>Rcoin</Th>
                        <Th>fd</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>

    )


}

export default TableChakra;