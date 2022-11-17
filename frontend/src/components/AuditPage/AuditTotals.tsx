import { Box, Image, Grid, HStack, Skeleton } from "@chakra-ui/react";

const RatioBox = ({
  ratio,
  isLoaded,
}: {
  ratio: number;
  isLoaded: boolean;
}) => {
  const color = ratio > 1 ? "green" : "red";
  return (
    <Box
      textAlign="center"
      bg="rcoinBlue.50"
      borderRadius="15px"
      fontSize="3xl"
      fontWeight="bold"
      paddingLeft="10px"
      paddingRight="10px"
      color={color}
    >
      <CustomSkeleton isLoaded={isLoaded} overrideWidth="100px">
        <HStack>
          <Box fontSize="xl">Ratio =</Box>
          <Box fontSize="5xl">{ratio}</Box>
        </HStack>
      </CustomSkeleton>
    </Box>
  );
};

const CustomSkeleton = ({
  children,
  isLoaded,
  overrideWidth,
}: {
  children: any;
  isLoaded: boolean;
  overrideWidth?: string;
}) => {
  const minWidth =
    typeof overrideWidth == "undefined" ? "200px" : overrideWidth;
  return (
    <Skeleton minWidth={minWidth} isLoaded={isLoaded} borderRadius="10px">
      {children}
    </Skeleton>
  );
};

const AuditTotals = ({
  amountInReserve,
  amountIssued,
  ratio,
  isLoaded,
}: {
  amountInReserve: number;
  amountIssued: number;
  ratio: number;
  isLoaded: boolean;
}) => {
  return (
    <HStack justifyContent="center">
      <Grid
        textAlign="center"
        borderRadius="25px"
        paddingLeft="10px"
        paddingRight="10px"
        bg="rcoinBlue.50"
      >
        <Box
          textAlign="center"
          fontSize="3xl"
          fontWeight="bold"
          color="rcoinBlue.700"
        >
          In Reserve
        </Box>
        <HStack>
          <Box fontWeight="bold" fontSize="4xl">
            ZAR{" "}
          </Box>
          <CustomSkeleton isLoaded={isLoaded}>
            <Box fontWeight="bold" fontSize="4xl">
              {amountInReserve}
            </Box>
          </CustomSkeleton>
        </HStack>
      </Grid>
      <RatioBox ratio={ratio} isLoaded={isLoaded} />
      <Grid
        textAlign="center"
        borderRadius="25px"
        paddingLeft="10px"
        paddingRight="10px"
        bg="rcoinBlue.50"
      >
        <Box fontSize="3xl" fontWeight="bold" color="rcoinBlue.700">
          Coins Issued
        </Box>
        <HStack>
          <Image src="small_logo.png" boxSize="35px" marginLeft="9px" />
          <CustomSkeleton isLoaded={isLoaded}>
            <Box fontWeight="bold" fontSize="4xl" color="rcoinBlue.500">
              {amountIssued}
            </Box>
          </CustomSkeleton>
        </HStack>
      </Grid>
    </HStack>
  );
};

export default AuditTotals;
