import { List, Button, Modal } from 'antd';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

const StateList = ({ states, setNewState, onRemove }) => {
  const handleEditState = (record) => {

    setNewState({ ...record, edit: true });
  };

  const handleDeleteState = (record) => {
    confirm({
      title: 'Are you sure to delete this key?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onRemove(record.key);
      },
      onCancel() {},
    });
  };

  const renderItemActions = (record) => {
    return (
      <div>
        <Button
          icon={<AiOutlineEdit size="1em" />}
          onClick={() => handleEditState(record)}
        />
        <Button
          icon={<AiOutlineDelete size="1em" />}
          onClick={() => handleDeleteState(record)}
        />
      </div>
    );
  };

  return (
    states && <List
      dataSource={Object.values(states)}
      renderItem={(item) => (
        <List.Item key={item.key}>
          <List.Item.Meta title={item.key} description={`Type: ${item.type}`} />
          {renderItemActions(item)}
        </List.Item>
      )}
    />
  );
};

export default StateList;