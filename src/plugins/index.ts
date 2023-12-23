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
import { useAccountStore, useUser } from '@/store/app'

export function registerPlugins(app: App) {
  loadFonts()
  app
    .use(vuetify)
    .use(vuetifyNotify, config)
    .use(router)
    .use(pinia)
}




router.beforeEach((to, from, next) => {

  const store = useAccountStore();
  const isAuthenticated = store.isAuthenticated;// Check if user is authenticated, e.g., by checking a token or user session
  // const {user} = useUser();

  const {user, isGranted} = store;
  if (to.matched.some(record => record.meta?.isProtected || ((record.meta?.roles as any)?.length ?? 0) > 0)) {
    const roles = (to.meta?.roles as any) ?? null;
    if (!isAuthenticated || (roles && !isGranted(roles))) {
      const { name, params } = to;
      if (name) {
        store.setTargetRoute({ name, params });
      }
      next({ name: 'auth:login' });
    } else {
      next();
    }
  } else {
    next();
  }
});
