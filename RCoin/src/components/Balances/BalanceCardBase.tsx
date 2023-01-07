import React from 'react';
import {Card} from 'react-native-ui-lib';
import styles from '../../style/style';

const BalanceCardBase = ({
  amount,
  subtext,
}: {
  amount: number;
  subtext: string;
}) => {
  const numberWithCommas = (x: number) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
  };

  return (
    <Card
      enableShadow
      style={{flexDirection: 'row'}}
      activeOpacity={1}
      selectionOptions={{
        color: styles.rcoin,
        indicatorSize: 25,
        borderWidth: 3,
      }}>
      <Card.Section
        center
        imageSource={require('../../style/Logo.png')}
        imageStyle={{
          width: 70,
          height: 70,
        }}
      />
      <Card.Section
        center
        content={[
          {
            text: numberWithCommas(amount),
            text30: true,
            $textDefault: true,
          },
          {
            text: subtext,
            text90: true,
            $textDisabled: true,
          },
        ]}
      />
    </Card>
  );
};

export default BalanceCardBase;
