import { Grid, Image, Box, HStack, Button } from "@chakra-ui/react";

const MobileLeftPane = ({ onLearnMore }: { onLearnMore: () => void }) => {
  return (
    <Grid
      gap={0}
      justifyItems="center"
      alignItems="stretch"
      marginLeft="auto"
      marginRight="auto"
    >
      <Image src="big_logo.png" boxSize="300px" height="100px" fit="contain" />
      <Box
        textAlign="left"
        fontSize="6xl"
        fontWeight="bold"
        color="rcoinBlue.600"
      >
        The Future of Online Transactions
      </Box>
      <HStack alignItems="Center">
        <Image src="solana.png" maxWidth="70px" fit="contain" />
        <Box
          textAlign="left"
          fontSize="2xl"
          fontWeight="bold"
          color="rcoinBlue.800"
        >
          Instant on-chain transfers powered by the Solana blockchain.
        </Box>
      </HStack>
      <Button variant="reactive" size="lg" onClick={onLearnMore}>
        Learn More
      </Button>
    </Grid>
  );
};

export default MobileLeftPane;
