import { Box, Grid } from "@chakra-ui/react";

const InformationPane = ({
  colour,
  children,
}: {
  colour: string;
  children: JSX.Element | JSX.Element[];
  overrideMaxWidth?: string;
}) => {
  return (
    <Box maxHeight="90%" bgColor={colour}>
      <Grid
        minH="100vh"
        maxW="1080px"
        marginLeft="auto"
        marginRight="auto"
        p={3}
      >
        {children}
      </Grid>
    </Box>
  );
};

export default InformationPane;
