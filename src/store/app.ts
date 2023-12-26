// Utilities
import { defineStore } from 'pinia'
import { RouteParams, RouteRecordName, useRouter } from 'vue-router';
// import { useAxios } from '@/plugins/http';
import { getCurrentUser } from '../admin/repository/account/user';
import { getCurrentDriver } from '../admin/repository/account/driver';
import User from '@/model/account/user';
import { computed, ref } from 'vue';
import useSWRV from 'swrv';
import Driver from '@/model/account/driver';
import http from '../plugins/axios';
import { BASE_URL } from '@/common/constants';


export class UnAuthenticatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnAuthenticatedError';
  }
}


export const useConfigStore = defineStore('config', {
  state: () => ({
    // baseUrl: 'http://localhost:8000',
    baseUrl:  BASE_URL,
  }),

  getters: {
    url: ({ baseUrl: serverURL }) => (url: string) => {
      try {
        //RETURN URL-as-is if its a fully valid URL
        new URL(url);
        return url;
      }
      catch (error) {
      }

      const baseUrl = (serverURL ?? '').replace(/(\/)+$/, '');
      const segment = String(url).replace(/^(\/)+/, '');
      
      return baseUrl + '/' + segment;
    },
  },

  actions: {

  }
})

export const useAppStore = defineStore('app', {
  state: () => ({
    //

  }),
})


// import { defineStore } from 'pinia'


interface TargetRouteInfo {
  name: RouteRecordName;
  params?: RouteParams;
}

const token = localStorage.getItem('token');


export const useAccountStore = defineStore('account', () => {

  http.interceptors.request.use(function (config) {
    // console.log("ICOMMING REQUEST: ", config);
    const headers = config.headers;
    if (authToken.value) {
      if (!headers['Authorization']) {
        headers['Authorization'] = `Bearer ${authToken.value}`;
      }
    }
    // console.log("OUT GOING REQUEST: ", config);
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  let _fetchUserPromise: Promise<User> | undefined;;

  const targetRoute = ref<TargetRouteInfo>();
  const user = ref<User>();
  const driver = ref<Driver>();
  const auth = ref({ token });
  const isFetchingUser = ref(false);

  const authToken = computed(() => auth.value?.token)
  const isAuthenticated = computed(() => !!auth.value.token)
  const hasTargetPath = computed(() => targetRoute.value);



  if (authToken.value)
    fetchUser();

  function setTargetRoute(routeInfo: TargetRouteInfo) {
    targetRoute.value = routeInfo;
  }

  function clearTargetRoute() {
    targetRoute.value = undefined;
  }

  async function fetchUser() {
    try {
      if(!_fetchUserPromise){
        _fetchUserPromise = getCurrentUser();
      }
      isFetchingUser.value = true;
      return user.value = await _fetchUserPromise;
    }
    catch (err) {
      // throw err;
    }
    finally{
      isFetchingUser.value = false;
      _fetchUserPromise = undefined;
    }
  }

  async function getOrFetchUser(){
    if(user.value){
      return user.value;
    }
    return fetchUser();
  }


  async function fetchDriver() {
    try {
      return driver.value = await getCurrentDriver();
    }
    catch (err) {
      throw err;
    }
  }
  async function login({ username, password }: { username: string, password: string }) {
    const { data: { token } } = await http.post('/api/login_check', { username, password });
    loginInWithToken(token);
    const user = await fetchUser();
  }

  function loginInWithToken(token: string) {
    localStorage.setItem('token', token);
    auth.value.token = token;
  }

  function logout() {
    localStorage.removeItem('token');
    auth.value.token = null;
    user.value = undefined;
    driver.value = undefined;
  }


  function isGranted(roles: string | string[], { includeAll }: { includeAll?: boolean } = {}) {
    if (!roles)
      return true;
    if (!Array.isArray(roles))
      roles = [roles];
    if (!roles.length)
      return true;
    let userRoles = user.value?.roles ?? [];
    if(!Array.isArray(userRoles)){
      userRoles = Object.values(userRoles);
    }
    console.log("USER ROLES: ", {userRoles});
    if (includeAll)
      return roles.every(r => userRoles.includes(r));
    return roles.some(r => userRoles.includes(r));
  }


  return {
    auth,
    user,
    authToken,
    isAuthenticated,
    //
    driver,
    fetchDriver,
    //
    hasTargetPath,
    targetRoute,
    //
    login,
    loginInWithToken,
    logout,
    fetchUser,
    getOrFetchUser,
    //
    setTargetRoute,
    clearTargetRoute,
    //
    isGranted,
    isFetchingUser,
  }

});



export function useUser() {
  const { getOrFetchUser, } = useAccountStore();
  const { data: user, error, isValidating: loading } = useSWRV(
    () => `/api/current_user`,
    async () => getOrFetchUser());

  return { user, loading, error };
  // return computed(() => store.user);
}



export function useDriver() {
  const { fetchDriver } = useAccountStore();
  const { data: driver, error, isValidating: loading } = useSWRV(() => `/api/current_driver`, () => fetchDriver());

  return { driver, loading, error };
  // return computed(() => store.user);
}