import {
  TableContainer,
  Text,
  Box,
  HStack,
  Grid,
  Skeleton,
  useBreakpointValue,
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
  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  const maxWidth = useMobileView ? "400px" : "1200px";
  const minWidth = useMobileView ? "300px" : "1150px";

  return (
    <Grid gap={2}>
      <TransactionTableHeader isMobileView={useMobileView} />
      <Skeleton
        justifySelf="center"
        maxWidth={maxWidth}
        minWidth={minWidth}
        minHeight="600px"
        borderRadius="25px"
        isLoaded={isLoaded}
      >
        <TableContainer
          overflowY="auto"
          marginLeft="auto"
          marginRight="auto"
          maxHeight="800px"
          padding="10px"
          onScroll={onScroll}
        >
          <Grid gap={1} justifyItems="center">
            {transactions.map((transaction) => (
              <TransactionLog
                transaction={transaction}
                isMobileView={useMobileView}
              />
            ))}
          </Grid>
        </TableContainer>
      </Skeleton>
    </Grid>
  );
};

const TransactionTableHeader = ({
  isMobileView,
}: {
  isMobileView: boolean | undefined;
}) => {
  const width = isMobileView ? "90%" : "1080px";
  const leftOffset = isMobileView ? "50px" : "40px";
  const additionalHeaders = isMobileView
    ? null
    : [
        <HeaderEntry text="Type" width="110px" />,
        <HeaderEntry text="Bank Transfer ID" width="250px" />,
        <HeaderEntry text="Solana Transaction ID" width="250px" />,
      ];

  return (
    <Box
      borderRadius="25"
      bg="rcoinBlue.50"
      width={width}
      marginLeft="auto"
      marginRight="auto"
    >
      <HStack spacing={3}>
        <HeaderEntry text="" width={leftOffset} />
        <HeaderEntry text="Amount" width="110px" />
        {additionalHeaders}
        <Text fontWeight="bold" textAlign="center">
          Date
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
