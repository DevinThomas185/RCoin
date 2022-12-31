import React, {useEffect} from 'react';
import {LoaderScreen, Card, View, Image} from 'react-native-ui-lib';
import styles from '../../style/style';
import {useAudit} from '../../contexts/AuditContext';
import AuditCardBase from './AuditCardBase';

const AuditCard = () => {
  const audit_context = useAudit();

  useEffect(() => {
    audit_context.refresh();
  }, []);

  if (audit_context.loading) {
    return (
      <View center>
        <LoaderScreen
          message={'Loading Audit Statistics'}
          color={styles.rcoin}
        />
      </View>
    );
  } else if (audit_context.ratio < 1.0) {
    return <AuditCardBase colour={styles.failed} ratio={audit_context.ratio} />;
  } else {
    return (
      <AuditCardBase colour={styles.success} ratio={audit_context.ratio} />
    );
  }
};

export default AuditCard;
