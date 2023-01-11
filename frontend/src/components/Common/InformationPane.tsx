import { Box, Grid } from "@chakra-ui/react";

const InformationPane = ({
  colour,
  children,
  overrideMaxHeight,
}: {
  colour: string;
  children: JSX.Element | JSX.Element[];
  overrideMaxHeight?: string;
}) => {
  const maxHeight = overrideMaxHeight ? overrideMaxHeight : "90%";
  return (
    <Box maxHeight={maxHeight} bgColor={colour}>
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
