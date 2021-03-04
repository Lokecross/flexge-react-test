import { Form, InputNumber, Input, Select } from 'antd';

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
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
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

export default EditableCell;
