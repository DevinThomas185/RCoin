import {
  Box,
  Image,
  Grid,
  HStack,
  Skeleton,
  Flex,
  Spacer,
  ResponsiveValue,
} from "@chakra-ui/react";

const DataCard = ({
  title,
  value,
  valueColor,
  children,
  topMargin,
}: {
  title: string;
  value: number;
  valueColor?: string;
  children: JSX.Element | JSX.Element[];
  topMargin?: string;
}) => {
  const color = valueColor ? valueColor : "black";
  return (
    <Grid
      borderRadius="3px"
      bg="rcoinBlue.1100"
      boxShadow="md"
      marginLeft="10px"
      marginTop={topMargin}
    >
      <Box
        textAlign="left"
        fontSize="2xl"
        marginLeft="15px"
        fontWeight="bold"
        color="rcoinBlue.1000"
      >
        {title}
      </Box>
      <HStack
        borderRadius="2px"
        bg="rcoinBlue.50"
        paddingLeft="10px"
        paddingRight="10px"
      >
        {children}
        <Box
          fontWeight="bold"
          color={color}
          paddingRight="10px"
          paddingLeft="10px"
          fontSize="3xl"
        >
          {value}
        </Box>
      </HStack>
    </Grid>
  );
};

const AuditTotals = ({
  amountInReserve,
  amountIssued,
  ratio,
  isLoaded,
  useMobileView,
}: {
  amountInReserve: number;
  amountIssued: number;
  ratio: number;
  isLoaded: boolean;
  useMobileView: boolean | undefined;
}) => {
  const ratioColor = ratio > 1 ? "green" : "red";
  const direction = useMobileView ? "column" : "row";
  const itemTopMargin = useMobileView ? "10px" : "0px";
  return (
    <Skeleton borderRadius="5px" isLoaded={isLoaded}>
      <Flex direction={direction} justifyContent="center">
        <DataCard
          title="In Reserve"
          value={amountInReserve}
          topMargin={itemTopMargin}
        >
          <Box fontWeight="bold" fontSize="3xl">
            ZAR
          </Box>
        </DataCard>
        <Spacer />
        <DataCard
          title="Coins Issued"
          value={amountIssued}
          valueColor="rcoinBlue.500"
          topMargin={itemTopMargin}
        >
          <Image
            src="small_logo.png"
            boxSize="35px"
            marginRight="16px"
            marginLeft="9px"
          />
        </DataCard>
        <Spacer />
        <DataCard
          title="Reserve/Issued"
          value={ratio}
          valueColor={ratioColor}
          topMargin={itemTopMargin}
        >
          <Box fontSize="3xl" fontWeight="bold" color={ratioColor}>
            Ratio =
          </Box>
        </DataCard>
      </Flex>
    </Skeleton>
  );
};

export default AuditTotals;
