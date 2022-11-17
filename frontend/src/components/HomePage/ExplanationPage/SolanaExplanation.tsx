import { HStack, Text, Image, Box, Grid, Button, Link } from "@chakra-ui/react";
const SolanaExplanation = () => {
  return (
    <HStack>
      <Box
        bg="white"
        alignItems="center"
        height="fit-content"
        width="55%"
        padding="2"
        borderRadius="25"
      >
        <Text alignSelf="center" fontSize="4xl" color="black" fontWeight="bold">
          Rand on a Blockchain
        </Text>
        <Text alignSelf="center">
          RCoin is a digital representation of Rand, in the form of a blockchain
          token. The token is hosted on the Solana blockchain network to
          maximise transaction speed and minimise the transaction cost. Due to
          this, our fees are significantly lower than traditional services.
        </Text>
      </Box>
      <Grid>
        <Image src="big_solana.png" fit="contain" />
        <Link justifySelf="center" href="https://solana.com" isExternal>
          <Button variant="reactive" size="lg">
            Learn more about Solana
          </Button>
        </Link>
      </Grid>
    </HStack>
  );
};

export default SolanaExplanation;
