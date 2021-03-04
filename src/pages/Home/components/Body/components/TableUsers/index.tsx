import { useState } from 'react';

import { Button, Table, Tooltip, Form, InputNumber, Input } from 'antd';

import { useMutation, useQueryClient } from 'react-query';

import { red, orange, green, blue } from '@ant-design/colors';

import { FaTrash, FaCheck, FaTimes, FaPencilAlt } from 'react-icons/fa';

import { deleteUser, editUser } from 'queries/users';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  children: React.ReactNode;
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}: EditableCellProps) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
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

interface ITableUsersProps {
  originData: IQuery[];
}

const TableUsers = ({ originData }: ITableUsersProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutationDelete = useMutation(deleteUser, {
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries('users');
    },
  });

  const mutationEdit = useMutation(editUser, {
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries('users');
    },
  });

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | null>(null);

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

      mutationEdit.mutate({
        id: key,
        userData: row,
      });

      setEditingKey(null);
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
            <Tooltip title="Save">
              <Button
                type="dashed"
                shape="circle"
                icon={<FaCheck color={blue[2]} size={14} />}
                onClick={() => {
                  save(record.id);
                }}
              />
            </Tooltip>
            <div style={{ width: 5 }} />
            <Tooltip title="Cencel">
              <Button
                type="dashed"
                shape="circle"
                icon={<FaTimes color="#d9d9d9" size={14} />}
                onClick={cancel}
              />
            </Tooltip>
          </div>
        ) : (
          <div style={{ display: 'flex' }}>
            <Tooltip title="Edit">
              <Button
                type="dashed"
                shape="circle"
                icon={<FaPencilAlt color="#d9d9d9" size={14} />}
                onClick={() => {
                  edit(record);
                }}
              />
            </Tooltip>
            <div style={{ width: 5 }} />
            <Tooltip title="Delete">
              <Button
                danger={!editingKey}
                type="dashed"
                shape="circle"
                icon={
                  <FaTrash color={editingKey ? red[2] : red[4]} size={14} />
                }
                onClick={() => {
                  setLoading(true);
                  mutationDelete.mutate(record.id);
                }}
              />
            </Tooltip>
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
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        bordered
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        dataSource={originData}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        loading={loading}
      />
    </Form>
  );
};

export default TableUsers;
