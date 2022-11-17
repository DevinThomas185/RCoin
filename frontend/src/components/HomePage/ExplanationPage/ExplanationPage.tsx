import { Grid, Spacer } from "@chakra-ui/react";
import InformationPane from "../../Common/InformationPane";
import AuditExplanation from "./AuditExplanation";
import ExplanationHeader from "./ExplanationHeader";
import SolanaExplanation from "./SolanaExplanation";

const ExplanationPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <InformationPane gradientDirection="to-bl" gradientStrength={400}>
      <ExplanationHeader />
      <Spacer />
      <Grid alignSelf="center" gap={0}>
        <SolanaExplanation />
        <AuditExplanation onGetStarted={onGetStarted} />
      </Grid>
    </InformationPane>
  );
};

export default ExplanationPage;
