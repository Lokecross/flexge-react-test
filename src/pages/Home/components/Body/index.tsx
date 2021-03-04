import { useQuery } from 'react-query';

import { getUsers } from 'queries/users';

import { notification } from 'antd';
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
  const { isLoading, error, data } = useQuery<IQuery[], any>(
    'users',
    getUsers,
    {
      onError: () => {
        notification.error({
          message: 'An error has occurred',
        });
      },
      retry: false,
    },
  );

  if (isLoading) {
    return (
      <Container>
        <TableUsers originData={[]} loadingQuery />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <TableUsers originData={[]} />
      </Container>
    );
  }

  return (
    <Container>
      <TableUsers originData={data as IQuery[]} />
    </Container>
  );
};

export default Body;
