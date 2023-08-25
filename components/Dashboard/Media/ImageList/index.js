import { Image, Modal, Card, Col, Badge, Button, theme } from "antd";
import { ExclamationCircleFilled, DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;


const { confirm } = Modal;

const ImageList = ({ images, onEdit, onDelete, srcs, onSelect }) => {

    const {
        token: { colorPrimary },
    } = theme.useToken();



    return <Image.PreviewGroup>
        {images.map(image => {
            const isSelected = srcs.some(s => (s._id == image._id || s.src == image.src));

            return <Col key={image._id} xs={24} md={12} lg={8} xl={6}>
                <Badge.Ribbon text={isSelected ? 'Selected' : ''} color={isSelected ? 'green' : 'none'}>


                    <Card
                        className="actions-item-card"
                        cover={
                            <Image
                                style={{ width: 200, height: 200, objectFit: 'cover', objectPosition: 'center' }}
                                preview={true}
                                src={image.src}
                                fallback="/images/default/default-img.png" />

                        }
                        actions={[
                            <DownloadOutlined className="ac-icon2" size="2em" key="download" style={{ fontSize: 20 }}

                                onClick={(e) => {
                                    e.preventDefault();

                                    const downloadLink = document.createElement('a');
                                    downloadLink.href = image.src;
                                    downloadLink.target = '_blank';
                                    downloadLink.download = true;
                                    downloadLink.click();



                                }}
                            />
                            ,
                            <EditOutlined className="ac-icon2" size="2em" key="delete" style={{ fontSize: 20 }}

                                onClick={(e) => {
                                    e.preventDefault();

                                    onEdit(image);


                                }}
                            />
                            ,
                            <DeleteOutlined className="ac-icon2" size="2em" key="delete"

                                onClick={(e) => {
                                    e.preventDefault();

                                    confirm({
                                        title: 'Are you sure delete this image?',
                                        icon: <ExclamationCircleFilled />,
                                        okText: 'Yes',
                                        okType: 'danger',
                                        cancelText: 'No',
                                        onOk() {
                                            onDelete(image._id);
                                        },
                                        onCancel() {

                                        },
                                    });

                                }} />
                        ]}
                        hoverable
                    >
                        <Meta title={<Button style={isSelected ? {
                            color: colorPrimary,
                            borderColor: colorPrimary
                        } : {}} onClick={() => onSelect(image)}>{image.name}</Button>} />
                    </Card>
                </Badge.Ribbon>
            </Col>
        })}


    </Image.PreviewGroup>
};

export default ImageList;
