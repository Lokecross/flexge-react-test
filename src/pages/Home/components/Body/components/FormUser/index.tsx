import { useState } from 'react';

import { Form, Input, Button, InputNumber, Select, notification } from 'antd';

import { useMutation, useQueryClient } from 'react-query';

import { createUser } from 'queries/users';

const { Option } = Select;

type FormUserProps = {
  onSuccess?: () => void;
} & typeof defaultProps;

const defaultProps = {
  onSuccess: () => {},
};

const FormUser = ({ onSuccess }: FormUserProps) => {
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  const mutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setLoading(false);
      notification.success({
        message: 'User added successfully',
      });
      form.resetFields();
      onSuccess();
    },
    onError: () => {
      setLoading(false);
      notification.error({
        message: 'An error has occurred',
      });
    },
  });

  const onFinish = (values: any) => {
    setLoading(true);
    mutation.mutate({
      name: values.name,
      age: values.age,
      gender: values.gender,
      username: values.username,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="user"
      form={form}
      layout="vertical"
      initialValues={{
        name: '',
        age: '',
        gender: 'Male',
        username: '',
        password: '',
        confirmPassword: '',
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Required field' }]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      <Form.Item
        label="Age"
        name="age"
        rules={[
          { required: true, message: 'Required field' },
          () => ({
            validator(_, value) {
              if (Number(value) < 18) {
                return Promise.reject(new Error('Minimum age is 18 yo'));
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
        <Select placeholder="Gender">
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Required field' }]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Required field' }]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        rules={[
          { required: true, message: 'Required field' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (getFieldValue('password') !== value) {
                return Promise.reject(new Error('Passwords not match'));
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>

      <div style={{ height: 16 }} />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create User
        </Button>
      </Form.Item>
    </Form>
  );
};

FormUser.defaultProps = defaultProps;

export default FormUser;
