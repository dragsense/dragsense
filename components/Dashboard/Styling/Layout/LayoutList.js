import { Modal, List, Skeleton, theme } from "antd";
import { ExclamationCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from "moment";

const { confirm } = Modal;


const LayoutList = ({
    total,
    setPage,
    page,
    selectedLayout,
    onSelect,
    layouts,
    onDelete,
    onEdit }) => {

    const {
        token: { colorError, colorText, colorBgLayout },
    } = theme.useToken();




    return <List
        itemLayout="horizontal"
        dataSource={layouts}
        pagination={{
            onChange: (page) => {
                setPage(page);
            },
            pageSize: 10,
            total: total,
            current: page,
        }}
        renderItem={(layout, index) => (
            <List.Item
                key={layout._id}
                onClick={() => onSelect(layout)}

                style={{
                    color: colorText,
                    background: selectedLayout == layout ? colorBgLayout : null, cursor: 'pointer', borderRadius: 10, padding: '5px 10px'
                }}

                actions={[
                    <EditOutlined key="edit" size={10} style={{ fontSize: 20 }}

                        onClick={(e) => {
                            e.preventDefault();

                            onEdit(layout);
                        }}
                    />
                    ,
                    <DeleteOutlined style={{ fontSize: 20, color: colorError }} key="delete" size={10}

                        onClick={(e) => {
                            e.preventDefault();

                            confirm({
                                title: 'Are you sure delete this layout?',
                                icon: <ExclamationCircleFilled />,
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk() {
                                    onDelete(layout._id);
                                },
                                onCancel() {

                                },
                            });

                        }} />]}
            >
                <Skeleton avatar title={false} loading={false} active>
                    <List.Item.Meta
                        title={layout.name}
                        description={<>Usage: {layout.usage}
                            <br />
                            Created by: {layout.creator?.name || 'Unknown'}
                            <br />
                            CeatedAt: {moment(layout.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                            <br />
                            Updated by: {layout.updater?.name || 'Unknown'}
                            <br />
                            updatedAt: {moment(layout.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}

                        </>}
                    />
                </Skeleton>
            </List.Item>
        )}
    />


};

export default LayoutList;
