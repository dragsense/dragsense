import { Modal, List, Skeleton, Tooltip, theme } from "antd";
import { ExclamationCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { confirm } = Modal;


const FontList = ({ selectedFont, onSelect, fonts, onDelete, onEdit }) => {

    const {
        token: { colorError, colorText,colorBgLayout },
      } = theme.useToken();
    
    
    

    return <List
        itemLayout="horizontal"
        dataSource={fonts}
        renderItem={(font, index) => (
            <List.Item
            key={font._uid}
            onClick={() => onSelect(font)}
            style={{
                color: colorText,
                background:  selectedFont == font ? colorBgLayout : null, cursor: 'pointer', borderRadius: 10, padding: '5px 10px'

             }}


                actions={[
                    <EditOutlined key="edit" size={10} style={{ fontSize: 20 }}

                        onClick={(e) => {
                            e.preventDefault();

                            onEdit({ ...font });
                        }}
                    />
                ,
                     <DeleteOutlined style={{ fontSize: 20, color: colorError }} key="delete" size={10}

                        onClick={(e) => {
                            e.preventDefault();

                            confirm({
                                title: 'Are you sure delete this font?',
                                icon: <ExclamationCircleFilled />,
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk() {
                                    onDelete(font._uid);
                                },
                                onCancel() {

                                },
                            });

                        }} />]}
            >
                <Skeleton avatar title={false} loading={false} active>
                    <List.Item.Meta
                        title={font.name}
                        description={font.fontFamily}
                    />
                </Skeleton>
            </List.Item>
        )}
    />


};

export default FontList;
