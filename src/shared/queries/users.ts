import api from 'services/api';

const getUsers = async () => {
  const { data: users } = await api.get('/users');

  return users;
};

const getUsersByName = async (name: string) => {
  const { data: users } = await api.get(`/users?name_like=${name}`);

  return users;
};

type CreateUserProps = {
  name: string;
  age: string;
  gender: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const createUser = async (newUser: CreateUserProps) => {
  await api.post('/users', newUser);
};

type EditUserProps = {
  name: string;
  age: string;
  gender: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const editUser = async (userData: EditUserProps) => {
  await api.put('/users', userData);
};

const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
};

export { getUsers, getUsersByName, createUser, editUser, deleteUser };
