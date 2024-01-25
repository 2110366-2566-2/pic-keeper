import { NewUser } from "@/types";

const create = async (newUser: NewUser) => {
  //   const { data } = await axios.post<User>(
  //     `${apiBaseUrl}/auth/register`,
  //     newUser
  //   );
  return { name: "Test" };
};

const me = async (token: string) => {
  //   const config = {
  //     headers: { Authorization: `Bearer ${token}` },
  //   };
  //   const { data } = await axios.get<User>(`${apiBaseUrl}/auth/me`, config);
  //   return data;
};

const userService = {
  create,
  me,
};

export default userService;
