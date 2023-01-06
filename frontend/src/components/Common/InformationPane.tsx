import { Box, Grid } from "@chakra-ui/react";

const InformationPane = ({
  gradientDirection,
  gradientStrength,
  children,
  overrideMaxHeight,
}: {
  gradientDirection: string;
  gradientStrength: number;
  children: JSX.Element | JSX.Element[];
  overrideMaxHeight?: string;
}) => {
  const gradientSetting = `linear(${gradientDirection}, white, rcoinBlue.${gradientStrength})`;
  const maxHeight = overrideMaxHeight ? overrideMaxHeight : "90%";
  return (
    <Box maxHeight={maxHeight} bgGradient={gradientSetting}>
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
