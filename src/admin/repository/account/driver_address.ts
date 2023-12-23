import http from "@/admin/plugins/axios";
import Connection from "@/data/pagination";
import DriverAddress from "@/model/account/driver_address";
import useSWRV from "swrv";

interface GetDriverAddressParams {
  first?: number;
  after?: String;
  filter?: String;
  sort?: String;
}

interface UpdateDriverAddressParams {
  input: { [i: string]: any };
}

interface UtilityProps {
  // apollo?: ApolloClient<NormalizedCacheObject>;
}





export async function updateAddress({ input }: UpdateDriverAddressParams, { }: UtilityProps = {}) {
  const { data } = await http.patch(`/api/driver/address`, input);
  const address = DriverAddress.fromJson(data);
  return address;
}


export async function getDriverAddressItem({ id }: { id: string }, { }: UtilityProps = {}) {
  const { data } = await http.get(`/api/driver/address/${id}`);
  const address = DriverAddress.fromJson(data);
  return address;
}

export async function getCurrentDriverAddress({ }: UtilityProps = {}) {
  const { data } = await http.get(`/api/driver/address`);
  if (!data)
    return undefined;
  const address = DriverAddress.fromJson(data);
  return address;
}



export function useDriverAddress() {
  const { data: address, isValidating: loading, error } = useSWRV(`/api/current_driver/address`, () => getCurrentDriverAddress());
  return { address, loading, error };
}

