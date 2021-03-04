import { useState } from 'react';

import { Table, Form, Input, notification } from 'antd';

import { useMutation, useQueryClient } from 'react-query';

import { deleteUser, editUser, getUsersByName } from 'queries/users';

import { mergedColumns } from './utils/columns';

import EditableCell from './components/EditableCell';

import AddButton from '../AddButton';

import { Container, Header } from './styles';

const { Search } = Input;
interface IQuery {
  id: number;
  name: string;
  age: string;
  gender: string;
  username: string;
  password: string;
  confirmPassword: string;
}

type TableUsersProps = {
  originData: IQuery[];
  loadingQuery?: boolean;
} & typeof defaultProps;

const defaultProps = {
  loadingQuery: false,
};

const TableUsers = ({ originData, loadingQuery }: TableUsersProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [dataFiltered, setDataFiltered] = useState<IQuery[] | null>(null);

  const mutationSearch = useMutation(getUsersByName, {
    onSuccess: data => {
      setDataFiltered(data);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
      notification.error({
        message: 'An error has occurred',
      });
    },
  });

  const mutationDelete = useMutation(deleteUser, {
    onSuccess: () => {
      if (search && dataFiltered) {
        mutationSearch.mutate(search);
      }
      queryClient.invalidateQueries('users');
      setLoading(false);
      notification.success({
        message: 'User successfully deleted',
      });
    },
    onError: () => {
      setLoading(false);
      notification.error({
        message: 'An error has occurred',
      });
    },
  });

  const mutationEdit = useMutation(editUser, {
    onSuccess: () => {
      setEditingKey(null);
      if (search && dataFiltered) {
        mutationSearch.mutate(search);
      }
      queryClient.invalidateQueries('users');
      setLoading(false);
      notification.success({
        message: 'User successfully edited',
      });
    },
    onError: () => {
      setLoading(false);
      notification.error({
        message: 'An error has occurred',
      });
    },
  });

  const isEditing = (record: IQuery) => record.id === editingKey;

  const edit = (record: IQuery) => {
    form.setFieldsValue(record);
    setEditingKey(record.id);
  };

  const callDelete = (record: IQuery) => {
    setLoading(true);
    mutationDelete.mutate(record.id);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const save = async (key: number) => {
    try {
      const row = (await form.validateFields()) as IQuery;

      setLoading(true);

      mutationEdit.mutate({
        id: key,
        userData: row,
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  return (
    <Container>
      <Header>
        <AddButton />
        <div style={{ width: 10 }} />
        <Search
          disabled={loading}
          placeholder="Search by name"
          value={search}
          onChange={e => {
            setSearch(e.target.value);

            if (!e.target.value) {
              setDataFiltered(null);
            }
          }}
          allowClear
          enterButton="Search"
          onSearch={value => {
            if (value) {
              setLoading(true);
              mutationSearch.mutate(value);
            } else {
              setDataFiltered(null);
            }
          }}
          style={{ width: 300 }}
        />
      </Header>

      <div style={{ height: 16 }} />
      <Form form={form} component={false}>
        <Table
          bordered
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={dataFiltered || originData}
          columns={mergedColumns({
            save,
            cancel,
            edit,
            callDelete,
            isEditing,
            editingKey,
          })}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          loading={loading || loadingQuery}
          rowKey={item => item.id}
        />
      </Form>
    </Container>
  );
};

TableUsers.defaultProps = defaultProps;

export default TableUsers;
