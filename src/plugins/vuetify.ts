/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components' //option
import * as directives from 'vuetify/directives' //option
import DateFnsAdapter from '@date-io/date-fns'
import enUS from 'date-fns/locale/en-US'
import svSE from 'date-fns/locale/sv'

// Composables
import { createVuetify, useTheme } from 'vuetify';



const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    // defaultTheme: 'dark',
    defaultTheme: prefersDark ? 'dark' : 'light',
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
          'secondary-bg': '#E3F2FD',
        },
      },
    },
  },
  // DATE
  date: {
    adapter: DateFnsAdapter,
    locale: {
      en: enUS,
      sv: svSE,
    },
  },
});

export default vuetify;



const updateTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  vuetify.theme.global.name.value = prefersDark ? 'dark' : 'light';
}
// Call the function initially
updateTheme();
// Add a listener to the media query change event
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
