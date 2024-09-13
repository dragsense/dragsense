import React from 'react';
import { Modal, Card, Button, Space, Avatar, Typography, List, Badge, Tooltip, theme } from "antd";
import { ExclamationCircleFilled, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { LikeOutlined, StarOutlined } from '@ant-design/icons';
const { Meta } = Card;

const { confirm } = Modal;

const { Text } = Typography;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const ThemeList = ({ total, setPage, themes, onDelete, onInstall, onDownload, activeTheme }) => {

  const {
    token: { colorError },
  } = theme.useToken();



  return <List
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: (page) => {
        setPage(page)
      },
      total: total,
      pageSize: 3,
    }}
    dataSource={themes}

    renderItem={(theme) => {
      const isActive = activeTheme == theme._id;
      return <Badge.Ribbon key={theme._id} text={isActive ? 'Active' : ''} color={isActive ? 'green' : 'default'}>
        <List.Item
       
          actions={[
            <Button onClick={(e) => {
              e.preventDefault();

              confirm({
                title: 'Are you sure to install this theme?',
                icon: <ExclamationCircleFilled />,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                  onInstall(theme._id);
                },
                onCancel() {

                },
              });


            }}
            >
              {isActive ? 'Installed' : 'Install'}
            </Button>,
            <Tooltip title="Download Theme"> <DownloadOutlined key="download" style={{ fontSize: 20 }} size="2em"

              onClick={(e) => {
                e.preventDefault();

                onDownload(theme._id, theme.name);


              }}
            />
            </Tooltip>,
            <Tooltip title="Delete Theme"> <DeleteOutlined key="delete" style={{ fontSize: 20, color: colorError }} size="2em"

              onClick={(e) => {
                e.preventDefault();

                confirm({
                  title: 'Are you sure delete this theme?',
                  icon: <ExclamationCircleFilled />,
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk() {
                    onDelete(theme._id);
                  },
                  onCancel() {

                  },
                });

              }} /></Tooltip>

          ]}
          extra={
            <img
              width={272}
              alt="logo"
              src={theme.preview || '/images/default/theme.png'}
            />
          }
        >
          <List.Item.Meta
            title={theme.name}
            description={<div >

              <span style={{ paddingRight: 10 }}>Author: </span>

              <b> <Avatar src={<img src={theme.creator.image} alt="avatar" />} /> <em>{theme.creator.name}</em> </b>

            </div>}
          />


          <p>{theme.desc}</p>

          <Text type="secondary">
            Date:   <b> <em>{`${new Date(theme.createdAt).toDateString()}`}</em> </b>
          </Text>

        </List.Item>
      </Badge.Ribbon>
    }}
  />



};

export default ThemeList;
