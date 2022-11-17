import { HStack, Text, Image } from "@chakra-ui/react";

const CustomText = ({ children }: { children: string }) => {
  return (
    <Text fontSize="5xl" fontWeight="bold" color="rcoinBlue.600">
      {children}
    </Text>
  );
};

const GradientText = ({ children }: { children: string }) => {
  return (
    <Text
      bgGradient="linear(to-l, #0FF3B1, #CC43E7)"
      bgClip="text"
      fontSize="5xl"
      fontWeight="extrabold"
    >
      {children}
    </Text>
  );
};

const FancyHeader = () => {
  return (
    <HStack justifySelf="center" alignItems="flex-end" height="fit-content">
      <Image src="big_logo.png" boxSize="200px" height="100px" fit="contain" />
      <CustomText> - a </CustomText>
      <GradientText> digital</GradientText>
      <CustomText> equivalent of Rand </CustomText>
    </HStack>
  );
};

export default FancyHeader;
