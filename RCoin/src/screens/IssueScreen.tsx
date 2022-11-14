import React, { useState } from "react";
import { Text, View, Card, Button, Wizard, Colors } from "react-native-ui-lib";
import { useBackHandler } from "../services/BackHandler";
import IssueAmount from './IssueStages/Issue0Amount'
import IssueSummary from './IssueStages/Issue1Summary'
import IssueSuccess from './IssueStages/Issue2Success'


const TransferScreen = () => {
  const [stage, setStage] = useState(0);
  const [recipient, setRecipient] = useState("");

  const backHandlerAction = () => {
    switch (stage) {
      case 1:
        setStage(stage - 1)
        return true
      case 2:
        setStage(0)
        return true
      default:
        return false
    }
  }

  useBackHandler(backHandlerAction)

  const renderCurrentStage = () => {
    if (stage == 0) {
      return <IssueAmount setStage={setStage} />;
    }
    else if (stage == 1) {
      return <IssueSummary setStage={setStage} />;
    }
    else {
      return <IssueSuccess setStage={setStage} />;
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
        <Wizard.Step state={getStageState(0)} label={"Making A Deposit"} />
        <Wizard.Step state={getStageState(1)} label={"Payment Summary"} />
        <Wizard.Step state={getStageState(2)} label={"Confirmation"} />
      </Wizard>
      {renderCurrentStage()}
    </View>
  )

}

export default TransferScreen
