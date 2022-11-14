import React, { useState, useEffect } from "react";
import { Text, View, Card, Button, Wizard, Colors } from "react-native-ui-lib";
import WithdrawStage0 from "../components/WithdrawStage0";
import WithdrawStage1 from "../components/WithdrawStage1";
import WithdrawStage2 from "../components/WithdrawStage2";
import WithdrawStage3 from "../components/WithdrawStage3";
import { useAuth } from '../contexts/Auth';


const WithdrawScreen = () => {
  const [stage, setStage] = useState(0);
  const [coins_to_withdraw, setCoinstoWithdraw] = useState(0.0);
  const [rands_being_credited, setRandsBeingCredited] = useState(0.0);
  const [bank_account, setBankAccount] = useState<{ [key: string]: string }>({
    bank_account: "",
    sort_code: ""
  });
  const [token_balance, setTokenBalance] = useState(0.0);
  const [sol_balance, setSolBalance] = useState(0.0);
  const auth = useAuth();

  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    fetch('http://10.0.2.2:8000/api/get_token_balance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setTokenBalance(data['token_balance']);
        setSolBalance(data['sol_balance']);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const renderCurrentStage = () => {
    switch (stage) {
      case 0:
        return <WithdrawStage0
          nextStage={() => { setStage(1) }}
        // token_balance={token_balance}
        // sol_balance={sol_balance}
        />;
      case 1:
        return <WithdrawStage1
          nextStage={() => { setStage(2) }}
          setCoinsToWithdraw={setCoinstoWithdraw}
          setRandsBeingCredited={setRandsBeingCredited}
          setBankAccount={setBankAccount}
        />;
      case 2:
        return <WithdrawStage2
          nextStage={() => { setStage(3) }}
          coins_to_withdraw={coins_to_withdraw}
          rands_being_credited={rands_being_credited}
          current_bank_account={bank_account}
          token_balance={token_balance}

        />
      case 3:
        return <WithdrawStage3
          nextStage={() => { setStage(0) }}
          coins_to_withdraw={coins_to_withdraw}
          rands_being_credited={rands_being_credited}
          bank_account={bank_account}
        />;
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
        <Wizard.Step state={getStageState(0)} label={"Select Amount"} />
        <Wizard.Step state={getStageState(1)} label={"Select Account"} />
        <Wizard.Step state={getStageState(2)} label={"Confirmation"} />
        <Wizard.Step state={getStageState(3)} label={"Success"} />
      </Wizard>
      {renderCurrentStage()}
    </View>
  )

}

export default WithdrawScreen