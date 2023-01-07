import {ScrollView} from 'react-native';
import {View} from 'react-native-ui-lib';
import FAQs from './faqs.json';
import {useState} from 'react';
import FAQElement from '../../components/FAQElement';

const FAQScreen = () => {
  const [openQ, setOpenQ] = useState('');

  return (
    <View flex margin-10>
      <ScrollView>
        {FAQs.faqs.map(q => (
          <FAQElement
            key={q.question}
            question={q.question}
            answer={q.answer}
            openQ={openQ}
            setOpenQ={setOpenQ}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default FAQScreen;
