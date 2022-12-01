import {
  TableContainer,
  Text,
  Box,
  HStack,
  Grid,
  Skeleton,
} from "@chakra-ui/react";
import { UIEventHandler } from "react";
import TransactionLog from "./TransactionLog";

const TransactionTable = ({
  transactions,
  isLoaded,
  onScroll,
}: {
  transactions: any[];
  isLoaded: boolean;
  onScroll: UIEventHandler<HTMLDivElement>;
}) => {
  return (
    <Grid gap={2}>
      <TransactionTableHeader />
      <Skeleton
        justifySelf="center"
        maxWidth="1200px"
        minWidth="1150px"
        minHeight="600px"
        borderRadius="25px"
        isLoaded={isLoaded}
      >
        <TableContainer
          overflowY="auto"
          maxWidth="1200px"
          minWidth="1150px"
          marginLeft="auto"
          marginRight="auto"
          maxHeight="800px"
          onScroll={onScroll}
        >
          <Grid gap={1} justifyItems="center">
            {transactions.map((transaction) => (
              <TransactionLog transaction={transaction} />
            ))}
          </Grid>
        </TableContainer>
      </Skeleton>
    </Grid>
  );
};

const TransactionTableHeader = () => {
  return (
    <Box
      borderRadius="25"
      bg="rcoinBlue.50"
      width="1100px"
      marginLeft="auto"
      marginRight="auto"
    >
      <HStack spacing={3}>
        <HeaderEntry text="" width="40px" />
        <HeaderEntry text="Amount" width="110px" />
        <HeaderEntry text="Type" width="110px" />
        <HeaderEntry text="Bank Transfer ID" width="250px" />
        <HeaderEntry text="Solana Transaction ID" width="250px" />
        <Text fontWeight="bold" textAlign="center">
          Transaction Date
        </Text>
      </HStack>
    </Box>
  );
};

const HeaderEntry = ({ text, width }: { text: string; width: string }) => {
  return (
    <Text fontWeight="bold" minWidth={width} maxWidth={width}>
      {" "}
      {text}{" "}
    </Text>
  );
};

export default TransactionTable;
