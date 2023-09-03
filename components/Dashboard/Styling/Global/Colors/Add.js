import { Form, Modal, Input, message, ColorPicker } from "antd";
import { useState, useEffect } from "react";
import tinycolor from "tinycolor2";

export default function AddColor({ onSubmit, color = {} }) {
    const [form] = Form.useForm();
    const [colorModal, setColorModalOpen] = useState(false);
    const [palette, setPalette] = useState([]);
    const [selectedColor, setSelectedColor] = useState("");

    useEffect(() => {
        if (!color) {
            return;
        }

        form.setFieldsValue(color);
        setPalette([]);
        setColorModalOpen(true);
    }, [color]);

    

    useEffect(() => {
        if (!selectedColor) {
            return;
        }

        setTimeout(() => {
            const generatedPalette = generatePalette(selectedColor);
            setPalette([...generatedPalette]);
        })
   
    }, [selectedColor]);

    const onCancel = () => setColorModalOpen(false);

    const handleColorChange = (colorValue) => {

        if(colorValue !== selectedColor) {
        setSelectedColor(colorValue);
        form.setFieldsValue({ color: colorValue });

    
        setPalette([]);
        }


      };

    const handleColorSelection = (color) => {
        form.setFieldsValue({ color });
        setSelectedColor(color);

       
    };

    const handleAfterOpenChange = (visible) => {
      if(visible)
      setSelectedColor(color?.color);
      else
      setPalette([]);
    };



    const generatePalette = (baseColor) => {
        const palette = [];
        var colors = tinycolor(baseColor).analogous();
        colors.map(function (t) { return palette.push(t.toHexString()) });
        return palette;
    };

    return (
        <Modal
            visible={colorModal}
            title={`${color?._uid === -1 ? "Add a new" : "Edit"} color`}
            okText="Save"
            cancelText="Cancel"
            afterOpenChange={handleAfterOpenChange}
            onCancel={onCancel}
            onOk={() => {
                setColorModalOpen(false);

                form
                    .validateFields()
                    .then(async (values) => {
                        if (await onSubmit(values)) {
                            form.resetFields();
                        } else {
                            setColorModalOpen(true);
                        }
                    })
                    .catch((info) => {
                        setColorModalOpen(true);
                        message.error("Validation Failed.");
                    });
            }}
        >
            <>
                <Form form={form} layout="vertical" name="form_in_modal" initialValues={{}}>
                    <Form.Item
                        name="name"
                        label="Color Name"
                        className="color-500"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the color name (alphanumeric).",
                                pattern: /^[a-zA-Z0-9\s]+$/,
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>

                    <Form.Item style={{marginBottom: 0, minHeight: 0}} label="Color" name="color" className="color-500">
                        <Input type="hidden" />
                    </Form.Item>
                    <ColorPicker value={selectedColor}
                    allowClear={true}
                    format={"hex"}
                    onChangeComplete={(color, hex) => {
                        const metaColor = color.metaColor;
                        const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;
                        handleColorChange(rgbColor)

                    }} />
                </Form>
                <div style={{ display: "flex", flexWrap: "wrap", height: 40 }}>
                    {palette.map((color) => (
                        <div
                            key={color}
                            style={{
                                width: "30px",
                                height: "30px",
                                backgroundColor: color,
                                margin: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => handleColorChange(color)}
                        ></div>
                    ))}
                </div>
            </>
        </Modal>
    );
}