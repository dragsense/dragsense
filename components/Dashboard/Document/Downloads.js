import { Form, Modal, Input, DatePicker, Button, Select, message, Row, Col } from "antd";
import { useState, useEffect } from "react";
import DocumentServices from "../../../lib/services/documents";

export default function DocumentDocuments({ downlaodCollection, form = false }) {
  const [downloadsModal, setDownloadsModal] = useState(false);
  const [collection, setCollection] = useState(null);
  const [formInstance] = Form.useForm();

  useEffect(() => {
    if (!downlaodCollection) return;

    setDownloadsModal(true);
    setCollection(downlaodCollection);
  }, [downlaodCollection]);

  const onCancel = () => setDownloadsModal(false);

  const onFinish = async (values) => {
    if (!collection) {
      message.error("Collection Not Found. Please try again.");
      return;
    }

    const { name, startDate, endDate, limit, sortField, sortOrder, status } = values;
    const sortBy = sortField ? `${sortField}:${sortOrder || 'asc'}` : 'createdAt:asc';

    try {
      const downloadUrlParams = new URLSearchParams({
        form: form,
        name: name || "",
        status: status || "",
        startDate: startDate ? startDate.format("YYYY-MM-DD") : "",
        endDate: endDate ? endDate.format("YYYY-MM-DD") : "",
        limit: limit || 100,
        page: 1,
        sortBy,
      }).toString();

      await DocumentServices.download(collection._id, collection.name, downloadUrlParams);

      message.success("Your download will begin shortly.");
      setDownloadsModal(false);
      formInstance.resetFields();
    } catch (error) {
      message.error("Error initiating download. Please try again.");
    }
  };

  return (
    <Modal
      open={downloadsModal}
      title={"Download Documents"}
      cancelText="Back"
      width="50%"
      onCancel={onCancel}
      footer={null}
    >
      {collection && (
        <Form
          form={formInstance}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ limit: 100, status: "", sortField: "createdAt", sortOrder: 'asc' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name Like"
                name="name"
                rules={[{ min: 2, message: "Name must be at least 2 characters long" }]}
              >
                <Input maxLength={1000} placeholder="Enter part of a name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Limit" name="limit">
                <Input type="number" min={1} max={1000} placeholder="Limit results (default 100)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Start Date" name="startDate">
                <DatePicker placeholder="Select Start Date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="End Date" name="endDate">
                <DatePicker placeholder="Select End Date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Status" name="status">
                <Select placeholder="Select Status">
                  <Select.Option value="">ALL</Select.Option>
                  <Select.Option value="DRAFT">DRAFT</Select.Option>
                  <Select.Option value="PUBLIC">PUBLIC</Select.Option>
                  <Select.Option value="PRIVATE">PRIVATE</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Sort Field" name="sortField">
                <Select placeholder="Select Sorting">
                  <Select.Option value="_id">ID</Select.Option>
                  <Select.Option value="createdAt">Created At</Select.Option>
                  <Select.Option value="name">Name</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Sort Order" name="sortOrder">
                <Select placeholder="Select Sort Order">
                  <Select.Option value="asc">Ascending</Select.Option>
                  <Select.Option value="desc">Descending</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Download CSV
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
