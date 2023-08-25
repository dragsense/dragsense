import AddState from "./Add";
import { MinusCircleOutlined } from '@ant-design/icons';
import { Divider, Menu, Layout, Row, Col } from "antd";
import { useState } from "react";
const { Sider } = Layout;


const StateList = ({ states, type, onChangeState, onRemove }) => {

    const [selectedElementKey, setElementSelectedKey] = useState([0]);
    const [openKeys, setOpenKeys] = useState([0]);

    const [state, setState] = useState(null);

    const handleElementSelect = (event) => {

        if(!states[event.key]){
            setState(null)
        return;
        }

        setElementSelectedKey([event.key]);



        let selectedStates = null;

        if (type == 'array')
            selectedStates = { key: event.key, defaultValue: states[event.key], type: 'text' };
        else if (type == 'object_array')
            selectedStates = { key: event.key, states: Object.values(states[event.key]), type: 'object' };
        else
            selectedStates = states[event.key]; 
 
        setState(selectedStates)

    };
    const handleSubMenuOpenChange = (keys) => {
        setOpenKeys(keys.slice(-1));
    };


    const onChangeSlelectedState = () => {
       
        if (type == 'array' || type == 'object_array')
        states[state.key].defaultValue = state.defaultValue;
        onChangeState();
    }

    return <>
        <div style={{ display: 'flex', flexWrap: "wrap" }}>
            <div style={{ paddingRight: 18 }}>
                <Sider width={180}
                    theme="light"

                >
                    <Menu
                        theme='light'
                        mode="inline"
                        openKeys={openKeys}
                        style={{ maxHeight: '100%', overflow: 'auto' }}
                        selectedKeys={selectedElementKey}
                        defaultSelectedKeys={[0]}
                        onClick={handleElementSelect}
                        onOpenChange={handleSubMenuOpenChange}

                    >

                        {Object.entries(states).map(([key, value]) => <Menu.Item key={key} icon={onRemove && <MinusCircleOutlined onClick={() => onRemove(key)} />}>

                            {key && `[${key}]`}
                            {onRemove && `[${key}]`} 



                        </Menu.Item>
                        )}
                    </Menu>
                </Sider>
            </div>
            <div style={{ flex: 1 }}>

                {state && <><Divider orientation="left" orientationMargin="0">{`[${state?.key}]`} </Divider>
                    <AddState

                        onChangeState={onChangeSlelectedState}
                        key={state.key}
                        state={state} />
                </>}

            </div>
        </div>
    </>
}


export default StateList;
