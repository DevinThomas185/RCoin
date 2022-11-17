import { QuestionIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Grid,
  HStack,
  IconButton,
  Skeleton,
  Spacer,
  Collapse,
  useDisclosure,
  useOutsideClick,
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
    <Grid maxWidth="1080px" gap={1} marginLeft="auto" marginRight="auto">
      <Box
        textAlign="center"
        fontSize="5xl"
        fontWeight="bold"
        color="rcoinBlue.600"
      >
        Real-Time Audit
        <IconButton
          ref={ref}
          aria-label="Learn More about the Audit"
          marginLeft="10px"
          variant="reactive"
          size="sm"
          onClick={onToggle}
          icon={<QuestionIcon />}
        ></IconButton>
      </Box>
      <AuditTotals
        amountInReserve={rand_in_reserve}
        amountIssued={issued_coins}
        ratio={ratio}
        isLoaded={isLoaded}
      />
      <HStack
        marginLeft="auto"
        marginRight="auto"
        paddingLeft="10px"
        bg="rcoinBlue.100"
        paddingRight="10px"
        borderRadius="25px"
        width="fit-content"
        justifyContent="center"
      >
        <Text fontSize="sm"> Last Updated: </Text>
        <Box fontWeight="bold" fontSize="md">
          {" "}
          {date}{" "}
        </Box>
        <Box fontWeight="bold" fontSize="md">
          {" "}
          {time}{" "}
        </Box>
      </HStack>
      <Collapse animateOpacity in={isOpen}>
        <AuditExplanationPopup />
      </Collapse>
    </Grid>
  );
};

export default AuditHeader;
