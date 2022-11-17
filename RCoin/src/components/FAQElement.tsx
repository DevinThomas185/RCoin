import React from "react";
import { Text, View, ExpandableSection } from "react-native-ui-lib";
import styles from "../style/style";
import Ionicons from "react-native-vector-icons/Ionicons"


const FAQElement = ({
  question,
  answer,
  openQ,
  setOpenQ,
}: {
  question: string;
  answer: string;
  openQ: string,
  setOpenQ: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <ExpandableSection
            expanded={openQ === question}
            sectionHeader={
            <View spread row style={styles.faq}>
                <Text marginL-10 text60>{question}</Text>
                <Ionicons size={30} name={openQ === question ? "chevron-up" : "chevron-down"} />
            </View>
            }
            onPress={() => {
            if (openQ === question) {
                setOpenQ("")
            } else {
                setOpenQ(question)
            }
            }}
        >
            <Text marginH-20 marginB-20>
            {answer}
            </Text>
        </ExpandableSection>
    );
}

export default FAQElement;
