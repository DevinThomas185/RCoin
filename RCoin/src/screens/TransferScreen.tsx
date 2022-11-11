import React, { useState } from "react";
import { Text, View, Card, Button, Wizard, Colors } from "react-native-ui-lib";
import TransferEmail from "../components/Transfer0Email";
import TransferAmount from "../components/Transfer1Amount";
import TransferConfirm from "../components/Transfer2Confirm";
import TransferSuccess from "../components/Transfer3Success";


const TransferScreen = () => {
  const [stage, setStage] = useState(0);
  const [recipient, setRecipient] = useState("");



  const renderCurrentStage = () => {
    if (stage == 0) {
      return <TransferEmail setStage={setStage} />;
    }
    else if (stage == 1) {
      return <TransferAmount setStage={setStage} />;
    }
    else if (stage == 2) {
      return <TransferConfirm setStage={setStage} />;
    }
    else {
      return <TransferSuccess setStage={setStage} />;
    }
  }

  const getStageState = (givenStage: number) => {
    let state = Wizard.States.DISABLED;
    if (stage > givenStage) {
      state = Wizard.States.COMPLETED;
    }
    else if (givenStage == stage) {
      state = Wizard.States.ENABLED;
    }

    return state
  }

  return (
    <View flex>
      <Wizard activeIndex={stage}>
        <Wizard.Step state={getStageState(0)} label={"Choose Recipient"} />
        <Wizard.Step state={getStageState(1)} label={"Choose Amount"} />
        <Wizard.Step state={getStageState(2)} label={"Confirmation"} />
        <Wizard.Step state={getStageState(3)} label={"Successful"} />
      </Wizard>
      {renderCurrentStage()}
    </View>
  )

}

export default TransferScreen
