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
} from "@chakra-ui/react";
import { useRef } from "react";

const TransactionLog = ({ transaction }: { transaction: any }) => {
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

  return (
    <Grid ref={ref} onClick={onToggle} gap={1}>
      <Box
        borderRadius="25"
        bg="rcoinBlue.50"
        width="1080px"
        transition="transform 0.15s ease-out, background 0.15s ease-out"
        _hover={{
          transform: "scale(1.02, 1.01)",
        }}
      >
        <HStack spacing={3}>
          <TransactionIcon transaction_type={transaction.type} />
          <TransactionAmount amount={transaction.amount} />
          <TransactionDescription transaction_type={transaction.type} />
          <TransactionId transaction_id={transaction.bank_transaction_id} />
          <TransactionId
            transaction_id={transaction.blockchain_transaction_id}
          />
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

  return <Image src={image} boxSize="40px" />;
};

const TransactionAmount = ({ amount }: { amount: number }) => {
  return (
    <HStack maxWidth="110px" minWidth="110px">
      <Image src="small_logo.png" boxSize="25px" />
      <Text fontWeight="bold" color="rcoinBlue.500">
        {amount}
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
  return <Text> {parseDate(date)} </Text>;
};

const parseDate = (date: string) => {
  if (date === null) {
    return "";
  }

  const [dateComponents, timeComponents] = date.split("T");
  const [year, month, day] = dateComponents.split("-");
  const [hour, minutes, secondsMiliseconds] = timeComponents.split(":");
  const [seconds, _] = secondsMiliseconds.split(".");

  return `${hour}:${minutes}:${seconds} ${day}.${month}.${year}`;
};

const TransactionDetailsPopup = ({ transaction }: { transaction: any }) => {
  return (
    <Box
      boxShadow="inner"
      p="6"
      rounded="md"
      borderRadius="25"
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
      <Image src="small_logo.png" boxSize="25px" marginLeft="9px" />
      <Text fontWeight="bold" color="rcoinBlue.500">
        {transaction.amount}
      </Text>
    </HStack>
  );
  const zarAmount = (
    <Text fontWeight="bold" color="rcoinBlue.800">
      ZAR {transaction.amount}
    </Text>
  );

  const [firstEntry, secondEntry] =
    transaction.type === "issue"
      ? [zarAmount, rcoinAmount]
      : [rcoinAmount, zarAmount];

  return (
    <HStack
      marginLeft="auto"
      marginRight="auto"
      minWidth="200px"
      maxWidth="200px"
    >
      {firstEntry}
      <Image src="exchange_block.png" boxSize="30px" />
      {secondEntry}
    </HStack>
  );
};

const TransactionDetailsList = ({ transaction }: { transaction: any }) => {
  const IDEntry = ({ title, id }: { title: string; id: string }) => {
    return (
      <HStack>
        <Text fontWeight="bold" fontSize="md" color="rcoinBlue.700">
          {title}
        </Text>
        <Text fontSize="sm" fontFamily="monospace">
          {id}
        </Text>
      </HStack>
    );
  };

  return (
    <Grid marginLeft="15px">
      <WordDescription transaction={transaction} />
      <IDEntry
        title="Bank Transaction ID:"
        id={transaction.bank_transaction_id}
      />
      <IDEntry
        title="Solana Transaction ID:"
        id={transaction.blockchain_transaction_id}
      />
    </Grid>
  );
};

const WordDescription = ({ transaction }: { transaction: any }) => {
  const beginning = `At ${parseHour(transaction.date)} ${transaction.amount}`;

  const tail =
    transaction.type === "issue"
      ? `ZAR was deposited
        into the reserve account and ${transaction.amount} Rcoins were issued.`
      : `ZAR was withdrawn
        from the reserve account and ${transaction.amount} Rcoins were burned.`;

  return (
    <HStack>
      <Text fontWeight="bold" fontSize="md" color="rcoinBlue.700">
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