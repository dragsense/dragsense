import { Modal, Table, Space, theme, Tooltip, Button, Badge } from "antd";
import Link from "next/link";
import { ExclamationCircleFilled } from "@ant-design/icons";

import { AiFillFile, AiOutlineEdit, AiOutlineCopy, AiOutlineSetting, AiOutlineDelete } from 'react-icons/ai';
import moment from "moment";
import Router from "next/router";

const { confirm } = Modal;


const DocumentList = ({ documents, page, onClone, total, setPage, onEdit, onDelete }) => {

    const handleTableChange = (pagination, filters, sorter) => {

       // setPage(pagination.current);
    };

    const {
        token: { colorError, colorWarning },
    } = theme.useToken();


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <span><AiFillFile size='1.5em' className="ac-icon1" /> {text}</span>,
            sorter: (a, b) => a.name.localeCompare(b.name),

        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            align: 'center',
            sorter: (a, b) => a.slug.localeCompare(b.slug),

        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: date => moment(date).format('MMMM Do YYYY, h:mm:ss a'),
        }, {
            title: 'Created By',
            dataIndex: 'creator',
            key: 'creator',
            align: 'center',
            render: creator => creator?.name,
        },
        {
            title: 'Last Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            align: 'center',
            render: date => date && moment(date).format('MMMM Do YYYY, h:mm:ss a'),
        },
        {
            title: 'Last Updated By',
            dataIndex: 'updater',
            key: 'updater',
            align: 'center',
            render: updater => updater?.name,
        },
        {
            title: 'Status',
            dataIndex: 'setting',
            key: 'setting',
            align: 'center',
            render: setting => <Badge status={setting?.status === 'DRAFT' ? 'default' : 'success'} text={setting?.status} />,
            sorter: (a, b) => {
                // If the status is the same, no sorting is needed
                if (a.setting?.status === b.setting?.status) {
                    return 0;
                }

                // Sort by status in alphabetical order (DRAFT -> PENDING -> APPROVED)
                const statusOrder = {
                    DRAFT: 1,
                    PENDING: 2,
                    APPROVED: 3,
                };

                return statusOrder[a.setting?.status] - statusOrder[b.setting?.status];
            },
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (text, record) => (
                <Space size="middle">

                    <Tooltip title="Edit Document">
                        <Button icon={<AiOutlineSetting size="1.5em" />} onClick={async (e) => {

                            e.preventDefault();
                            onEdit({ ...record });

                        }} />

                    </Tooltip>

                    <Tooltip title="Copy Dcoument">

                        <Button icon={<AiOutlineCopy style={{ color: colorWarning }} size="1.5em" />}
                            onClick={async (e) => {

                                e.preventDefault();
                                confirm({
                                    title: 'Are you sure to copy this document?',
                                    icon: <ExclamationCircleFilled />,
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    onOk() {
                                        onClone(record._id);
                                    },
                                    onCancel() {

                                    },
                                });

                            }} />
                    </Tooltip>

                    <Tooltip title="Delete Document">
                        <Button icon={<AiOutlineDelete size="1.5em" />} onClick={async (e) => {

                            e.preventDefault();
                            confirm({
                                title: 'Are you sure to install this document?',
                                icon: <ExclamationCircleFilled />,
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk() {
                                    onDelete(record._id);
                                },
                                onCancel() {

                                },
                            });

                        }} /> </Tooltip>
                </Space>
            ),
        },
    ]


    return <Table columns={columns} 
    rowKey="_id"
    dataSource={documents} pagination={{
        total: total,
        current: page,
        pageSize: 10,
    }}
        onChange={handleTableChange}
    />


};

export default DocumentList;
