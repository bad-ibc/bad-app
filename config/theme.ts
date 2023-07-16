import { extendTheme } from '@chakra-ui/react';
import { StyleFunctionProps } from '@chakra-ui/theme-tools'

export const defaultTheme = extendTheme({
  initialColorMode: 'light',
  // styles: {
  //   global: (props: StyleFunctionProps) => ({
  //     body: {
  //       color: 'default',
  //       bg: '#1B1B18',
  //     },
  //   }),
  // },
  fonts: {
    body: 'Made Of Scars, Inter, system-ui, sans-serif',
    heading: 'Made Of Scars, Work Sans, system-ui, sans-serif',
  },
  colors: {
    brand: {
      100: "#1B1B18",
      900: "#1B1B18"
    },
    gray: {
      100: '#EEF2F8',
      200: '#EEF2F8',
      300: '#EEF2F8',
      400: '#EEF2F8',
      500: '#EEF2F8',
      600: '#1B1B18',
      700: '#1B1B18',
      800: '#1B1B18',
      900: '#1B1B18',
    },
    primary: {
      50: '#1B1B18',
      100: '#1B1B18',
      200: '#1B1B18',
      300: '#1B1B18',
      400: '#1B1B18',
      500: '#1B1B18',
      600: '#EEF2F8',
      700: '#EEF2F8',
      800: '#EEF2F8',
      900: '#EEF2F8',
    },
    black: {
      100: '#EEF2F8',
      200: '#EEF2F8',
      300: '#EEF2F8',
      400: '#EEF2F8',
      500: '#EEF2F8',
      600: '#1B1B18',
      700: '#1B1B18',
      800: '#1B1B18',
      900: '#1B1B18',
    },
  },
  breakPoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  },
  shadows: {
    largeSoft: 'rgba(60, 64, 67, 0.15) 0px 2px 10px 6px;',
  },
});
