import { useState } from "react";
import { Button, Table, Space, Menu, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { fetcher } from "@/lib/fetch";

import { AiFillFile, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import AddTheme from "./Add";
import moment from "moment";
import Router from "next/router";

import Themes from "@/components/Project/themes";


const ThemeList = ({ themes, setThemes, id, project }) => {

    const [_project, setProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <span><AiFillFile size='1.5em' className="ac-icon1" /> {text}</span>,
        }, {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: date => moment(date).format('MMMM Do YYYY, h:mm:ss a'),
        },
        {
            title: 'With Demo',
            dataIndex: 'isDemo',
            key: 'isDemo',
            align: 'center',
            render: value => value,
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={async () => {
                        try {
                            const url = `http://${project.domain}:${project.port}`;
                            const apikey = project.apikey;

                            const response = await fetcher(`${url}/api/themes/${record.name}`, {
                                method: 'GET',
                                headers: { 'x-api-key': apikey },
                            });

                        } catch (e) {
                            message.error(e?.message || 'Something went wrong');
                        } finally {
                        }


                    }}>Download</Button>
                    <Button disabled={project.activeTheme == record._id} className={project.activeTheme == record._id ? 'ac=tabs-btn' : ''} onClick={async () => {
                        try {
                           

                            const response = await fetcher(`/api/projects/${project._id}/theme/${record._id}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', },
                                body: JSON.stringify({}),
                            });

                          

                        } catch (e) {
                            message.error(e?.message || 'Something went wrong');
                        } finally {
                        }
                    }}>{project.activeTheme == record._id ? 'Activated' : 'Active'}</Button>
                    <AiOutlineDelete className="ac-icon2" size="2em" onClick={async () => {


                        try {

                            await fetcher(`/api/projects/${project._id}/theme/${record._id}`, {
                                method: 'DELETE',
                            });

                            let index = themes.indexOf(record);
                            if (index !== -1) {
                                themes.splice(index, 1);
                            }

                            setThemes([...themes]);
                        } catch (e) {
                            message.error(e?.message || 'Something went wrong');
                        } finally {
                        }

                    }} />
                </Space>
            ),
        },
    ]


    const onDownload = async (values) => {

        try {
            
            console.log(values);
            await fetcher(`/api/projects/${project._id}/themes`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(values),
            });



        } catch (e) {
            message.error(e?.message);
        } finally {
           
        }
    }


    return (<div className="wrapper">
        {!_project && <div style={{ paddingBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
            <h2> Themes </h2>

            <hr />



            <Button
                onClick={(e) => { e.preventDefault(); setIsModalOpen(true) }}
                type="primary" size="small" ghost className="plus font-lg" icon={<PlusOutlined />}> </Button>
            <Themes onDownload={onDownload} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>}

        <Table columns={columns} dataSource={themes} />
    </div>


    );
};

export default ThemeList;
