import {
  Image,
  Box,
  Grid,
  HStack,
  Flex,
  Text,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";

const paystackButton = (
  <Button
    maxWidth="300px"
    justifySelf="right"
    marginBottom="10px"
    marginRight="10px"
    variant="reactive"
    onClick={() => {
      window.open(
        "https://www.forbes.com/sites/naveenjoshi/2022/03/03/making-financial-auditing-more-assured-with-blockchain/?sh=1828f8c028de"
      );
    }}
  >
    Learn More About Real-Time Auditing{" "}
  </Button>
);

const AuditExplanationPopup = () => {
  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  const width = useMobileView ? "90%" : "1080px";

  return (
    <Grid
      bg="rcoinBlue.1000"
      borderRadius="5px"
      borderColor="rcoinBlue.1100"
      borderWidth="5px"
      marginLeft="auto"
      marginRight="auto"
      minWidth={width}
      maxWidth={width}
      alignContent="stretch"
      gap={0}
    >
      <Box
        textAlign="left"
        fontSize="4xl"
        marginLeft="20px"
        fontWeight="bold"
        color="rcoinBlue.1100"
      >
        Why do we need the Audit?
      </Box>
      <HStack>
        {useMobileView ? null : (
          <Flex maxWidth="20%" flexDirection="row" marginLeft="10px">
            <Image
              src="cashIcon.png"
              maxWidth="45%"
              // justifySelf="center"
              fit="contain"
            />
            <Text
              fontSize="30px"
              marginLeft="7px"
              marginRight="7px"
              color="black"
            >
              {" "}
              ={" "}
            </Text>
            <Image
              src="coinIcon.png"
              maxWidth="30%"
              // justifySelf="center"
              fit="contain"
            />
          </Flex>
        )}
        <Text
          marginLeft="20px"
          paddingRight="30px"
          textAlign="left"
          color="black"
        >
          To ensure that your funds are safe with us, we have build a real
          time-auditing system. It allows all users to check the total number of
          Rcoins that were issued and make sure that it is fully backed by Rand
          in our reserve account. That way we can prove that at any given time,
          our reserve has enough liquidity to allow all users to withdraw their
          funds. It also ensures that Rcoin is not inflationary and 1 Rcoin is
          always worth exactly 1 Rand.
        </Text>
      </HStack>
      {paystackButton}
    </Grid>
  );
};

export default AuditExplanationPopup;
