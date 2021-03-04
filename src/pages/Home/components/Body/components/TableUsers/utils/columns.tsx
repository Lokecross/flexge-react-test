import { Button, Popconfirm } from 'antd';

import { red, blue } from '@ant-design/colors';

import { FaTrash, FaCheck, FaTimes, FaPencilAlt } from 'react-icons/fa';

interface IQuery {
  id: number;
  name: string;
  age: string;
  gender: string;
  username: string;
  password: string;
  confirmPassword: string;
}

type ColumnProps = {
  save(key: number): void;
  cancel(): void;
  edit(record: IQuery): void;
  callDelete(record: IQuery): void;
  isEditing(record: IQuery): boolean;
  editingKey: number | null;
};

const columns = ({
  save,
  cancel,
  edit,
  isEditing,
  callDelete,
  editingKey,
}: ColumnProps) => {
  return [
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
      render: () => {
        return '******';
      },
    },
    {
      title: 'Confirm Password',
      dataIndex: 'confirmPassword',
      key: 'confirmPassword',
      editable: true,
      render: () => {
        return '******';
      },
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
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => {
                  callDelete(record);
                }}
              >
                <Button
                  danger
                  type="dashed"
                  shape="circle"
                  icon={<FaTrash color={red[4]} size={14} />}
                />
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];
};

export const mergedColumns = ({
  save,
  cancel,
  edit,
  isEditing,
  callDelete,
  editingKey,
}: ColumnProps) => {
  return columns({ save, cancel, edit, isEditing, callDelete, editingKey }).map(
    col => {
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
    },
  );
};
