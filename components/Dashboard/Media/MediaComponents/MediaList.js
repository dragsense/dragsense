import { Row, Image, Modal, Card, Col, Tooltip, Button, theme, Badge } from "antd";
import { ExclamationCircleFilled, FileOutlined, DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { FixedSizeList } from 'react-window';
import Video from "../Video";
import Audio from '../Audio'

// Destructuring for cleaner code
const { Meta } = Card;
const { confirm } = Modal;

// Constant for number of columns
const COLS = 4;

// MediaList component
const MediaList = ({ media, host, onEdit, onDelete, onSelect, srcs }) => {
    // Extract colorPrimary from theme
    const { token: { colorPrimary } } = theme.useToken();


    // List component for rendering media items
    const List = ({ index, style }) => {
        // Calculate column index
        const colIndex = index * (COLS);
        // Initialize items array
        const items = [];

        // Push media items into the array
        for(let i = 0; i < COLS; i++) {
            if(media[colIndex + i]) {
                items.push(media[colIndex + i]);
            }
        }

        // Render media items
        return (
            <div style={{ ...style, width: '99.5%' }}>
                <Row gutter={16}>
                    {items.filter(item => item._id).map(item => {
                        // Check if the item is selected
                        const isSelected = srcs.some(s => (s?._id == item._id || s?.src == item.src));
                        return (
                            <MediaItem 
                            key={item._id}
                                host={host}
                                item={item} 
                                isSelected={isSelected} 
                                colorPrimary={colorPrimary} 
                                onEdit={onEdit} 
                                onDelete={onDelete} 
                                onSelect={onSelect} 
                            />
                        );
                    })}
                </Row>
            </div>
        );
    };

    // Render FixedSizeList with List component
    return (
        <FixedSizeList
            style={{ overflow: 'hidden auto' }}
            itemCount={Math.ceil(media.length / COLS)}
            width={"100%"}
            height={500}
            itemSize={360}
        >
            {List}
        </FixedSizeList>
    );
};

// MediaItem sub-component
const MediaItem = ({ item, host, isSelected, colorPrimary, onEdit, onDelete, onSelect = () => {} }) => {
    // Render different types of media
    const renderMedia = () => {
        
        switch(item.type) {
            case 'images':
                return <Image onClick={() => onSelect(item)} style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center' }} preview={true} src={host + item.src}  fallback="/images/default/default-img.png" />;
            case 'videos':
                return <Video src={host + item.src} alt={item.alt} mimetype={item.mimetype} />;
            case 'audios':
                return <Audio src={host + item.src} alt={item.alt} />;
            default:
                return <a href={host + item.src} target="_blank" rel="noopener noreferrer"><FileOutlined style={{ fontSize: 48 }} /></a>;
        }
    };

    // Render actions for media item
    const renderActions = () => {
        return [
            <Tooltip title="Download">
                <DownloadOutlined className="ac-icon2" size="2em" key="download" style={{ fontSize: 20 }} onClick={(e) => downloadItem(e, item.src)} />
            </Tooltip>,
            <Tooltip title="Edit">
                <EditOutlined className="ac-icon2" size="2em" key="edit" style={{ fontSize: 20 }} onClick={(e) => { e.preventDefault(); onEdit({ ...item }); }} />
            </Tooltip>,
            <Tooltip title="Delete">
                <DeleteOutlined className="ac-icon2" size="2em" key="delete" style={{ fontSize: 20 }} onClick={(e) => deleteItem(e, item._id)} />
            </Tooltip>,
        ];
    };

    // Function to download item
    const downloadItem = (e, src) => {
        e.preventDefault();
        const downloadLink = document.createElement('a');
        downloadLink.href = src;
        downloadLink.target = '_blank';
        downloadLink.download = true;
        downloadLink.click();
    };

    // Function to delete item
    const deleteItem = (e, id) => {
        e.preventDefault();
        confirm({
            title: 'Are you sure to delete this item?',
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                onDelete(id);
            },
            onCancel() { },
        });
    };

    // Render MediaItem
    return (
        <Col key={item._id} span={6} style={{ marginBottom: 16 }}>
            <Badge.Ribbon text={isSelected ? 'Selected' : ''} color={isSelected ? 'green' : 'none'}>
                <Card
                    className="actions-item-card"
                    style={{  height: 300 }}
                    cover={renderMedia()}
                    actions={renderActions()}
                    hoverable
                >
                    <Meta
                        title={
                            <Button
                                style={isSelected ? { color: colorPrimary, borderColor: colorPrimary } : {}}
                                onClick={() => onSelect(item)}
                            >
                                {item.name}
                            </Button>
                        }
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
    );
};

export default MediaList;