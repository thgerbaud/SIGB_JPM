import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import lightTheme from './lightTheme';

export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: 'lightTheme',
        themes: {
            lightTheme,
        },
    },
    aliases: {
        VBtnSecondary: components.VBtn,
        VBtnTertiary: components.VBtn,
        VBtnCancel: components.VBtn,
    },
    defaults: {
        VBtn: {
            color: 'secondary',
            variant: 'flat',
            letterSpacing: '5px',
        },
        VBtnSecondary: {
            color: 'secondary',
            variant: 'outlined',
        },
        VBtnTertiary: {
            color: 'secondary',
            rounded: false,
            variant: 'text',
        },
        VBtnCancel: {
            color: 'error',
            variant: 'outlined',
        },
    },
});