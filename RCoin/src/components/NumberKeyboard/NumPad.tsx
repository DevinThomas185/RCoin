import {View} from 'react-native-ui-lib';
import BioButton from './BioButton';
import DecimalButton from './DecimalButton';
import DeleteButton from './DeleteButton';
import NumberButton from './NumberButton';

export const Numpad = ({
  numberString,
  button_style,
  dot_present,
  decimals,
  hasPoint = true,
  checkBio,
  setNumberString,
  setDecimals,
  setDotPresent,
}: {
  numberString: string;
  button_style: {
    height: number;
    width: number;
  };
  dot_present: boolean;
  decimals: number;
  hasPoint: boolean;
  checkBio?: () => Promise<void>;
  setNumberString: React.Dispatch<React.SetStateAction<string>>;
  setDecimals: React.Dispatch<React.SetStateAction<number>>;
  setDotPresent: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <View row style={{justifyContent: 'space-between'}}>
        {['1', '2', '3'].map(label => (
          <NumberButton
            key={label}
            current_number={numberString}
            style={button_style}
            label={label}
            dot_present={dot_present}
            decimals={decimals}
            setNumberString={setNumberString}
            setDecimals={setDecimals}
          />
        ))}
      </View>
      <View row style={{justifyContent: 'space-between'}}>
        {['4', '5', '6'].map(label => (
          <NumberButton
            key={label}
            current_number={numberString}
            style={button_style}
            label={label}
            dot_present={dot_present}
            decimals={decimals}
            setNumberString={setNumberString}
            setDecimals={setDecimals}
          />
        ))}
      </View>
      <View row style={{justifyContent: 'space-between'}}>
        {['7', '8', '9'].map(label => (
          <NumberButton
            key={label}
            current_number={numberString}
            style={button_style}
            label={label}
            dot_present={dot_present}
            decimals={decimals}
            setNumberString={setNumberString}
            setDecimals={setDecimals}
          />
        ))}
      </View>
      <View row style={{justifyContent: 'space-between'}}>
        {hasPoint ? (
          <DecimalButton
            current_number={numberString}
            style={button_style}
            dot_present={dot_present}
            setNumberString={setNumberString}
            setDotPresent={setDotPresent}
          />
        ) : (
          <BioButton style={button_style} checkBio={checkBio} />
        )}
        <NumberButton
          current_number={numberString}
          style={button_style}
          label="0"
          dot_present={dot_present}
          decimals={decimals}
          setNumberString={s => {
            if (numberString !== '0') {
              setNumberString(s);
            }
          }}
          setDecimals={setDecimals}
        />
        <DeleteButton
          current_number={numberString}
          style={button_style}
          dot_present={dot_present}
          decimals={decimals}
          setNumberString={setNumberString}
          setDotPresent={setDotPresent}
          setDecimals={setDecimals}
        />
      </View>
    </>
  );
};
