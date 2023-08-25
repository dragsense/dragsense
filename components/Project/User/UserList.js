import {Modal, Avatar, List, Skeleton, Tooltip, theme } from "antd";
import { ExclamationCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { confirm } = Modal;


const UserList = ({ total, setPage, roles, onDelete, onEdit }) => {

  const {
    token: { colorError },
  } = theme.useToken();


    return <List
    pagination={{
      onChange: (page) => {
        setPage(page);
      },
      total,
      pageSize: 10,
    }}
    itemLayout="horizontal"

    dataSource={roles}
    renderItem={(role) => (
        <List.Item
        actions={[
          <Tooltip title="Edit Permissions"> <EditOutlined key="edit" size={10}  style={{ fontSize: 20 }} 
         
          onClick={(e) => {
              e.preventDefault();

              onEdit({
                id: role._id, 
                roleName: role.name, 
                email: role.user.email, 
                permissions: role.permissions});

          
          }}
          />
          </Tooltip>,
        <Tooltip title="Delete User"> <DeleteOutlined style={{fontSize: 20, color: colorError}} key="delete" size={10}
        
        onClick={(e) => {
            e.preventDefault();

            confirm({
              title: 'Are you sure delete this user?',
              icon: <ExclamationCircleFilled />,
              okText: 'Yes',
              okType: 'danger',
              cancelText: 'No',
              onOk() {
                onDelete(role._id);
              },
              onCancel() {
                
              },
            });
        
        }} /></Tooltip>]}
      >
        <Skeleton avatar title={false} loading={false} active>
          <List.Item.Meta
            avatar={<Avatar src={role.user.image} />}
            title={role.user.name}
            description={role.user.email}
          />
         <div> <b>Role: </b> {role.name}  </div>
        </Skeleton>
      </List.Item>
    )}
  />


};

export default UserList;
