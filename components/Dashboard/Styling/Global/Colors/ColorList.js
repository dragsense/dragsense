import { Modal, List, Skeleton, Tooltip, theme } from "antd";
import { ExclamationCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { confirm } = Modal;


const ColorList = ({ selectedColor, onSelect, total,
    setPage,
    page, colors, onDelete, onEdit }) => {

  const {
        token: { colorError, colorText, colorBgLayout },
      } = theme.useToken();
    
    

    return <List
        itemLayout="horizontal"
        dataSource={colors}
        pagination={{
            onChange: (page) => {
                setPage(page);
            },
            pageSize: 25,
            total: total,
            current: page,
        }}
        renderItem={(color, index) => (
            <List.Item
            
            key={color._uid}
            onClick={() => onSelect(color)}
            style={{
                color: colorText,
                background:  selectedColor == color ? colorBgLayout : null, cursor: 'pointer', borderRadius: 10, padding: '5px 10px'

             }}

                actions={[
                     <EditOutlined key="edit" size={10} style={{ fontSize: 20 }}

                        onClick={(e) => {
                            e.preventDefault();

                            onEdit({ ...color });
                        }}
                    />
                  ,
                    <DeleteOutlined style={{ fontSize: 20, color: colorError }} key="delete" size={10}

                        onClick={(e) => {
                            e.preventDefault();

                            confirm({
                                title: 'Are you sure delete this color?',
                                icon: <ExclamationCircleFilled />,
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk() {
                                    onDelete(color._uid);
                                },
                                onCancel() {

                                },
                            });

                        }} />]}
            >
                <Skeleton avatar title={false} loading={false} active>
                    <List.Item.Meta
                        title={ <div style={{backgroundColor: '#fff', padding: 3, display: 'inline-block', borderRadius: 5,}}> <div style={{ background: color.color, borderRadius: 5, width: '20px', height: '20px' }}></div></div>}
                        description={color.name}
                    />
                </Skeleton>
            </List.Item>
        )}
    />


};

export default ColorList;
