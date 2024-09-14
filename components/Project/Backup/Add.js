import { Form, Button, Modal, Input, Checkbox, message, Switch } from "antd";
import { useState, useEffect } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import MediaModal from "@/components/Dashboard/Media/MediaModal";

const { TextArea } = Input;

export default function AddBackup({ onSubmit, backup = {}, host = "" }) {
  const [form] = Form.useForm();
  const [backupModal, setBackupModalOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showField, setShowField] = useState(false);
  const [mediaModal, setMediaModal] = useState(false);
  const [update, setUpdate] = useState(false);

  const onChangePublicStatus = () => {
    setShowField(!showField);
  };

  useEffect(() => {
    if (!backup) {
      return;
    }

    form.setFieldsValue(backup);
    setPreview(backup.preview);
    setShowField(backup.published);

    if (backup._id === -1) setUpdate(true);
    else setUpdate(false);

    setBackupModalOpen(true);
  }, [backup]);

  const onCancel = () => setBackupModalOpen(false);

  const onChangeImage = (image) => {
    let imageSrc = "/images/default/default-img.png";
    if (image[0]) {
      imageSrc = host + image[0].src;
      setPreview(imageSrc);

    }

    form.setFieldsValue({ preview: imageSrc });
  };

  const imageSrc = preview
    ? preview
    : "/images/default/default-img.png";

  return (
    <>
      <Modal
        open={backupModal}
        title={`${backup?._id == -1 ? "Add a new" : "Edit"} backup`}
        okText="Save"
        closable
        footer={
          <div style={{ padding: 5 }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                form
                  .validateFields()
                  .then(async (values) => {
                    setBackupModalOpen(false);
                    if (await onSubmit(values)) {
                      form.resetFields();
                    } else setBackupModalOpen(true);
                  })
                  .catch((info) => {
                    setBackupModalOpen(true);

                    message.error("Validate Failed.");
                  });
              }}
            >
              Save
            </Button>
          </div>
        }
        onCancel={onCancel}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{}}
        >
          <Form.Item
            name="name"
            className="font-500"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter the backup name (alphanumeric).",
                pattern: /^[a-zA-Z0-9\s]+$/,
              },
            ]}
          >
            <Input maxLength={100} type="text" />
          </Form.Item>

          {backup?._id !== -1 && (
            <>
              <Form.Item name="update" valuePropName="checked">
                <Checkbox onChange={() => setUpdate(!update)}>
                  Update (Update this backup with current files)
                </Checkbox>
              </Form.Item>
            </>
          )}

          {update && (
            <>
              <Form.Item name="isCollectionsEntries" valuePropName="checked">
                <Checkbox>Include Collections Entries</Checkbox>
              </Form.Item>

              <Form.Item name="isFormsEntries" valuePropName="checked">
                <Checkbox>Include Forms Entries</Checkbox>
              </Form.Item>
            </>
          )}

          <Form.Item
            name="published"
            className="font-500"
            label="Public"
            valuePropName="checked"
            tooltip={{ title: "Public Theme", icon: <InfoCircleOutlined /> }}
          >
            <Switch
              onChange={onChangePublicStatus}
              checked={backup?.published}
            />
          </Form.Item>

          {showField && (
            <>
              {" "}
              <Form.Item
                name="desc"
                label="Description"
                className="font-500"
                tooltip={{
                  title: "Theme Description",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <TextArea maxLength={1000} placeholder="Description" rows={4} />
              </Form.Item>
              <Form.Item
                name="preview"
                className="font-500"
                label="Preview"
                tooltip={{
                  title: "Theme Preview",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input hidden />
                <Form.Item label="Cover Image">
                  <img
                    width="100%"
                    onClick={() => setMediaModal(true)}
                    preview={false}
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      height: "120px",
                      cursor: "pointer",
                    }}
                    alt={preview?.alt}
                    src={imageSrc}
                  />
                </Form.Item>{" "}
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      <MediaModal
        open={mediaModal}
        type="images"
        onClose={() => setMediaModal(false)}
        srcs={preview}
        onSelect={onChangeImage}
      />
    </>
  );
}
