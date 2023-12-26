import http from "@/plugins/axios";
import Pagination from "@/data/pagination/pagination";
import User, { UserFormData } from "@/model/account/user";
import { encodeURLParams } from "@/utils/url";

interface GetUserParams {
  page?: number;
  limit?: number;
  filter?: String;
  sort?: String;
}

interface CreateUserParams {
  input: { [i: string]: any };
}

interface UtilityProps {
  // apollo?: ApolloClient<NormalizedCacheObject>;
}


export async function getPaginatedUsers({ page, limit, filter, sort }: GetUserParams = {}, { }: UtilityProps = {}) {

  const params = encodeURLParams({page, limit, filter, sort});

  const { data } = await http.get(`/api/admin/account/users?${params}`);
  const connection = Pagination.fromJson<User>({
    ...data,
    buildItem: (a) => User.fromJson(a),
  });
  return connection;
}


export async function getUser({ id }: { id: string }, { }: UtilityProps = {}) {
  const { data } = await http.get(`/api/admin/account/users/${id}`);
  const user = User.fromJson(data);
  return user;
}


export interface UserUpdateInput extends UserFormData {
}

interface UpdateUserParams {
  user: User;
  input: UserUpdateInput
}


export async function updateUser({ user, input }: UpdateUserParams, { }: UtilityProps = {}) {
  const { data } = await http.patch(`/api/admin/account/users/${user.id}`, input);
  return User.fromJson(data);
}

export async function getCurrentUser({ }: UtilityProps = {}) {
  const { data } = await http.get(`/api/me`);
  const user = User.fromJson(data);
  return user;
}
