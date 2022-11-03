import {
  Flex,
  Heading,
  Skeleton,
  Stat,
  StatLabel,
  Center,
  Box,
  Spacer,
  ChakraProvider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AuditTransactions from "./Audit/AuditTransactions";

const Welcome = ({ isAuth }: { isAuth: boolean }) => {
  const [rand_in_reserve, setRandInReserve] = useState(0.0);
  const [issued_coins, setIssuedCoins] = useState(0.0);
  const [ratio, setRatio] = useState(0.0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [token_balance, setTokenBalance] = useState(0.0);
  const [sol_balance, setSolBalance] = useState(0.0);
  const [balanceLoaded, setBalanceLoaded] = useState(false);

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

    if (isAuth) {
      fetch("/api/get_token_balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTokenBalance(data["token_balance"]);
          setSolBalance(data["sol_balance"]);
          setBalanceLoaded(true);
        });
    }
  }, [isAuth]);

  return (
    <div>
      <Heading textAlign={"center"}>
        <Skeleton isLoaded={isLoaded} marginTop={10}>
          {date}
        </Skeleton>
        <Skeleton isLoaded={isLoaded}>{time}</Skeleton>
      </Heading>

      <Flex margin="10">
        <AuditTransactions
          isLoaded={isLoaded}
          amount={`${rand_in_reserve}`}
          unit="ZAR"
          title="Rand In Reserve"
        />
        <AuditTransactions
          isLoaded={isLoaded}
          amount={`${issued_coins}`}
          unit="Rcoin"
          title="Coins Issued"
        />
      </Flex>
      {isAuth ? (
        <Skeleton isLoaded={balanceLoaded} marginTop="20">
          <Heading>RCoin Balance: {token_balance}</Heading>
          <Heading>Solana Balance: {sol_balance}</Heading>
        </Skeleton>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Welcome;
