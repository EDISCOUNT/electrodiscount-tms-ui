import http from "@/admin/plugins/axios";
import Pagination from "@/data/pagination/pagination";
import User from "@/model/account/user";

interface GetUserParams {
  page?: number;
  limit?: String;
  filter?: String;
  sort?: String;
}

interface CreateUserParams {
  input: { [i: string]: any };
}

interface UtilityProps {
  // apollo?: ApolloClient<NormalizedCacheObject>;
}


export async function getUserConnection({ page, limit, filter, sort }: GetUserParams = {}, { }: UtilityProps = {}) {

  const { data } = await http.get(`/api/admin/account/users?page=${page ?? 10}&limit=${limit ?? ''}&filter=${filter ?? ''}&sort=${sort ?? ''}`);
  const connection = Pagination.fromJson<User>({
    ...data,
    buildItem: (a) => User.fromJson(a),
  });
  return connection;
}


export async function getUserItem({ id }: { id: string }, { }: UtilityProps = {}) {
  const { data } = await http.get(`/api/admin/account/users/${id}`);
  const user = User.fromJson(data);
  return user;
}


export interface UserUpdateInput {
  pageName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: File;
}

interface UpdateUserParams {
  user: User;
  input: UserUpdateInput
}


export async function updateUser({ user, input }: UpdateUserParams, { }: UtilityProps = {}) {
  const formData = new FormData();
  formData.append('pageName', input.pageName ?? '');
  formData.append('lastName', input.lastName ?? '');
  formData.append('email', input.email ?? '');
  formData.append('phone', input.phone ?? '');
  formData.append('avatar', input.avatar ?? '');
  const { data } = await http.patch(`/api/admin/account/users/${user.id}`, formData);
  return User.fromJson(data);
}

export async function getCurrentUser({ }: UtilityProps = {}) {
  const { data } = await http.get(`/api/me`);
  const user = User.fromJson(data);
  return user;
}

