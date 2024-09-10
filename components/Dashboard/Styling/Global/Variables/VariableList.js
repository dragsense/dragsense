import { Modal, List, Skeleton, Tooltip, theme } from "antd";
import { ExclamationCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { confirm } = Modal;


const VariableList = ({ selectedVariable, onSelect, variables,
    total,
    setPage,
    page, onDelete, onEdit }) => {


    const {
        token: { colorError, colorText, colorBgLayout },
    } = theme.useToken();


    return <List
        itemLayout="horizontal"
        pagination={{
            onChange: (page) => {
                setPage(page);
            },
            pageSize: 25,
            total: total,
            current: page,
        }}
        dataSource={variables}
        renderItem={(variable, index) => (
            <List.Item
                key={variable._uid}
                onClick={() => onSelect(variable)}
                style={{
                    color: colorText,
                    background: selectedVariable == variable ? colorBgLayout : null, cursor: 'pointer', borderRadius: 10, padding: '5px 10px'

                }}

                actions={[
                    <EditOutlined key="edit" size={10} style={{ fontSize: 20 }}

                        onClick={(e) => {
                            e.preventDefault();

                            onEdit({ ...variable });
                        }}
                    />
                    ,
                    <DeleteOutlined style={{ fontSize: 20, variable: colorError }} key="delete" size={10}

                        onClick={(e) => {
                            e.preventDefault();

                            confirm({
                                title: 'Are you sure delete this variable?',
                                icon: <ExclamationCircleFilled />,
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk() {
                                    onDelete(variable._uid);
                                },
                                onCancel() {

                                },
                            });

                        }} />]}
            >
                <Skeleton avatar title={false} loading={false} active>
                    <List.Item.Meta
                        title={variable.name}
                        description={<><span>{variable.variable}</span> : <em>{variable.value}</em></>}
                    />
                    <span>Type: {variable.type}</span>
                </Skeleton>
            </List.Item>
        )}
    />


};

export default VariableList;
