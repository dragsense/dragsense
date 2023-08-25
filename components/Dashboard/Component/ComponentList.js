import { Modal, Table, Space, Tooltip, theme, message, Button } from "antd";
import Link from "next/link";
import { ExclamationCircleFilled } from "@ant-design/icons";

import { AiFillFile, AiOutlineEdit, AiOutlineCopy, AiOutlineSetting, AiOutlineDelete } from 'react-icons/ai';
import moment from "moment";
import Router from "next/router";
import { signIn, signOut, useSession } from 'next-auth/react';
import ProjectServices from "@/lib/services/projects";

const { confirm } = Modal;


const ComponentList = ({ components, onClone, page, total, setPage, onEdit, onDelete }) => {
    const { data: session } = useSession();

    const handleTableChange = (pagination, filters, sorter) => {

        setPage(pagination.current);
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
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Edit Component">
                        <Button icon={<AiOutlineEdit size="1.5em" />} onClick={async () => {
                            localStorage.setItem("activePage", record._id);
                            localStorage.setItem("pageType", 'component');
                            try {

                                if (!session.user)
                                    throw new Error("Unauthorized Access or Session Expired");

                        
                                const projectId = localStorage.getItem("project");

                                const info = {
                                    pageId: record._id,
                                    pageType: 'component',
                                    projectId,
                                };

                                const encodedInfo = encodeURIComponent(JSON.stringify(info));

                                Router.push(`/admin/editor?info=${encodedInfo}`);

                            } catch (e) {
                                message.error(e?.message || "Something was wrong.")
                            }


                        }} /></Tooltip>
                    <Tooltip title="Edit Component">
                        <Button icon={<AiOutlineSetting size="1.5em" />} onClick={async (e) => {

                            e.preventDefault();
                            onEdit(record);

                        }} className="ac-icon2" size="2em" />

                    </Tooltip>
                    <Tooltip title="Copy Component">

                        <Button icon={<AiOutlineCopy style={{ color: colorWarning }} size="1.5em" />}
                            onClick={async (e) => {

                                e.preventDefault();
                                confirm({
                                    title: 'Are you sure to copy this component?',
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
                    <Tooltip title="Delete Component">
                        <Button icon={<AiOutlineDelete style={{ color: colorError }} size="1.5em" />} onClick={async (e) => {

                            e.preventDefault();
                            confirm({
                                title: 'Are you sure to install this component?',
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

    return <Table columns={columns} dataSource={components} pagination={{
        total: total,
        current: page,
        pageSize: 10,
    }}
        onChange={handleTableChange}
    />


};

export default ComponentList;
