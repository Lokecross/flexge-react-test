import { useState } from 'react';

import { Modal, Button } from 'antd';

import { UserAddOutlined } from '@ant-design/icons';

import FormUser from '../FormUser';

const AddButton = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<UserAddOutlined />}>
        Add User
      </Button>
      <Modal
        title="Add User Form"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <FormUser onSuccess={handleOk} />
      </Modal>
    </>
  );
};

export default AddButton;
