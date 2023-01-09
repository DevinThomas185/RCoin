import { Grid, useBreakpointValue, VStack } from "@chakra-ui/react";
import InformationPane from "../../Common/InformationPane";
import AuditExplanation from "./AuditExplanation";
import ExplanationHeader from "./ExplanationHeader";
import SolanaExplanation from "./SolanaExplanation";

const ExplanationPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  const gap = useMobileView ? 6 : 0;

  return (
    <InformationPane colour={"rcoinBlue.1000"}>
      <VStack alignSelf="center" gap={gap}>
        <SolanaExplanation />
        <AuditExplanation onGetStarted={onGetStarted} />
      </VStack>
    </InformationPane>
  );
};

export default ExplanationPage;
