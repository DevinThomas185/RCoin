import { Grid, Spacer, chakra, VStack } from "@chakra-ui/react";
import InformationPane from "../../Common/InformationPane";
import AuditExplanation from "./AuditExplanation";
import ExplanationHeader from "./ExplanationHeader";
import SolanaExplanation from "./SolanaExplanation";

const ExplanationPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <InformationPane colour={"rcoinBlue.1000"}>
      {/* <ExplanationHeader /> */}
      <VStack alignSelf="center" gap={0}>
        <SolanaExplanation />
        <AuditExplanation onGetStarted={onGetStarted} />
      </VStack>
    </InformationPane>
  );
};

export default ExplanationPage;
