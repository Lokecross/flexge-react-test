import api from 'services/api';

interface IUser {
  name: string;
  age: string;
  gender: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const getUsers = async () => {
  const { data: users } = await api.get('/users');

  return users;
};

const getUsersByName = async (name: string) => {
  const { data: users } = await api.get(`/users?name_like=${name}`);

  return users;
};

const createUser = async (userData: IUser) => {
  await api.post('/users', userData);
};

const editUser = async (id: string, userData: IUser) => {
  await api.put(`/users/${id}`, userData);
};

const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};

export { getUsers, getUsersByName, createUser, editUser, deleteUser };
