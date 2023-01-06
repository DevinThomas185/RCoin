import { Grid, Spacer, useBreakpointValue } from "@chakra-ui/react";
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
    <InformationPane gradientDirection="to-bl" gradientStrength={400}>
      <ExplanationHeader />
      <Grid alignSelf="center" gap={gap}>
        <SolanaExplanation />
        <AuditExplanation onGetStarted={onGetStarted} />
      </Grid>
    </InformationPane>
  );
};

export default ExplanationPage;
