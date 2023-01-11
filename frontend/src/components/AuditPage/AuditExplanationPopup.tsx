import {
  Image,
  Box,
  Grid,
  HStack,
  Flex,
  Text,
  Button,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const becomeAnAuditorButton = (
  <Link to={"/auditorSignup"} onClick={() => window.scrollTo(0, 0)}>
    <Button maxWidth="300px" variant="reactiveDark">
      Become an Auditor
    </Button>
  </Link>
);
const auditingInfoButton = (
  <Button
    maxWidth="300px"
    variant="reactiveDark"
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
      bg="rcoinBlue.50"
      borderRadius="5px"
      borderColor="rcoinBlue.1100"
      borderWidth="3px"
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
        marginRight="20px"
        fontWeight="bold"
        color="rcoinBlue.1100"
      >
        Why do we need the Audit?
      </Box>
      <HStack>
        {useMobileView ? null : (
          <Image
            src="parity.png"
            justifySelf="center"
            maxWidth="15%"
            fit="contain"
          />
        )}
        <Text
          marginLeft="20px"
          paddingRight="30px"
          textAlign="left"
          color="black"
        >
          To ensure that your funds are safe with us, we have built a real-time
          auditing system. It allows all users to check the total number of
          RCoin that were issued and make sure that it is fully backed by Rand
          in our reserve account. That way we can prove that at any given time,
          our reserve has enough liquidity to allow all users to withdraw their
          funds. It also ensures that RCoin is not inflationary and 1 RCoin is
          always worth exactly 1 Rand. You can sign up to become an auditor and
          get view access to our reserve account to make sure that all RCoin are
          proprely backed.
        </Text>
      </HStack>
      {useMobileView ? (
        <Box margin="auto" marginBottom="10px" marginTop="10px">
          {becomeAnAuditorButton}
        </Box>
      ) : (
        <HStack justifySelf="right" margin="10px">
          {becomeAnAuditorButton}
          {auditingInfoButton}
        </HStack>
      )}
    </Grid>
  );
};

export default AuditExplanationPopup;
