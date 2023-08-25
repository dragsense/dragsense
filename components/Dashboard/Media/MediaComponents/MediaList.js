import { Row, Image, Modal, Card, Col, Tooltip, Button, theme, Badge } from "antd";
import { ExclamationCircleFilled, FileOutlined, DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;

const { confirm } = Modal;

import ImageList from '../ImageList';
import { FixedSizeList, Grid } from 'react-window';

import Video from "../Video";
import Audio from '../Audio'
import { useMemo } from "react";

const COLS = 4;

const MediaList = ({ media, type, onEdit, onDelete, onSelect, srcs }) => {

    const {
        token: { colorPrimary },
    } = theme.useToken();


    const List = ({ index, style }) => {

        const colIndex = index * (COLS);

        const items = [];

        items.push(media[colIndex] && media[colIndex]);

        if (media[colIndex + 1])
            items.push(media[colIndex + 1]);
        if (media[colIndex + 2])
            items.push(media[colIndex + 2]);
        if (media[colIndex + 3])
            items.push(media[colIndex + 3]);

        return <div style={{ ...style, width: '99.5%' }}><Row gutter={16}>
            {items.map(item => {

                const isSelected = srcs.some(s => (s?._id == item._id || s?.src == item.src));

                return <Col key={item._id} span={6}>

                    <Badge.Ribbon text={isSelected ? 'Selected' : ''} color={isSelected ? 'green' : 'none'}>
                        <Card
                            className="actions-item-card"
                            style={{  height: 300 }}
                            cover={
                                item.type === 'images' ?
                                    <Image
                                        onClick={() => {
                                            if (onSelect)
                                                onSelect(item)
                                        }}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center' }}
                                        preview={true}
                                        src={item.src}
                                        fallback="/images/default/default-img.png" />
                                    : item.type === 'videos' ?
                                        <Video src={item.src} alt={item.alt} mimetype={item.mimetype}
                                        />

                                        : item.type === 'audios' ?
                                            <Audio src={item.src} alt={item.alt} /> :
                                            <a href={item.src} target="_blank" rel="noopener noreferrer">
                                                <FileOutlined style={{ fontSize: 48 }} />
                                            </a>
                            }
                            actions={[
                                <Tooltip title="Download"> <DownloadOutlined className="ac-icon2" size="2em" key="download" style={{ fontSize: 20 }}

                                    onClick={(e) => {
                                        e.preventDefault();

                                        const downloadLink = document.createElement('a');
                                        downloadLink.href = item.src;
                                        downloadLink.target = '_blank';
                                        downloadLink.download = true;
                                        downloadLink.click();



                                    }}
                                />
                                </Tooltip>,
                                <Tooltip title="Edit"> <EditOutlined className="ac-icon2" size="2em" key="delete" style={{ fontSize: 20 }}

                                    onClick={(e) => {
                                        e.preventDefault();

                                        onEdit({ ...item });


                                    }}
                                />
                                </Tooltip>,
                                <Tooltip title="Delete"> <DeleteOutlined className="ac-icon2" size="2em" key="delete"

                                    onClick={(e) => {
                                        e.preventDefault();

                                        confirm({
                                            title: 'Are you sure delete this item?',
                                            icon: <ExclamationCircleFilled />,
                                            okText: 'Yes',
                                            okType: 'danger',
                                            cancelText: 'No',
                                            onOk() {
                                                onDelete(item._id);
                                            },
                                            onCancel() {

                                            },
                                        });

                                    }} /></Tooltip>
                            ]}
                            hoverable
                        >
                            <Meta title={<Button style={isSelected ? {
                                color: colorPrimary,
                                borderColor: colorPrimary
                            } : {}}

                                onClick={() => {
                                    if (onSelect)
                                        onSelect(item)
                                }
                                }>{item.name}</Button>}

                                description={
                                    <>
                                        {item.dimensions && (
                                            <p>
                                                Dimensions: {item.dimensions.width} x {item.dimensions.height}
                                            </p>
                                        )}
                                    </>
                                }

                            />
                        </Card>
                    </Badge.Ribbon>
                </Col>
            }
            )}
        </Row></div>
    }



    return <FixedSizeList
        style={{ overflow: 'hidden auto' }}
        itemCount={Math.ceil(media.length / COLS)}
        width={"100%"}
        height={500}
        itemSize={360}

    >
        {List}
    </FixedSizeList>

}

export default MediaList;
