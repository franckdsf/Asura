import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const fontFamily = defaultTheme.fontFamily;
const fontWeight: Record<string, string> = { 'regular': '400', 'medium': '500', 'semibold': '700', 'bold': '800' };
const fontSize: Record<string, Array<unknown>> = {
  '2xs': ['0.625rem', {
    letterSpacing: '0rem',
    lineHeight: '0.756rem',
    fontWeight: '500',
  }],
  xs: ['0.75rem', {
    letterSpacing: '0rem',
    lineHeight: '1.05rem',
    fontWeight: '400',
  }],
  md: ['1rem', {
    letterSpacing: '0rem',
    lineHeight: '1.213rem',
    fontWeight: '400',
  }],
  lg: ['1.125rem', {
    letterSpacing: '0rem',
    lineHeight: '1.463rem',
    fontWeight: '400',
  }],
  '2xl': ['2.5rem', {
    letterSpacing: '0rem',
    lineHeight: '2.375rem',
    fontWeight: '400',
  }],
  '3xl': ['3rem', {
    letterSpacing: '-0.12rem',
    lineHeight: '2.85rem',
    fontWeight: '400',
  }],
  '4xl': ['3.5rem', {
    letterSpacing: '-0.21rem',
    lineHeight: '3.325rem',
    fontWeight: '400',
  }],
  '6xl': ['5.75rem', {
    letterSpacing: '-0.23rem',
    lineHeight: '5.641rem',
    fontWeight: '400',
  }],
  '7xl': ['7rem', {
    letterSpacing: '-0.416rem',
    lineHeight: '6.65rem',
    fontWeight: '400',
  }],
}

const typo = fontSize;
for (const key in fontSize) {
  for (const name in fontWeight) {
    typo[`${key}-${name}`] = [fontSize[key]![0], { ...fontSize[key]![1]!, fontWeight: fontWeight[name] }]
  }
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: typo as never,
    fontWeight,
    colors: {
      transparent: 'transparent',
      dark: 'black',
      light: 'white',
      black: 'black',
      white: 'white',
      container: {
        light: '#F6F5F3',
      },
      neutral: {
        50: '#FFFFFF',
        300: '#EBE7E0',
        500: '#D6D2CB',
        600: '#AAA8A2',
        800: '#373431',
        900: '#1F1F1E',
      }
    },
    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
      accent: ['var(--font-accent)'],
    },
    borderRadius: {
      'none': '0',
      'xs': '4px',
      'sm': '8px',
      'md': '12px',
      'full': '9999px',
    },
    outlineWidth: {
      DEFAULT: '1px',
      0: '0',
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px'
    },
    screens: {
      'xs': '425px',
      ...defaultTheme.screens,
    },
    extend: {
      maxWidth: {
        '2xs': '14rem',
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
        '11xl': '112rem',
      },
      screens: {
        '3xl': '1720px',
        '4xl': '1920px',
      },
      aspectRatio: {
        '3/4': '3 / 4',
        'product': '6 / 9',
        '9/16': '9 / 16',
      },
      height: { screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'] as unknown as string, },
      lineHeight: { 0: '0rem' },
      zIndex: { max: '999' },
      spacing: {
        86: '21.5rem',
        104: '26rem',
        112: '28rem',
        128: '32rem',
        144: '36rem',
        168: '42rem',
        '11/12': '91.6666666666%',
        '1px': '1px'
      },
    }
  },
  plugins: [
    formsPlugin,
    typographyPlugin,
    plugin(({ addComponents, addBase }) => {
      addBase({
        // center
        '.flex-row-center': {
          'display': 'flex',
          'flex-direction': 'row',
          'align-items': 'center',
          'justify-content': 'center'
        },
        '.flex-col-center': {
          'display': 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content': 'center'
        },
        // between
        '.flex-row-between': {
          'display': 'flex',
          'flex-direction': 'row',
          'align-items': 'center',
          'justify-content': 'space-between'
        }
      })
      addComponents({
        '.inset-x-center': {
          '@apply inset-x-1/2': {},
          '@apply -translate-x-1/2': {}
        },
        '.inset-y-center': {
          '@apply inset-y-1/2': {},
          '@apply -translate-y-1/2': {}
        },
        '.inset-center': {
          '@apply inset-x-1/2': {},
          '@apply inset-y-1/2': {},
          '@apply -translate-y-1/2': {},
          '@apply -translate-x-1/2': {}
        },
        '.child-shrink-0>*': {
          '@apply flex-shrink-0': {}
        },
      })
    })
  ],
};
