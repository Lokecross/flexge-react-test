import { useState } from 'react';

import {
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  notification,
} from 'antd';

import { useMutation, useQueryClient } from 'react-query';

import { createUser } from 'queries/users';

const { Option } = Select;

const AddButton = () => {
  const queryClient = useQueryClient();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const mutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setLoading(false);
      notification.success({
        message: 'User added successfully',
      });
      setVisible(false);
    },
    onError: () => {
      notification.error({
        message: 'An error has occurred',
      });
    },
  });

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

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
    <>
      <Button type="primary" onClick={showModal}>
        Add User
      </Button>
      <Modal
        title="Title"
        visible={visible}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Input />
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
              <Option value="M">M</Option>
              <Option value="F">F</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Input.Password />
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
            <Input.Password />
          </Form.Item>

          <div style={{ height: 16 }} />
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddButton;
