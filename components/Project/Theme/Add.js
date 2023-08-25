import React, { useState, useEffect, useReducer } from 'react';
import { List, Modal, Typography, Badge, Space, Card, Avatar, Button, message } from 'antd';
import { LikeOutlined, StarOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { fetcher } from '@/lib/fetch';
import { isEmpty } from '@/lib/utils';

const { Text } = Typography;
const { confirm } = Modal;

const initial = {
  themes: [],
  total: 0,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'start':
      return { ...state, loading: true };
    case 'load':
      return { ...state, themes: action.data, total: action.total + 1 };
    case 'finish':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function AddTheme({ onAdd, loading, themes, theme = {} }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [page, setPage] = useState(1);
  const [themeModal, setThemeModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const load = async () => {
    try {
      dispatch({ type: 'start' });
      const res = await fetcher(`/api/projects/themes?limit=10&page=${page}`, {
        method: 'GET',
      });

      const data = Array.isArray(res.themes) ? res.themes : [];

      dispatch({ type: 'load', data, total: res.total });
    } catch (e) {
      message.error(e?.message || 'Something went wrong.');
    } finally {
      dispatch({ type: 'finish' });
    }
  };

  useEffect(() => {
    if (!theme) return;

    setThemeModalOpen(true);
    load();
  }, [theme, page]);

  const onCancel = () => setThemeModalOpen(false);

  const handleThemeSelection = (theme) => {
    setSelectedTheme(theme);
  };

  const handleAddTheme = () => {
    confirm({
      title: 'Are you sure you want to add this theme?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onAdd(selectedTheme._id);
      },
      onCancel() {},
    });
  };

  return (
    <Modal
      closable
      width="70%"
      open={themeModal}
      title="Add a new theme"
      onCancel={onCancel}
      footer={[
        <div style={{padding: 5}}>

        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          key="add"
          type="primary"
          onClick={handleAddTheme}
          disabled={!selectedTheme}
        >
          Add
        </Button>
        </div>
      ]}
    >
      <div style={{ maxHeight: '60vh', overflow: 'visible scroll' }}>
        <List
          itemLayout="vertical"
          size="default"
          loading={state.loading || loading}
          pagination={{
            onChange: (page) => {
              setPage(page);
            },
            total: state.total + 1,
            pageSize: 3,
          }}
          dataSource={[...state.themes,
          ]}
          footer={ <Text type="secondary">
    Powered by <b>AutoCode</b> - The ultimate platform for rapid web development.
  </Text>}
          renderItem={(theme) => {
            const index = themes.findIndex((t) => t._id === theme._id);
            const isSelected = selectedTheme && selectedTheme._id === theme._id;
            const ribbonText = index >= 0 ? 'Added' : '';
            const ribbonColor = index >= 0 ? 'green' : '';

            return (
              <div key={theme._id} style={{ width: 'calc(100% - 30px)' }}>
                <Badge.Ribbon text={ribbonText} color={ribbonColor}>
                  <Card
                  
                    bodyStyle={{ padding: 10 }}
                    style={{ padding: 0, marginBottom: 10 }}
                    hoverable
                  >
                    <List.Item
                      key={theme.title}
                      actions={[
                        <IconText icon={StarOutlined} text="0" key="list-vertical-star-o" />,
                        <IconText icon={LikeOutlined} text="0" key="list-vertical-like-o" />,
                      ]}
                      extra={
                        <img width={272} alt="logo" src={theme.preview || '/images/default/theme.png'} />
                      }
                    >
                      <List.Item.Meta
                        title={theme.name}
                        description={
                          <div>
                            <span style={{ paddingRight: 10 }}>Author: </span>
                            <b>
                              <Avatar src={<img src={theme.creator.image} alt="avatar" />} />{' '}
                              <em>{theme.creator.name}</em>{' '}
                            </b>
                          </div>
                        }
                      />
                      <p>{theme.desc}</p>
                      <Text type="secondary">
                        Date: <b> <em>{new Date(theme.createdAt).toDateString()}</em> </b>
                      </Text>
                    </List.Item>
                  </Card>
                </Badge.Ribbon>
              </div>
            );
          }}
        />
      </div>
    </Modal>
  );
}