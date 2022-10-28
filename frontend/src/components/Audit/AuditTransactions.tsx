import { Stat, StatLabel, StatNumber, Skeleton } from "@chakra-ui/react"

const AuditTransactions = ({ text, isLoaded, title }: { text: string, isLoaded: boolean, title: string }) => {
    return (
        <Stat>
            <StatLabel textAlign={"center"} fontSize='2xl'>{title}</StatLabel>
            <StatNumber fontSize='6xl'>
                <Skeleton textAlign={"center"} isLoaded={isLoaded}>
                    {text}
                </Skeleton>
            </StatNumber>
        </Stat>
    )
}


export default AuditTransactions