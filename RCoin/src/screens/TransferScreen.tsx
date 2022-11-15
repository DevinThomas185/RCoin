import React, { useState } from "react";
import { View, Wizard } from "react-native-ui-lib";
import TransferEmail from "./TransferStages/Transfer0Email";
import TransferAmount from "./TransferStages/Transfer1Amount";
import TransferConfirm from "./TransferStages/Transfer2Confirm";
import TransferSuccess from "./TransferStages/Transfer3Success";
import { useBackHandler } from "../services/BackHandler";


const TransferScreen = () => {
  const [stage, setStage] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0.0);

  const backHandlerAction = () => {
    switch (stage) {
      case 1:
      case 2:
        setStage(stage - 1)
        return true
      case 3:
        setStage(0)
        return true
      default:
        return false
    }
  }

  useBackHandler(backHandlerAction)


  const renderCurrentStage = () => {
    if (stage == 0) {
      return <TransferEmail nextStage={() => {setStage(1)}} setRecipient={setRecipient} />;
    }
    else if (stage == 1) {
      return <TransferAmount nextStage={() => {setStage(2)}} setAmount={setAmount} />;
    }
    else if (stage == 2) {
      return <TransferConfirm nextStage={() => {setStage(3)}} deduction={amount} recipient={recipient} />;
    }
    else {
      return <TransferSuccess nextStage={() => {setStage(0)}} amount={amount} recipient={recipient}/>;
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
