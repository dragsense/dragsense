import { Image, message, Modal, Card, Button } from "antd";
import MediaServices from "@/lib/services/media";
import { fetcher } from "@/lib/fetch";
import { useState, useEffect, } from "react";
import { DeleteOutlined } from '@ant-design/icons'

import Media from './Media';

export default function ImageComponent({ type = "", image, setImage, onSelect, onRemove }) {


    const [isModalOpen, setIsModalOpen] = useState(false);


    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect( () => {

        // try {
        //     setIsLoading(true);


          

        //     const url = `http://localhost:3001`;
        //     const apiKey ='';

        //     const images = await MediaServices.getByField('images', type, url, apiKey);

        //     setImages(images);


        // } catch (e) {
        //     message.error(e?.message || 'Something went wrong');
        // } finally {
        //     setIsLoading(false);
        // }

    }, []);



    const isImageArray = Array.isArray(image);


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {

        if (selectedImage && type) {
            setImage(selectedImage._id)
        }

        if (onSelect && selectedImage)
            onSelect(selectedImage);

        setIsModalOpen(false);
    };


    const onRemoveImage = (path) => {

        if (selectedImage && type) {
            setImage("")
        }

        if (onRemove)
            onRemove(path);

    };

    const onAddMore = (newImages) => {
      
        setImages([...images, ...newImages])
    }

    return (
        <>

            <div onClick={showModal} style={{
                cursor: 'pointer'
            }}>

                <Card loading={isLoading} >
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {isImageArray ? image.map(img => <div className="state-image">
                            <div class="state-image-icon" onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemoveImage(img);
                            }}>
                                <DeleteOutlined style={{ color: "red" }} /></div>
                            <Image
                                width={100}
                                height={100}
                                preview={false}
                                src={img || "/images/default/default-img.png"}
                                fallback="/images/default/default-img.png" /></div>)
                        
                    
                        : <div className="state-image">
                            <div class="state-image-icon" onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemoveImage(image);
                            }}><DeleteOutlined style={{ color: "red" }} /></div>
                            <Image
                                width={100}
                                height={100}
                                preview={false}
                                src={images.find(img => (img._id == image || img.path == image))?.path || "/images/default/default-img.png"}
                                fallback="/images/default/default-img.png" /></div>
                    }</div>

                </Card>
            </div>

            <Modal title="Images" visible={isModalOpen} onCancel={handleCancel} onOk={handleOk} >
                
            <Media onAdd={onAddMore}  type="images">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {images.map(img => {

                        const isSelected = img == selectedImage;

                        return <div
                            onClick={() => !isSelected && setSelectedImage(img)}
                            onMouseEnter={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.outline = "thin solid #f88a24";
                            }}
                            onMouseLeave={(e) => {
                                e.preventDefault();

                                if (!isSelected)
                                    e.currentTarget.style.outline = "thin dotted #2fc1ff";
                            }
                            }
                            style={{
                                padding: '1px', margin: 2,
                                outline: !isSelected ? "thin dotted #2fc1ff " : "thin solid #f88a24",
                                cursor: 'pointer'
                            }}>
                            <Image
                                width={100}
                                height={100}
                                preview={false}
                                src={img.path || "/images/default/default-img.png"}
                                fallback="/images/default/default-img.png" />
                        </div>
                    }
                    )}
                </div>
                </Media>
            </Modal>


        </>
    );

}

