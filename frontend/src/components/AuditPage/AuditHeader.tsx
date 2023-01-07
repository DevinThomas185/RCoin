import { QuestionIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Grid,
  HStack,
  IconButton,
  Collapse,
  useDisclosure,
  useOutsideClick,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AuditExplanationPopup from "./AuditExplanationPopup";
import AuditTotals from "./AuditTotals";
import { useRef } from "react";

const AuditHeader = () => {
  const [rand_in_reserve, setRandInReserve] = useState(0.0);
  const [issued_coins, setIssuedCoins] = useState(0.0);
  const [ratio, setRatio] = useState(0.0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const ref = useRef<any>();

  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  const headerDirection = useMobileView ? "column" : "row";

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (isOpen) {
        onToggle();
      }
    },
  });

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };

    fetch("/api/audit", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setRandInReserve(data["rand_in_reserve"]);
        setIssuedCoins(data["issued_coins"]);
        setRatio(data["rand_per_coin"]);
        var today = new Date();
        var date = today.toLocaleDateString();
        var time = today.toLocaleTimeString();
        setDate(date);
        setTime(time);
        setIsLoaded(true);
      });
  });

  return (
    <Grid
      gap={2}
      marginLeft="auto"
      marginRight="auto"
      marginBottom="20px"
      marginTop="20px"
    >
      <Flex
        direction={headerDirection}
        marginLeft="auto"
        marginRight="auto"
        bg="rcoinBlue.1000"
        borderRadius="5px"
        padding="10px"
      >
        <Box
          textAlign="center"
          fontSize="4xl"
          fontWeight="bold"
          color="rcoinBlue.1100"
        >
          <Grid>
            <Box marginBottom="5px">Real-Time Audit</Box>
            <HStack
              marginLeft="auto"
              marginTop="-5px"
              paddingLeft="10px"
              color="black"
              bg="rcoinBlue.1000"
              borderRadius="5px"
              width="fit-content"
            >
              <Text fontSize="sm"> Last Update:</Text>
              <Box fontWeight="bold" fontSize="md">
                {" "}
                {date}{" "}
              </Box>
              <Box
                fontWeight="bold"
                fontSize="md"
                width={"100px"}
                marginRight="auto"
              >
                {" "}
                {time}{" "}
              </Box>
              <IconButton
                ref={ref}
                aria-label="Learn More about the Audit"
                marginLeft="auto"
                marginRight="auto"
                variant="reactive"
                size="sm"
                onClick={onToggle}
                icon={<QuestionIcon />}
              ></IconButton>
            </HStack>
          </Grid>
        </Box>
        <AuditTotals
          amountInReserve={rand_in_reserve}
          amountIssued={issued_coins}
          ratio={ratio}
          isLoaded={isLoaded}
          useMobileView={useMobileView}
        />
      </Flex>
      <Collapse animateOpacity in={isOpen}>
        <AuditExplanationPopup />
      </Collapse>
    </Grid>
  );
};

export default AuditHeader;
