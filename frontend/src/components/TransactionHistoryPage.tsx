import { Flex, Heading, Skeleton, Stat, StatLabel, StatNumber, Center, Box, TableContainer, TableCaption, Table, Tr, Thead, Tbody, Tfoot, Td, Th, ChakraProvider } from '@chakra-ui/react';
import Welcome from './Welcome';
import { useState, useEffect } from "react";
import React from 'react';

const TransactionHistoryPage = () => {

  const initArr: any[] = []
  const [transactionHistory, setTransactionHistory] = React.useState<any[]>(initArr)

  useEffect(() => {
    fetch("/api/transaction_history", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(data => {
        setTransactionHistory(data["transaction_history"])
      })
  }, [])

  return (
    <Box>
      <Heading textAlign={"center"}>Your Transaction History</Heading>

      <TableContainer overflowY="auto" maxHeight="400px" margin={10}>
        <Table variant='striped' colorScheme='pink'>
          <TableCaption>Click on each transaction to view on the blockchain</TableCaption>
          <Thead>
            <Tr>
              <Th>Signature</Th>
              <Th>Origin</Th>
              <Th>Target</Th>
              <Th isNumeric>Amount</Th>
              {/* <Th>Transaction Date</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {transactionHistory.map((transaction) => (
              < Tr onClick={() => { console.log(transactionHistory.at(0)) }}>
                <Td>{transaction.signature}</Td>
                <Td>{transaction.sender}</Td>
                <Td>{transaction.recipient}</Td>
                <Td isNumeric >{transaction.amount}</Td>
                {/* <Td>{transaction.date}</Td> */}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Signature</Th>
              <Th>Origin</Th>
              <Th>Target</Th>
              <Th isNumeric>Amount</Th>
              {/* <Th>Transaction Date</Th> */}
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>





    </Box >


  )


}

export default TransactionHistoryPage;