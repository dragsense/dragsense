import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, Tooltip, theme, Modal } from "antd";
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FixedSizeGrid as Grid } from 'react-window';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const { Meta } = Card;
const { confirm } = Modal;

const ICON_CARD_WIDTH = 190;
const MIN_COLUMN_WIDTH = 200;

const IconsList = ({ icons, onEdit, onDelete, editor = false }) => {


    const {
        token: { colorPrimary },
    } = theme.useToken();

    const onDragStart = useCallback((e, icon) => {
        const iconClasses = icon.classes.split(" ").reduce((classesObj, className) => {
            return [...classesObj, { name: className }];
        }, []);

        if (editor)
            e.dataTransfer.setData('text/plain', JSON.stringify({
                tag: 'i', type: 'icons',
                layout: icon.classes ? 'icon' : 'svg-icon',
                nodeValue: icon.svg,
                classes: icon.classes ? iconClasses : {}
            }));

    }, []);


    const containerRef = useRef(null);
    const [newCols, setNewCols] = useState(1);

    useEffect(() => {
        const updateCols = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const maxColumns = Math.floor(containerWidth / MIN_COLUMN_WIDTH);
                const updatedCols = Math.max(maxColumns, 1);
                if (newCols !== updatedCols) {
                    setNewCols(updatedCols);
                }
            }
        };
        updateCols();
        window.addEventListener('resize', updateCols);
        return () => {
            window.removeEventListener('resize', updateCols);
        };
    }, [newCols]);


    const GridCell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * newCols + columnIndex;
        const icon = icons[index];

        if (!icon) return null;

        return (
            <div style={{ ...style, width: ICON_CARD_WIDTH, height: style.height }}>
                <Card
                    key={icon._id}
                    className="actions-item-card"
                    style={{ width: 'calc(100% - 10px)', height: 130 }} cover={
                        <div
                            draggable={true}
                            onDragStart={e => onDragStart(e, icon)}
                            style={{ padding: 10, textAlign: 'center', height: 80 }}
                        >
                            {icon?.svg ? (
                                <div className="icons-svg" style={{ textAlign: 'center',  height: '100%', overflow: 'hidden' }}
                                    dangerouslySetInnerHTML={{ __html: icon.svg }} />
                            ) : (
                                <AiOutlineCheckCircle style={{ fontSize: 48 }} />
                            )}
                        </div>
                    }
                    actions={[
                        <Tooltip title="Edit">
                            <EditOutlined
                                className="ac-icon2"
                                size="2em"
                                key="edit"
                                style={{ fontSize: 20 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onEdit({ ...icon });
                                }}
                            />
                        </Tooltip>,
                        <Tooltip title="Delete">
                            <DeleteOutlined
                                className="ac-icon2"
                                size="2em"
                                key="delete"
                                onClick={(e) => {
                                    e.preventDefault();
                                    confirm({
                                        title: 'Are you sure delete this item?',
                                        icon: <ExclamationCircleFilled />,
                                        okText: 'Yes',
                                        okType: 'danger',
                                        cancelText: 'No',
                                        onOk() {
                                            onDelete(icon._uid);
                                        },
                                    });
                                }}
                            />
                        </Tooltip>
                    ]}
                    hoverable
                >
                    <Meta title={icon.name} description={<></>} />
                </Card>
            </div>
        );
    };





    return (
        <div ref={containerRef} style={{ width: '100%', height: 500 }} id="icons-container">
            <Grid
                columnCount={newCols}
                columnWidth={ICON_CARD_WIDTH}
                height={500}
                rowCount={Math.ceil(icons.length / newCols)}
                rowHeight={150}
                width={newCols * ICON_CARD_WIDTH}
            >
                {GridCell}
            </Grid>
        </div>
    );
};

export default IconsList;