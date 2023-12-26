import http from "@/plugins/axios";
import Driver from "@/model/account/driver";
import DriverLicense from "@/model/account/driver_license";
import useSWRV, { IConfig } from "swrv";


interface UtilityProps {
  // apollo?: ApolloClient<NormalizedCacheObject>;
}

interface UpdateDriverLicenseParams {
  input: { [i: string]: any };
}



export async function updateLicense({ input }: UpdateDriverLicenseParams, {  }: UtilityProps = {}) {
 const { data} =await http.patch(`/api/driver/license`, input);
  const address = DriverLicense.fromJson(data);
  return address;
}

export async function getDriverLicense({ driver }: { driver?: Driver } = {}, {  }: UtilityProps = {}) {
 
  const { data } = await http.get(`/api/driver/${driver?.id ?? 'current'}/license`);
  if (!data)
    return undefined;
  const license = DriverLicense.fromJson(data);
  return license;
}



export function useDriverLicense({ driver, ...config}: IConfig & { driver?: Driver } = {}) {
  const { data: license, isValidating: loading, error } =
    useSWRV(
      () => `/api/driver/${driver?.id ?? 'current'}/license`,
      () => getDriverLicense({ driver }), config);

  return { license, loading, error };
}
