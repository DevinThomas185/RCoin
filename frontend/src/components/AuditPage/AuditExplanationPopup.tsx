import { Image, Box, Grid, HStack, Text, Button } from "@chakra-ui/react";

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
  return (
    <Grid
      bg="rcoinBlue.100"
      borderRadius="25px"
      minWidth="1080px"
      maxWidth="1080px"
      alignContent="stretch"
      gap={0}
    >
      <Box
        textAlign="left"
        fontSize="4xl"
        marginLeft="10px"
        fontWeight="bold"
        color="rcoinBlue.700"
      >
        Why do we need the Audit?
      </Box>
      <HStack>
        <Image
          src="parity.png"
          maxWidth="20%"
          justifySelf="center"
          fit="contain"
        />
        <Text
          marginLeft="30px"
          marginRight="30px"
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
