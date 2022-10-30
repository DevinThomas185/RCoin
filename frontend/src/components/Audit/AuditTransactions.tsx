import { Stat, StatLabel, StatNumber, Skeleton, Text, Flex } from "@chakra-ui/react"
import '../../main.css'

const AuditTransactions = ({ unit, isLoaded, title, amount }: { unit: string, isLoaded: boolean, title: string, amount: string }) => {
    return (
        <Stat border={10}>
            <StatLabel textAlign={"center"} fontSize='4xl'>{title}</StatLabel>

            <Text textAlign={"center"}>
                <p>Total = <span> {amount} </span>{unit}</p>
            </Text>
        </Stat>
    )
}


export default AuditTransactions