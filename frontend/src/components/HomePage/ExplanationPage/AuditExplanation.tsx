import {
  HStack,
  Text,
  Image,
  Box,
  Grid,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import "../../../main.css";

const AuditPointer = ({
  imageHeight,
  maxWidth,
}: {
  imageHeight?: string;
  maxWidth?: string;
}) => {
  const width = maxWidth ? maxWidth : "35%";
  return (
    <Grid maxWidth={width} margin="auto">
      <Image
        src="blockchain_loop.png"
        height={imageHeight}
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
    </Grid>
  );
};

const GetStartedPointer = ({
  imageHeight,
  onGetStarted,
  maxWidth,
}: {
  imageHeight?: string;
  onGetStarted: () => void;
  maxWidth?: string;
}) => {
  const width = maxWidth ? maxWidth : "35%";
  return (
    <Grid maxWidth={width} minWidth={width} margin="auto">
      <Image
        src="parity.png"
        height={imageHeight}
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
const MobileButtonGroup = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <HStack marginTop="25px" marginBottom="25px">
      <AuditPointer imageHeight="70px" maxWidth="50%" />
      <GetStartedPointer
        imageHeight="70px"
        onGetStarted={onGetStarted}
        maxWidth="50%"
      />
    </HStack>
  );
};

const ButtonGroup = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <Grid gap={6}>
      <AuditPointer />
      <GetStartedPointer onGetStarted={onGetStarted} />
    </Grid>
  );
};
const MobileAuditDescription = ({
  overrideWidth,
}: {
  overrideWidth?: string;
}) => {
  const width = overrideWidth ? overrideWidth : "fit-content";

  const fontSize = "42px";
  return (
    <Box
      bg="white"
      // justifySelf="right"
      // alignItems="center"
      maxWidth={width}
      height="fit-content"
      padding="2"
    >
      <div className="mobileTitle" style={{ fontSize: fontSize }}>
        <h1>Transparency in everything we do</h1>

        <div className="glass-child glass"></div>
      </div>
      <Text>
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

const AuditDescription = ({ overrideWidth }: { overrideWidth?: string }) => {
  const width = overrideWidth ? overrideWidth : "fit-content";

  return (
    <Box
      bg="white"
      maxWidth="50%"
      height="fit-content"
      padding="3"
      borderRadius="25"
    >
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

const MobileAuditExplanation = ({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) => {
  return (
    <Grid>
      <MobileAuditDescription />
      <MobileButtonGroup onGetStarted={onGetStarted} />
    </Grid>
  );
};

const DesktopAuditExplanation = ({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) => {
  return (
    <HStack>
      <ButtonGroup onGetStarted={onGetStarted} />
      <AuditDescription overrideWidth="56%" />
    </HStack>
  );
};

const AuditExplanation = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  return useMobileView ? (
    <MobileAuditExplanation onGetStarted={onGetStarted} />
  ) : (
    <DesktopAuditExplanation onGetStarted={onGetStarted} />
  );
};

export default AuditExplanation;
