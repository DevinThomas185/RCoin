import { Box, Grid } from "@chakra-ui/react";

const InformationPane = ({
  gradientDirection,
  gradientStrength,
  children,
}: {
  gradientDirection: string;
  gradientStrength: number;
  children: JSX.Element | JSX.Element[];
  overrideMaxWidth?: string;
}) => {
  const gradientSetting = `linear(${gradientDirection}, white, rcoinBlue.${gradientStrength})`;
  return (
    <Box maxHeight="90%" bgGradient={gradientSetting}>
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
