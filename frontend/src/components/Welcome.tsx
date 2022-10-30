import { Flex, Heading, Skeleton, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useEffect, useState } from "react";

const Welcome = ({ email, isAuth }: { email: string, isAuth: boolean }) => {

    const [rand_in_reserve, setRandInReserve] = useState(0.0);
    const [issued_coins, setIssuedCoins] = useState(0.0);
    const [ratio, setRatio] = useState(0.0);
    const [datetime, setDateTime] = useState("");
    const [isLoaded, setIsLoaded] = useState(false)
    const [token_balance, setTokenBalance] = useState(0.0)
    const [sol_balance, setSolBalance] = useState(0.0)
    const [balanceLoaded, setBalanceLoaded] = useState(false)

    useEffect(() => {
        const requestOptions = {
            method: "GET"
        }

        fetch("/api/audit", requestOptions)
            .then(res => res.json())
            .then(data => {
                setRandInReserve(data["rand_in_reserve"])
                setIssuedCoins(data["issued_coins"])
                setRatio(data["rand_per_coin"])
                var today = new Date()
                var date = today.toLocaleDateString()
                var time = today.toLocaleTimeString()
                setDateTime(time + " on " + date)
                setIsLoaded(true)
            })

        if (isAuth) {
            fetch("/api/get_token_balance", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "email": email }, null, 2)
            })
                .then(res => res.json())
                .then(data => {
                    setTokenBalance(data["token_balance"])
                    setSolBalance(data["sol_balance"])
                    setBalanceLoaded(true)
                })
        }
    }, [email, isAuth])


    return <div>
        <Flex>
            <Stat>
                <StatLabel fontSize='2xl'>Rand in Reserve</StatLabel>
                <StatNumber fontSize='6xl'>
                    <Skeleton isLoaded={isLoaded}>
                        R{rand_in_reserve}
                    </Skeleton>
                </StatNumber>
            </Stat>
            <Stat>
                <StatLabel fontSize='2xl'>Coins Issued</StatLabel>
                <StatNumber fontSize='6xl'>
                    <Skeleton isLoaded={isLoaded}>
                        {issued_coins}
                    </Skeleton>
                </StatNumber>
            </Stat>
            <Stat>
                <StatLabel fontSize='2xl'>Rand per Coin</StatLabel>
                <StatNumber fontSize='6xl'>
                    <Skeleton isLoaded={isLoaded}>
                        R{ratio}
                    </Skeleton>
                </StatNumber>
            </Stat>
        </Flex>
        <Heading>
            <Skeleton isLoaded={isLoaded}>
                As of {datetime}
            </Skeleton>
        </Heading>
        {
            isAuth ?
                <Skeleton isLoaded={balanceLoaded} marginTop="20">
                    <Heading>
                        RCoin Balance: {token_balance}
                    </Heading>
                    <Heading>
                        Solana Balance: {sol_balance}
                    </Heading>
                </Skeleton>
                :
                <>
                </>
        }
    </div>
}

export default Welcome