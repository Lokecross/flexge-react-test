import { useState } from 'react';

import {
  Button,
  Table,
  Form,
  InputNumber,
  Input,
  notification,
  Select,
} from 'antd';

import { useMutation, useQueryClient } from 'react-query';

import { red, blue } from '@ant-design/colors';

import { FaTrash, FaCheck, FaTimes, FaPencilAlt } from 'react-icons/fa';

import { deleteUser, editUser, getUsersByName } from 'queries/users';

import AddButton from './components/AddButton';

const { Option } = Select;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'select' | 'text';
  children: React.ReactNode;
}

const EditableCell = ({
  editing,
  dataIndex,
  inputType,
  children,
  ...restProps
}: EditableCellProps) => {
  const inputNode = (() => {
    if (inputType === 'number') {
      return <InputNumber />;
    }

    if (inputType === 'select') {
      return (
        <Select placeholder="Gender">
          <Option value="M">M</Option>
          <Option value="F">F</Option>
        </Select>
      );
    }

    return <Input />;
  })();

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Required field`,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const errorMessage = () => {
                  if (dataIndex === 'confirmPassword') {
                    if (getFieldValue('password') !== value) {
                      return Promise.reject(new Error('Passwords not match'));
                    }

                    return Promise.resolve();
                  }

                  if (dataIndex === 'age') {
                    if (Number(value) < 18) {
                      return Promise.reject(new Error('Minimum age is 18 yo'));
                    }

                    return Promise.resolve();
                  }

                  return Promise.resolve();
                };

                return errorMessage();
              },
            }),
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

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
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [dataFiltered, setDataFiltered] = useState<IQuery[] | null>(null);

  const queryClient = useQueryClient();

  const mutationDelete = useMutation(deleteUser, {
    onSuccess: () => {
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

  const [form] = Form.useForm();

  const isEditing = (record: IQuery) => record.id === editingKey;

  const edit = (record: IQuery) => {
    form.setFieldsValue(record);
    setEditingKey(record.id);
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      editable: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      editable: true,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      editable: true,
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      editable: true,
    },
    {
      title: 'Confirm Password',
      dataIndex: 'confirmPassword',
      key: 'confirmPassword',
      editable: true,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      editable: false,
      render: (_: any, record: IQuery) => {
        const editable = isEditing(record);

        return editable ? (
          <div style={{ display: 'flex' }}>
            <Button
              type="dashed"
              shape="circle"
              icon={<FaCheck color={blue[2]} size={14} />}
              onClick={() => {
                save(record.id);
              }}
            />

            <div style={{ width: 5 }} />

            <Button
              type="dashed"
              shape="circle"
              icon={<FaTimes color="#d9d9d9" size={14} />}
              onClick={cancel}
            />
          </div>
        ) : (
          <div style={{ display: 'flex' }}>
            <Button
              type="dashed"
              shape="circle"
              icon={<FaPencilAlt color="#d9d9d9" size={14} />}
              onClick={() => {
                edit(record);
              }}
            />

            <div style={{ width: 5 }} />
            {!editingKey && (
              <Button
                danger
                type="dashed"
                shape="circle"
                icon={<FaTrash color={red[4]} size={14} />}
                onClick={() => {
                  setLoading(true);
                  mutationDelete.mutate(record.id);
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IQuery) => ({
        record,
        inputType: (() => {
          if (col.dataIndex === 'age') return 'number';
          if (col.dataIndex === 'gender') return 'select';

          return 'text';
        })(),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <AddButton />
        <div style={{ width: 10 }} />
        <Input
          placeholder="Search by name"
          value={search}
          onChange={e => {
            setSearch(e.target.value);

            if (e.target.value) {
              setLoading(true);
              mutationSearch.mutate(e.target.value);
            } else {
              setDataFiltered(null);
            }
          }}
          style={{ width: 300 }}
        />
      </div>

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
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          loading={loading || loadingQuery}
        />
      </Form>
    </div>
  );
};

TableUsers.defaultProps = defaultProps;

export default TableUsers;
