import React from 'react';
import {Card, View, Button} from 'react-native-ui-lib';
import styles from '../../style/style';
import {Linking} from 'react-native';
import Config from 'react-native-config';
import style from '../../style/style';

const AuditCardBase = ({colour, ratio}: {colour: string; ratio: number}) => {
  return (
    <View row>
      <Button
        marginR-5
        label="View the Audit"
        backgroundColor={style.solana_black}
        borderRadius={10}
        borderWidth={1}
        onPress={() => Linking.openURL(Config.AUDIT_URL!)}
      />
      <Card
        marginL-5
        flex
        enableShadow
        center
        style={{
          flexDirection: 'row',
          borderColor: styles.success,
          borderWidth: 1,
        }}
        activeOpacity={1}
        selectionOptions={{
          color: colour,
          indicatorSize: 25,
          borderWidth: 3,
        }}>
        <Card.Section
          content={[
            {
              text: ratio,
              text30: true,
              $textDefault: true,
            },
            {
              text: ' Audit Ratio ',
              text90: true,
              $textDisabled: true,
            },
          ]}
        />
      </Card>
    </View>
  );
};

export default AuditCardBase;
