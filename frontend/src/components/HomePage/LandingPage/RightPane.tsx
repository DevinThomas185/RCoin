import { Box, Grid, Button, Image, VStack } from "@chakra-ui/react";

const RightPane = ({ onLearnMore }: { onLearnMore: () => void }) => {
  return (
    <Box
      alignContent={"left"}
      justifyContent={"left"}
      // marginRight={"auto"}
      // marginLeft={"100px"}
    >
      <Image
        src="RCoinWebLogo.png"
        // boxSize="300px"
        height="150px"
        fit="contain"
      />
      <Box
        textAlign="left"
        fontSize="5xl"
        fontWeight="medium"
        color="rcoinBlue.1000"
        marginLeft={"auto"}
        marginRight={"auto"}
      >
        The future of online transactions today.
      </Box>
    </Box>
  );
};

export default RightPane;
