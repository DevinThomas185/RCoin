import {
  Text,
  Image,
  Box,
  HStack,
  Grid,
  useDisclosure,
  Collapse,
  Button,
  Flex,
  Spacer,
  useOutsideClick,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRef } from "react";

const TransactionLog = ({
  transaction,
  isMobileView,
}: {
  transaction: any;
  isMobileView: boolean | undefined;
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const ref = useRef<any>();
  useOutsideClick({
    ref: ref,
    handler: () => {
      if (isOpen) {
        onToggle();
      }
    },
  });

  const width = isMobileView ? "fit-content" : "1080px";
  const [description, bankID, blockchainID] = isMobileView
    ? [null, null, null]
    : [
        <TransactionDescription transaction_type={transaction.type} />,
        <TransactionId transaction_id={transaction.bank_transaction_id} />,
        <TransactionId
          transaction_id={transaction.blockchain_transaction_id}
        />,
      ];

  return (
    <Grid ref={ref} onClick={onToggle} gap={1}>
      <Box
        borderRadius="5"
        bg="rcoinBlue.50"
        width={width}
        transition="transform 0.15s ease-out, background 0.15s ease-out"
        _hover={{
          transform: "scale(1.02, 1.01)",
        }}
      >
        <HStack spacing={3} marginRight="10px">
          <TransactionIcon transaction_type={transaction.type} />
          <TransactionAmount amount={transaction.amount} />
          {description}
          {bankID}
          {blockchainID}
          <TransactionDate date={transaction.date} />
        </HStack>
      </Box>
      <Collapse animateOpacity in={isOpen}>
        <TransactionDetailsPopup transaction={transaction} />
      </Collapse>
    </Grid>
  );
};

const TransactionIcon = ({
  transaction_type,
}: {
  transaction_type: string;
}) => {
  const image =
    transaction_type == "issue" ? "increase_block.png" : "decrease_block.png";

  return <Image src={image} boxSize="40px" borderRadius="5px" />;
};

const TransactionAmount = ({ amount }: { amount: number }) => {
  return (
    <HStack maxWidth="110px" minWidth="110px">
      <Image src="small_logo.png" boxSize="25px" />
      <Text fontWeight="bold" color="rcoinBlue.500">
        {amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </Text>
    </HStack>
  );
};

const TransactionDescription = ({
  transaction_type,
}: {
  transaction_type: string;
}) => {
  const description = transaction_type == "issue" ? "Deposit" : "Withdrawal";

  return (
    <Text fontSize="md" fontWeight="bold" maxWidth="110px" minWidth="110px">
      {" "}
      {description}{" "}
    </Text>
  );
};

const TransactionId = ({ transaction_id }: { transaction_id: string }) => {
  const text =
    transaction_id === null ? "" : `${transaction_id.slice(0, 20)}...`;
  return (
    <Text
      fontFamily="monospace"
      fontSize="md"
      maxWidth="250px"
      minWidth="250px"
    >
      {" "}
      {text}{" "}
    </Text>
  );
};

const TransactionDate = ({ date }: { date: string }) => {
  return (
    <Text fontWeight="bold" fontSize="md">
      {" "}
      {parseDate(date)}{" "}
    </Text>
  );
};

const parseDate = (date: string) => {
  if (date === null) {
    return "";
  }

  const [dateComponents, timeComponents] = date.split("T");
  const [year, month, day] = dateComponents.split("-");
  const [hour, minutes, secondsMiliseconds] = timeComponents.split(":");
  const [seconds, _] = secondsMiliseconds.split(".");

  return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
};

const TransactionDetailsPopup = ({ transaction }: { transaction: any }) => {
  return (
    <Box
      boxShadow="inner"
      p="6"
      rounded="md"
      borderRadius="5"
      padding="3px"
      bg="rcoinBlue.100"
    >
      <TransactionFlow transaction={transaction} />
      <Flex minWidth="100%" direction="row">
        <TransactionDetailsList transaction={transaction} />
        <Spacer />
        <ViewOnSolanaButton transaction={transaction} />
      </Flex>
    </Box>
  );
};

const TransactionFlow = ({ transaction }: { transaction: any }) => {
  const rcoinAmount = (
    <HStack>
      <Image src="small_logo.png" boxSize="25px" />
      <Text fontWeight="bold" width="fit-content" color="rcoinBlue.500">
        {transaction.amount}
      </Text>
    </HStack>
  );
  const zarAmount = (
    <Text fontWeight="bold" width="fit-content" color="rcoinBlue.800">
      ZAR {transaction.amount}
    </Text>
  );

  const [firstEntry, secondEntry] =
    transaction.type === "issue"
      ? [zarAmount, rcoinAmount]
      : [rcoinAmount, zarAmount];

  return (
    <HStack margin="auto" width="fit-content">
      {firstEntry}
      <Image src="exchange_block.png" boxSize="30px" />
      {secondEntry}
    </HStack>
  );
};

const TransactionDetailsList = ({ transaction }: { transaction: any }) => {
  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  const direction = isMobileView ? "column" : "row";
  const width = isMobileView ? "150px" : "fit-content";

  const IDEntry = ({ title, id }: { title: string; id: string }) => {
    const text = isMobileView ? `${id.slice(0, 20)}...` : id;
    return (
      <Flex direction={direction} width={width}>
        <Text
          fontWeight="bold"
          marginRight="10px"
          fontSize="md"
          color="rcoinBlue.700"
        >
          {title}
        </Text>
        <Text fontSize="sm" fontFamily="monospace">
          {text}
        </Text>
      </Flex>
    );
  };

  return (
    <Flex marginLeft="15px" maxWidth={width} direction="column">
      <WordDescription transaction={transaction} />
      <IDEntry
        title="Bank Transaction ID: "
        id={transaction.bank_transaction_id}
      />
      <IDEntry
        title="Solana Transaction ID: "
        id={transaction.blockchain_transaction_id}
      />
    </Flex>
  );
};

const WordDescription = ({ transaction }: { transaction: any }) => {
  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  const beginning = `On ${parseHour(transaction.date)} ${transaction.amount}`;

  const tail =
    transaction.type === "issue"
      ? `ZAR was deposited
        into the reserve account and ${transaction.amount} RCoins were issued.`
      : `ZAR was withdrawn
        from the reserve account and ${transaction.amount} RCoins were burned.`;

  return isMobileView ? (
    <Text width="fit-content"></Text>
  ) : (
    <HStack>
      <Text
        fontWeight="bold"
        fontSize="md"
        marginRight="10px"
        color="rcoinBlue.700"
      >
        {" "}
        Transaction Details:{" "}
      </Text>
      <Text fontSize="md" textAlign="center" color="rcoinBlue.900">
        {beginning} {tail}
      </Text>
    </HStack>
  );
};

const parseHour = (date: string) => {
  return date == null ? "" : parseDate(date).split(" ")[0];
};

const ViewOnSolanaButton = ({ transaction }: { transaction: any }) => {
  return (
    <Button
      variant="reactive"
      size="sm"
      marginBottom="2"
      marginRight="2"
      alignSelf="flex-end"
      onClick={() => {
        window.open(
          "https://explorer.solana.com/tx/" +
            transaction.blockchain_transaction_id +
            "?cluster=devnet"
        );
      }}
    >
      View on{" "}
      <Image marginLeft="4px" src="solana.png" maxWidth="20px" fit="contain" />
    </Button>
  );
};

export default TransactionLog;
