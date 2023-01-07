import {
  HStack,
  Text,
  Image,
  Box,
  Grid,
  Button,
  Link,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";

const SolanaButton = ({ maxWidth }: { maxWidth: string }) => {
  return (
    <Grid>
      <Image
        maxWidth={maxWidth}
        margin="auto"
        src="big_solana.png"
        fit="contain"
      />
      <Link justifySelf="center" href="https://solana.com" isExternal>
        <Button variant="reactive" size="lg">
          Learn more about Solana
        </Button>
      </Link>
    </Grid>
  );
};

const MobileSolanaExplanation = () => {
  return (
    <Grid gap={6}>
      <Box alignItems="center" height="fit-content" padding="2">
        <Text alignSelf="center" fontSize="5xl" color="black" fontWeight="bold">
          Rand on a Blockchain
        </Text>
        <Text alignSelf="center">
          RCoin is a digital representation of Rand, in the form of a blockchain
          token. The token is hosted on the Solana blockchain network to
          maximise transaction speed and minimise the transaction cost. Due to
          this, our fees are significantly lower than traditional services.
        </Text>
      </Box>
      <SolanaButton maxWidth="75%" />
    </Grid>
  );
};

const DesktopSolanaExplanation = () => {
  const fontSize = "46px";
  return (
    <HStack>
      <Box
        bg="white"
        alignItems="center"
        height="fit-content"
        maxWidth="45%"
        padding="2"
        borderRadius="25"
      >
        <Text
          alignSelf="center"
          fontSize={fontSize}
          color="black"
          fontWeight="bold"
        >
          Rand on a{" "}
          <chakra.span
            fontSize={fontSize}
            color="rcoinBlue.1200"
            fontWeight="bold"
          >
            Blockchain
          </chakra.span>
        </Text>
        <Text alignSelf="center">
          RCoin is a digital representation of Rand, in the form of a blockchain
          token. The token is hosted on the Solana blockchain network to
          maximise transaction speed and minimise the transaction cost. Due to
          this, our fees are significantly lower than traditional services.
        </Text>
      </Box>
      {/* <<<<<<< HEAD */}
      {/* <SolanaButton maxWidth="500px" /> */}
      {/* ======= */}
      <Grid paddingLeft={"10%"}>
        <Image src="big_solana.png" fit="contain" />
        <Link justifySelf="center" href="https://solana.com" isExternal>
          <Button variant="reactive" size="lg">
            Learn more about Solana
          </Button>
        </Link>
      </Grid>
      {/* >>>>>>> WebAppRedesign */}
    </HStack>
  );
};

const SolanaExplanation = () => {
  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  return useMobileView ? (
    <MobileSolanaExplanation />
  ) : (
    <DesktopSolanaExplanation />
  );
};

export default SolanaExplanation;
