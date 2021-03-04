import { useQuery } from 'react-query';

import { getUsers } from 'queries/users';

import { Container } from './styles';
import TableUsers from './components/TableUsers';

interface IQuery {
  id: number;
  name: string;
  age: string;
  gender: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const Body = () => {
  const { isLoading, error, data } = useQuery<IQuery[], any>('users', getUsers);

  if (isLoading) {
    return <div />;
  }

  if (error) {
    return <div />;
  }

  return (
    <Container>
      <TableUsers originData={data as IQuery[]} />
    </Container>
  );
};

export default Body;
