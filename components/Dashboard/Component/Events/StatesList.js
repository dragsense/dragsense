import { Button, Table, Space, Menu } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import Link from "next/link";
import { AiFillFile, AiOutlineEdit, AiOutlineSetting, AiOutlineDelete } from 'react-icons/ai';

import moment from "moment";


const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <span><AiFillFile size='1.5em' className="ac-icon1" /> {text}</span>,
    },
    {
        title: 'Slug',
        dataIndex: 'slug',
        key: 'slug',
        align: 'center',
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => moment(date).format('MMMM Do YYYY, h:mm:ss a'),
    },
    {
        title: 'Action',
        key: 'action',
        align: 'right',
        render: (text, record) => (
            <Space size="middle">
                <Link href={`/admin/dashboard/components/${record._id}`} ><AiOutlineEdit className="ac-icon2" size="2em" /></Link>
                <AiOutlineSetting className="ac-icon2" size="2em" />
                <AiOutlineDelete className="ac-icon2" size="2em" />
            </Space>
        ),
    },
]

const PageList = ({ user, components }) => {

    return (
        components.length > 0 ? <>
            <div className="inner-box border">
                <div className="wrapper">
                    <div className="inner-box">
                        <h1> Components </h1>
                        <Link href='/admin/dashboard/pages/0'><Button type="primary" ghost className="plus font-lg" icon={<PlusOutlined />}> </Button></Link>
                    </div>
                    <Table columns={columns} dataSource={components} />
                </div>
            </div>
        </>
            :
            <div className="text-center">
                <h2 className="font-xxl font-700"> Wellcome, {" "}
                    <span className="primary-color">{user.name.split(" ")[0]}</span> </h2>
                <span className="font-lg"> Get started with your first Page </span>
                <span className="hr-space-sm"></span>
                <Link href='/admin/dashboard/pages/0'><Button type="primary" ghost className="plus font-lg" icon={<PlusOutlined />}> </Button></Link>
            </div>

    );
};

export default PageList;
