import { Flex, Heading, Skeleton, Stat, StatLabel, StatNumber, Center, Box } from '@chakra-ui/react';
import Welcome from './Welcome';
// import Table2 from './Audit/Table2';
import TableChakra from './Audit/TableChakra';

const AuditPage = ({ email, isAuth }: { email: string, isAuth: boolean }) => {
  return (
    <Box>
      <Heading textAlign={"center"}>Real Time Audit </Heading>

      <Welcome email={email} isAuth={isAuth} />


      {/* <Table2 /> */}
      <TableChakra />

    </Box>


  )


}

export default AuditPage;