import { Modal, Button, Badge, Avatar, List, Skeleton, Typography, Tooltip, theme } from "antd";
import { ExclamationCircleFilled, DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Text } = Typography;

const BackupList = ({
  total,
  setPage,
  backups,
  onDelete,
  onEdit,
  onInstall,
  onDownload
   }) => {


    
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

    dataSource={backups}
    renderItem={(backup) => (
      <List.Item
        actions={[
          <Button onClick={(e) => {
            e.preventDefault();

            confirm({
              title: 'Are you sure to install this backup?',
              icon: <ExclamationCircleFilled />,
              okText: 'Yes',
              okType: 'danger',
              cancelText: 'No',
              onOk() {
                onInstall(backup._id);
              },
              onCancel() {

              },
            });


          }}
          >
            Install
          </Button>,
          <Tooltip title="Download Backup"> <DownloadOutlined size="2em"  key="download"  style={{ fontSize: 20 }}

            onClick={(e) => {
              e.preventDefault();

              onDownload(backup._id);


            }}
          />
          </Tooltip>,
          <Tooltip title="Edit Backup"> <EditOutlined size="2em"  key="edit" style={{ fontSize: 20 }}

            onClick={(e) => {
              e.preventDefault();

              onEdit({...backup});


            }}
          />
          </Tooltip>,
          <Tooltip title="Delete Backup"> <DeleteOutlined style={{fontSize: 20,color: colorError}} size="2em"  key="delete" 

            onClick={(e) => {
              e.preventDefault();

              confirm({
                title: 'Are you sure delete this backup?',
                icon: <ExclamationCircleFilled />,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                  onDelete(backup._id);
                },
                onCancel() {

                },
              });

            }} /></Tooltip>]}
      >


        <Skeleton title={false} loading={false} active>

          <List.Item.Meta

            title={<><Badge status={backup.published ? 'success' : 'default'} text={backup.name} /></>}
            description={`Date: ${new Date(backup.createdAt).toDateString()}`}
          />

        </Skeleton>

 


        <div>
          <Avatar src={<img src={backup.creator.image} alt="avatar" />} />
          <br />
          <Text type="secondary">
            Created By:   <b> <em>{backup.creator.name}</em> </b>
          </Text>
        </div>



      </List.Item>
    )}
  />


};

export default BackupList;
