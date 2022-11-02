import { Flex, Heading, Skeleton, Stat, StatLabel, StatNumber, Center, Box, TableContainer, TableCaption, Table, Tr, Thead, Tbody, Tfoot, Td, Th, ChakraProvider } from '@chakra-ui/react';
import Welcome from './Welcome';
import { useState, useEffect } from "react";
import React from 'react';

const TransactionHistoryPage = ({ email }: { email: string }) => {

  const initArr: any[] = []
  const [transactionHistory, setTransactionHistory] = React.useState<any[]>(initArr)

  // useEffect(() => {
  //   fetch("/api/transaction_history", {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ "email": email })
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       setTransactionHistory(data["transaction_history"])
  //     })
  // }, [])

  return (
    <Box>
      <Heading textAlign={"center"}>Your Transaction History</Heading>
      <Heading textAlign={"center"}>origin: {transactionHistory[0][0]}</Heading>
      <Heading textAlign={"center"}>target: {transactionHistory[0][1]}</Heading>
      <Heading textAlign={"center"}>amount: {transactionHistory[0][2]}</Heading>
      {/* <Heading textAlign={"center"}>origin: {transactionHistory[1][0]}</Heading>
      <Heading textAlign={"center"}>target: {transactionHistory[1][1]}</Heading>
      <Heading textAlign={"center"}>amount: {transactionHistory[1][2]}</Heading> */}
      {/* <Heading textAlign={"center"}>origin: {transactionHistory[2][0]}</Heading>
      <Heading textAlign={"center"}>target: {transactionHistory[2][1]}</Heading>
      <Heading textAlign={"center"}>amount: {transactionHistory[2][2]}</Heading>
      <Heading textAlign={"center"}>origin: {transactionHistory[3][0]}</Heading>
      <Heading textAlign={"center"}>target: {transactionHistory[3][1]}</Heading>
      <Heading textAlign={"center"}>amount: {transactionHistory[3][2]}</Heading> */}

      {/* <Welcome email={email} isAuth={isAuth} />


      <TableContainer overflowY="auto" maxHeight="400px" margin={10}>
        <Table variant='striped' colorScheme='pink'>
          <TableCaption>Click on each transaction to view on the blockchain</TableCaption>
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>Bank Transaction ID</Th>
              <Th>Blockchain Transaction ID</Th>
              <Th isNumeric>Amount</Th>
              <Th>Transaction Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              < Tr onClick={() => { console.log(transactions.at(0)) }} key={transaction.bank_transaction_id}>
                <Td>{transaction.type}</Td>
                <Td>{transaction.bank_transaction_id}</Td>
                <Td>{transaction.blockchain_transaction_id}</Td>
                <Td isNumeric >{transaction.amount}</Td>
                <Td>{transaction.date}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Type</Th>
              <Th>Bank Transaction ID</Th>
              <Th>Blockchain Transaction ID</Th>
              <Th isNumeric>Amount</Th>
              <Th>Transaction Date</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer> */}





    </Box >


  )


}

export default TransactionHistoryPage;