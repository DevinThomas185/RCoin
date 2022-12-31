import { HStack, Text, Image, Box, Grid, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import "../../../main.css";

const LeftPane = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <Grid gap={6}>
      <Image
        src="blockchain_loop.png"
        maxWidth="35%"
        justifySelf="center"
        fit="contain"
      />
      <Box justifySelf="center">
        <Link to={"/audit"} onClick={() => window.scrollTo(0, 0)}>
          <Button variant="reactive" size="lg">
            Check our Audit
          </Button>
        </Link>
      </Box>
      <Image
        src="parity.png"
        maxWidth="35%"
        justifySelf="center"
        fit="contain"
      />
      <Button
        justifySelf="center"
        variant="reactive"
        size="lg"
        onClick={onGetStarted}
      >
        Get Started
      </Button>
    </Grid>
  );
};

const AuditDescription = () => {
  const fontSize = "46px";
  return (
    <Box
      bg="white"
      // justifySelf="right"
      // alignItems="center"
      maxWidth="50%"
      height="fit-content"
      padding="3"
      borderRadius="25"
    >
      {/* <Image src="transparency.png" maxWidth="350px" fit="contain" /> */}
      {/* <div className="glass" style={{ justifyContent: "center" }}>
        {" "}
        Transparency in everything we do
      </div> */}
      <div className="title">
        <h1>Transparency in everything we do</h1>

        <div className="glass-child glass"></div>
      </div>
      <Text alignSelf="center">
        Every transaction we make is visible on the blockchain ensuring fair
        play. Our real-time auditing system shows every ZAR transfer flowing
        into and out of our reserve account and the corresponding on-chain
        transaction. This ensures that every RCoin we issue is backed by exactly
        1 Rand. That way all of our users can withdraw their Rand anytime,
        anywhere.
      </Text>
    </Box>
  );
};

const AuditExplanation = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <HStack>
      <LeftPane onGetStarted={onGetStarted} />
      <AuditDescription />
    </HStack>
  );
};

export default AuditExplanation;
