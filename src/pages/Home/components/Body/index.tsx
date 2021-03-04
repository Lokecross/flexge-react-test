import { useState } from 'react';

import { Button, Table, Tooltip, TableColumnProps } from 'antd';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { red } from '@ant-design/colors';

import { FaTrash } from 'react-icons/fa';

import { deleteUser, getUsers } from 'queries/users';

import { Container } from './styles';

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
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutation(deleteUser, {
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries('users');
    },
  });

  const columns: TableColumnProps<IQuery>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Confirm Password',
      dataIndex: 'confirmPassword',
      key: 'confirmPassword',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Tooltip title="Delete">
          <Button
            danger
            type="dashed"
            shape="circle"
            icon={<FaTrash color={red.primary} size={14} />}
            onClick={() => {
              setLoading(true);
              mutation.mutate(record.id);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const { isLoading, error, data } = useQuery<IQuery[], any>('users', getUsers);

  if (isLoading) {
    return <div />;
  }

  if (error) {
    return <div />;
  }

  return (
    <Container>
      <Table bordered dataSource={data} columns={columns} loading={loading} />
    </Container>
  );
};

export default Body;
