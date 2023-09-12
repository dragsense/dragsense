import { Form, Modal, Button, Input, Checkbox, message } from "antd";
import { useState, useEffect } from "react";

import { isEmpty } from "@/lib/utils";

export default function AddUser({ onSubmit, role = {} }) {
  const [form] = Form.useForm();
  const [userModal, setUserModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (!role) {
      return;
    }

    form.setFieldsValue(role);
    setUserModalOpen(true);
    setSelectedPermissions(role.permissions || []);
  }, [role]);

  const onCancel = () => setUserModalOpen(false);

  const handlePermissionsChange = (checkedPermissions) => {
    setSelectedPermissions(checkedPermissions);
  };

  const handleAllCheckboxChange = (e) => {
    const allChecked = e.target.checked;
    const allPermissions = ["all", "pages", "collections", "forms"];
  
    if (allChecked) {
      form.setFieldsValue({ permissions: allPermissions });
      setSelectedPermissions(allPermissions);
    } else {
      form.setFieldsValue({ permissions: [] });
      setSelectedPermissions([]);
    }
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (await onSubmit(values)) {
          form.resetFields();
          setUserModalOpen(false);
        } else {
          setUserModalOpen(true);
        }
      })
      .catch((info) => {
        setUserModalOpen(true);
        message.error("Validate Failed.");
      });
  };

  return (
    <Modal
      visible={userModal}
      title={`${role?.id === -1 ? "Add a new" : "Edit"} user`}
      okText="Save"
      onCancel={onCancel}
      footer={
        <div style={{ padding: 5 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{}}
      >
        <Form.Item
          name="email"
          label="Email"
          className="font-500"
          rules={[
            {
              required: true,
              message: "Please enter a valid email!",
              type: "email",
            },
          ]}
        >
          <Input maxLength={500} type="email" disabled={role?.id !== -1} />
        </Form.Item>
        <Form.Item
          name="roleName"
          label="Role Name"
          className="font-500"
          rules={[
            {
              required: true,
              message: "Please enter a role name (alphanumeric).",
              pattern: /^[a-zA-Z0-9]+$/,
            },
          ]}
        >
          <Input maxLength={100} type="text" />
        </Form.Item>
        <Form.Item
          name="permissions"
          className="font-500"
          valuePropName="value"
          value={selectedPermissions}
          rules={[
            {
              required: true,
              message: "Please select permissions!",
              type: "array",
            },
          ]}
        >
          <Checkbox.Group disabled={true} onChange={handlePermissionsChange} valuePropName="value">
            <Checkbox value="all" onChange={handleAllCheckboxChange}>
              All
            </Checkbox>
            {/* <Checkbox value="pages">Pages</Checkbox>
            <Checkbox value="collections">Collections</Checkbox>
            <Checkbox value="forms">Forms</Checkbox> */}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}