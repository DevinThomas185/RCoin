import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";

import { useColorModeValue } from "@chakra-ui/react";

const baseStyle = defineStyle({
  borderRadius: 5,
  fontWeight: "normal",
  fontFamily: "mono",
});

const sizes = {
  md: defineStyle({
    fontSize: "sm", // (14px)
  }),
};

// Defining a custom variant
const reactiveButton = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    fontFamily: "sans-serif",
    bg: `${c}.50`,
    fontWeight: "semibold",
    color: useColorModeValue("#435C9C", "#611f37"),
    borderRadius: "3xl",
    borderColor: `${c}.50`,
    transition: "transform 0.15s ease-out, background 0.15s ease-out",

    _dark: {
      bg: `${c}.200`,
      color: "gray.800",
    },

    _hover: {
      transform: "scale(1.05, 1.05)",
      bg: `${c}.100`,

      _dark: {
        bg: `${c}.300`,
      },
    },

    _active: {
      bg: `${c}.300`,
      transform: "scale(1, 1)",

      _dark: {
        bg: `${c}.500`,
      },
    },
  };
});

const reactiveButtonDark = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    fontFamily: "sans-serif",
    bg: `${c}.100`,
    fontWeight: "semibold",
    color: `${c}.700`,
    borderRadius: "3xl",
    borderColor: `${c}.100`,
    transition: "transform 0.15s ease-out, background 0.15s ease-out",

    _dark: {
      bg: `${c}.200`,
      color: "gray.800",
    },

    _hover: {
      transform: "scale(1.05, 1.05)",
      bg: `${c}.200`,

      _dark: {
        bg: `${c}.300`,
      },
    },

    _active: {
      bg: `${c}.400`,
      transform: "scale(1, 1)",

      _dark: {
        bg: `${c}.500`,
      },
    },
  };
});

export const buttonTheme = defineStyleConfig({
  baseStyle,
  sizes,
  variants: {
    reactive: reactiveButton,
    reactiveDark: reactiveButtonDark,
  },
  defaultProps: {
    colorScheme: "rcoinBlue",
  },
});
