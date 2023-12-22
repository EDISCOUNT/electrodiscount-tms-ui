/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import vuetifyNotify, { config } from './vuetify-notify'
import pinia from '../store'
import router from '../router'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
  loadFonts()
  app
    .use(vuetify)
    .use(vuetifyNotify, config)
    .use(router)
    .use(pinia)
}
