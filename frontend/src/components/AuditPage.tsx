import {
  Flex,
  Heading,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Center,
  Box,
  TableContainer,
  TableCaption,
  Table,
  Tr,
  Thead,
  Tbody,
  Tfoot,
  Td,
  Th,
  ChakraProvider,
} from "@chakra-ui/react";
import Welcome from "./Welcome";
import { useState, useEffect } from "react";
import React from "react";

const AuditPage = ({ isAuth }: { isAuth: boolean }) => {
  const initArr: any[] = [];
  const [transactions, setTransactions] = React.useState<any[]>(initArr);

  useEffect(() => {
    fetch("/api/audit/transactions", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data["transactions"]);
        console.log(data["transactions"]);
      });
  }, []);

  return (
    <Box>
      <Heading textAlign={"center"}>Real Time Audit </Heading>

      <Welcome isAuth={isAuth} />

      <TableContainer overflowY="auto" maxHeight="400px" margin={10}>
        <Table variant="striped" colorScheme="pink">
          <TableCaption>
            Click on each transaction to view on the blockchain
          </TableCaption>
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
              <Tr
                onClick={() => {
                  console.log(transactions.at(0));
                }}
                key={transaction.bank_transaction_id}
              >
                <Td>{transaction.type}</Td>
                <Td>{transaction.bank_transaction_id}</Td>
                <Td>{transaction.blockchain_transaction_id}</Td>
                <Td isNumeric>{transaction.amount}</Td>
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
      </TableContainer>
    </Box>
  );
};

export default AuditPage;
