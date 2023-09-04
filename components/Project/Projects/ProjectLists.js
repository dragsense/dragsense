
import { Row, Col, Empty, Card, Modal, theme } from 'antd'
import { EditOutlined, DashboardOutlined, ExclamationCircleFilled, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
const { confirm } = Modal;

const { Meta } = Card;


const gridStyle = {
  textAlign: 'center',
};



const ProjectLists = ({ total, projects, onDownlaod, onEdit, onDelete }) => {

  const router = useRouter();



  const {
    token: { colorError },
  } = theme.useToken();



  return total == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <>
    <Row gutter={[16, 16]} style={{ marginBottom: 10 }}>
      {projects.map((project, index) => <Col key={index} span={8}>
        <Card style={gridStyle} className="actions-item-card"
          hoverable
          actions={[
            <DashboardOutlined key="dashboard" onClick={(e) => {
              e.preventDefault();
              localStorage.setItem("project", project._id);
              router.push('/admin/dashboard?');
            }} />,
            <DownloadOutlined key="download" onClick={(e) => {
              e.preventDefault();
              onDownlaod({ ...project });
            }} />,
            <EditOutlined key="edit" onClick={(e) => {
              e.preventDefault();
              onEdit({ ...project });
            }} />,
            <DeleteOutlined style={{ color: colorError }} key="deelte" onClick={(e) => {
              e.preventDefault();


              confirm({
                title: 'Are you sure delete this project?',
                icon: <ExclamationCircleFilled />,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                  onDelete(project._id);
                },
                onCancel() {

                },
              });

            }} />
          ]}

        >

          <Meta
            title={project ? project.name : ""}
            description={`Role: ${'Owner'}`}
          />

        </Card>
      </Col>
      )}
    </Row>

  </>

};

export default ProjectLists;
