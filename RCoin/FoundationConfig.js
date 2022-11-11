import {Colors, Typography, Spacings} from 'react-native-ui-lib'

Colors.loadColors({
  rcoin: '#435C9C',
  secondaryColor: '#DB4646',
  textColor: '##222222',
  errorColor: '#E63B2E',
  successColor: '#ADC76F',
  warnColor: '##FF963C'
});

Typography.loadTypographies({
  heading: {fontSize: 58, fontWeight: '600'},
  subheading: {fontSize: 28, fontWeight: '500'},
  body: {fontSize: 18, fontWeight: '400'}
});

Spacings.loadSpacings({
  page: 20,
  card: 12,
  gridGutter: 16
});
