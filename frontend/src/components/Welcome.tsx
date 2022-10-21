import { Flex, Heading, Skeleton, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useEffect, useState } from "react";

const Test = () => {

    const [rand_in_reserve, setRandInReserve] = useState(0.0);
    const [issued_coins, setIssuedCoins] = useState(0.0);
    const [ratio, setRatio] = useState(0.0);
    const [datetime, setDateTime] = useState("");
    const [isLoaded, setIsLoaded] = useState(false)

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
            var date = (today.getMonth()+1) +'/'+ today.getDate() +"/"+ today.getFullYear()
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
            setDateTime(time + " on " + date)
            setIsLoaded(true)
        })
    }, [])

    
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
    </div>
}

export default Test