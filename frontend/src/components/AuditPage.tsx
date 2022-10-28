import { Flex, Heading, Skeleton, Stat, StatLabel, StatNumber, Center, Box } from '@chakra-ui/react';
import Welcome from './Welcome';

const AuditPage = ({email, isAuth}: {email: string, isAuth: boolean}) => {
          return(
            <Box>
                <Heading textAlign={"center"}>Real Time Audit </Heading>
                
                <Welcome email={email} isAuth={isAuth}/>
            </Box>
                
                
          )
          
    
}

export default AuditPage;