import http from "@/plugins/axios";
import Pagination from "@/data/pagination/pagination";
import Driver from "@/model/account/driver";
import DriverLicense from "@/model/account/driver_license";
import useSWRV from "swrv";
import { ref } from "vue";

interface GetDriverParams {
  first?: number;
  after?: String;
  filter?: String;
  sort?: String;
}

interface CreateDriverParams {
  input: { [i: string]: any };
}
interface UpdateDriverProfileParams {
  // id: string,
  input: { [i: string]: any };
}

interface UtilityProps {
  // apollo?: ApolloClient<NormalizedCacheObject>;
}


export async function getDriverPagination({ first, after, filter, sort }: GetDriverParams = {}, { }: UtilityProps = {}) {
  const { data } = await http.get(`/api/admin/account/drivers?page=${first ?? 10}&limit=${after ?? ''}&filter=${filter ?? ''}&sort=${sort ?? ''}`);
  const connection = Pagination.fromJson<Driver>({
    ...data,
    buildItem: (a) => Driver.fromJson(a),
  });
  return connection;
}


export async function getDriverItem({ id }: { id: string }, { }: UtilityProps = {}) {
  const { data } = await http.get(`/api/admin/account/drivers/${id}`);
  const driver = Driver.fromJson(data);
  return driver;
}

export async function getCurrentDriver({ }: UtilityProps = {}) {
  const { data } = await http.get(`/api/driver`);
  const driver = Driver.fromJson(data);
  return driver;
}

export async function gettDriverLicense({ driver }: { driver?: Driver }, { }: UtilityProps = {}) {
  const { data } = await http.get(`/api/driver/${driver?.id ?? 'current'}/license`);
  const license = DriverLicense.fromJson(data);
  return license;
}




export async function getDriverSubscription() {
  const { data } = await http.get(`/api/driver/subscriptions/current`);
  return data.data;
}


export function useDriverSubscription() {
  const { data: subscription, isValidating: loading, error, mutate: refresh } = useSWRV(
    () => `/api/driver/subscriptions/current`,
    () => getDriverSubscription(),
    { ttl: 0, refreshInterval: 0 }
  );
  // if (result) {
  //   const { data: subscription, isValidating: loading, error, mutate: refresh } = result;
  //   return { subscription, loading, error, refresh };
  // }
  // const subscription = ref<any>();
  // const error = ref<string>();
  // const loading = ref(true);
  // const refresh = () => new Promise((resolve, reject) => reject("State Error: swrv Issue;"))
  return { subscription, error, loading, refresh }
}



export async function updateDriverProfile({ input }: UpdateDriverProfileParams, { }: UtilityProps = {}) {
  const { data } = await http.patch(`/api/driver`, input);
  const driver = Driver.fromJson(data);
  return driver;
}
