import {
  Form,
  Tooltip,
  Divider,
  Select,
  Input,
  Button,
  Card,
  Spin,
} from "antd";
import { QuestionCircleFilled, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect, useReducer } from "react";
import CollectionServices from "@/lib/services/collections";
import ComponentServices from "@/lib/services/components";
import SettingServices from "@/lib/services/setting";

const { Option } = Select;

import { StateComponent, AddStateComponent } from "./State";

export const TYPES = [
  { value: "text", label: "TEXT" },
  { value: "number", label: "NUMBER" },
  { value: "image", label: "IMAGE" },
  { value: "video", label: "VIDEO" },
  { value: "audio", label: "AUDIO" },
  { value: "date", label: "DATE" },
  { value: "time", label: "TIME" },
  { value: "month", label: "MONTH" },
  { value: "boolean", label: "BOOLEAN" },
  { value: "color", label: "COLOR" },
  { value: "classes", label: "CLASSES" },
];

const initialState = {
  key: "",
  defaultValue: null,
  type: TYPES[0].value,
  states: {},
  new: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return { ...state, loading: true };
    case "loadCollections":
      return { ...state, collections: action.data };
    case "loadComponents":
      return { ...state, components: action.data };
    case "error":
      return { ...state, error: action.error };
    case "finish":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function AddComponent({ component, onSubmit }) {
  const [states, dispatch] = useReducer(reducer, {
    loading: false,
    collections: [],
    components: [],
  });

  const [collectionSearch, setCollectionSearch] = useState("");
  const [componentSearch, setComponentSearch] = useState("");
  const [host, setHost] = useState("");

  const [newState, setNewState] = useState(null);
  const [state, setState] = useState({});
  const [form] = Form.useForm();

  const collectionLoad = async () => {
    try {
      dispatch({ type: "start" });

      const res = await CollectionServices.search(collectionSearch);

      if (res.collections) {
        const data = Array.isArray(res.collections.results)
          ? res.collections.results
          : [];
        dispatch({ type: "loadCollections", data });
      }
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  useEffect(() => {
    if (!collectionSearch) return;

    collectionLoad();
  }, [collectionSearch]);

  const componentLoad = async () => {
    try {
      dispatch({ type: "start" });

      const res = await ComponentServices.search(componentSearch);

      if (res.components) {
        const data = Array.isArray(res.components.results)
          ? res.components.results
          : [];
        dispatch({ type: "loadComponents", data });
      }
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  useEffect(() => {
    if (!componentSearch) return;

    componentLoad();
  }, [componentSearch]);

  useEffect(() => {
    const laod = async () => {
      try {
        dispatch({ type: "start" });

        if (component._id !== -1) {
          const res = await ComponentServices.get(component._id);
          if (res.component) {
            component = res.component;
          }
        } else {
          component.states = {};
        }
        form.setFieldsValue({ name: component?.name });
        const result = await SettingServices.get();
        setHost(result.host || "");
        setState(component);
        dispatch({ type: "loadComponents", data: component.component || [] });
        dispatch({ type: "loadCollections", data: component.collection || [] });
      } catch (e) {
        dispatch({
          type: "error",
          error: e?.message || "Something went wrong.",
        });
      } finally {
        dispatch({ type: "finish" });
      }
    };

    laod();
  }, [component]);

  const onChange = (event) => {
    event.preventDefault();

    const value = event.target.value;
    const name = event.target.name;

    setState({ ...state, [name]: value });
  };

  const handleChangeCollection = (value, option) => {
    setState({ ...state, attached: value ? value : undefined });
  };

  const handleChangeParent = (value, option) => {
    setState({ ...state, parent: value ? value : undefined });
  };

  const onSubmitForm = async (values) => {
    form
      .validateFields()
      .then(async (values) => {
        // state.states.push({ key: '__loading__', defaultValue: false, type: 'BOOLEAN' },
        //     '__loading__');

        onSubmit(state);
      })
      .catch((info) => {
        message.error("Validate Failed.");
      });
  };

  const onAddState = (value) => {
    if (!state.states || 
      (Array.isArray(state.states) && state.states?.length)) state.states = {};

    state.states[value.key] = value;
    setState({ ...state });
  };

  const onRemoveState = (key) => {
    if (state.states[key]) {
      delete state.states[key];
    }
    setState({ ...state });
  };

  const dropdownRender = (menu) => {
    return (
      <>
        {states.loading && <div>Loading...</div>}
        {menu}
      </>
    );
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        initialValues={{}}
        onFinish={onSubmitForm}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter the component name (alphanumeric).",
              pattern: /^[a-zA-Z0-9\s]+$/,
            },
            {
              min: 3,
              message: "Component name must be at least 3 characters long",
            },
            {
              max: 60,
              message: "Text be at most 60 characters long",
            },
          ]}
          className="font-500"
        >
          <Input
            placeholder="Name"
            name="name"
            onChange={onChange}
            value={state.name}
          />
        </Form.Item>

        <Form.Item
          label="Parent Component"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Parent Component"
            showSearch
            clearIcon
            onChange={handleChangeParent}
            onSearch={(v) => {
              if (!state.loading) setComponentSearch(v);
            }}
            dropdownRender={dropdownRender}
            optionFilterProp="label"
            defaultValue={state.parent}
            value={state.parent}
          >
            <Option value=""> None </Option>

            {states.components.map((c) => (
              <Option disabled={c._id === state._id} key={c._id} value={c._id} label={c.name}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Attach Collection"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select Collection"
            showSearch
            clearIcon
            onChange={handleChangeCollection}
            onSearch={(v) => {
              if (!state.loading) setCollectionSearch(v);
            }}
            dropdownRender={dropdownRender}
            optionFilterProp="label"
            defaultValue={state.attached}
            value={state.attached}
          >
            <Option value=""> None </Option>

            {states.collections.map((col) => (
              <Option key={col._id} value={col._id} label={col.name}>
                {col.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Card
          title={
            <>
              States{" "}
              <Tooltip title="Dynamic Variables">
                {" "}
                <QuestionCircleFilled />
              </Tooltip>
            </>
          }
          extra={
            <Tooltip title="Add New">
              <Button
                type="text"
                onClick={() => setNewState({ ...initialState })}
                icon={<PlusOutlined />}
              >
                {" "}
              </Button>
            </Tooltip>
          }
          headStyle={{ padding: 10 }}
        >
          {newState ? (
            <AddStateComponent
              host={host}
              newState={newState}
              onAdd={onAddState}
              setNewState={setNewState}
            />
          ) : (
            <StateComponent
              states={state.states || {}}
              setNewState={setNewState}
              onRemove={onRemoveState}
            />
          )}
        </Card>

        <Form.Item className="text-right" style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={states.loading}>
            {" "}
            Save{" "}
          </Button>
        </Form.Item>
      </Form>
      {states.loading && (
        <>
          <div
            style={{
              position: "fixed",
              width: "100%",
              height: "100%",
              backgroundColor: "#2fc1ff",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          ></div>{" "}
          <Spin
            tip="Loading"
            size="small"
            spinning={states.loading}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",

              transform: "translate(-50%, -50%)",
            }}
          ></Spin>{" "}
        </>
      )}
    </>
  );
}
