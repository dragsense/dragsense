import {
    Form,
    Row,
    Input,
    Button,
    Select,
    message,
    Spin,
    Alert,
    Tooltip,
    Radio,
  } from "antd";
  import { useState, useEffect, useReducer } from "react";
  import LayoutServices from "@/lib/services/layouts";
  
  const { Option } = Select;
  
  const reducer = (state, action) => {
    switch (action.type) {
      case "start":
        return { ...state, loading: true };
      case "error":
        return { ...state, error: action.error };
      case "finish":
        return { ...state, loading: false };
      case "update":
      case "add":
        return { ...state, layout: action.layout, loading: false };
      default:
        return state;
    }
  };
  
  export default function AddLayout({ layout, onSubmit }) {
    const [states, dispatch] = useReducer(reducer, {
      loading: false,
    });
    const [form] = Form.useForm();
    const [state, setState] = useState(layout);
    const [template, setTemplate] = useState('noSides'); // Local state for withTemplate
  
    useEffect(() => {
      const load = async () => {
        try {
          dispatch({ type: "start" });
  
          if (layout._id !== -1) {
            const res = await LayoutServices.get(layout._id);
            if (res.layout) {
              setState(res.layout);
            }
          }
  
          form.setFieldsValue({ name: layout?.name });
        } catch (e) {
          dispatch({
            type: "error",
            error: e?.message || "Something went wrong.",
          });
        } finally {
          dispatch({ type: "finish" });
        }
      };
  
      load();
    }, [layout]);
  
    const onChange = (event) => {
      event.preventDefault();
      let value = event.target.value;
      const name = event.target.name;
  
      if (name === "slug") {
        value = value.trim().toLowerCase();
      }
  
      setState({ ...state, [name]: value });
    };
  
    const onSelectTemplate = (event) => {
        let value = event.target.value;

      setTemplate(value);
    };
  
    const onSubmitForm = (values) => {
      form
        .validateFields()
        .then(async () => {
          onSubmit({ ...state}, template); // Pass template separately
        })
        .catch((info) => {
          message.error("Validate Failed.");
        });
    };
  
    return (
      <>
        {state.error && (
          <Alert
            message={state.error}
            style={{ margin: "10px 0" }}
            type="error"
            showIcon
            closable
          />
        )}
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
                message: "Please enter the layout name (alphanumeric).",
                pattern: /^[a-zA-Z0-9\s]+$/,
              },
              {
                min: 2,
                message: "Layout name must be at least 2 characters long",
              },
            ]}
          >
            <Input
              placeholder="Name"
              name="name"
              onChange={onChange}
              value={state.name}
            />
          </Form.Item>
       

        {state._id === -1 && ( // Only show template option when creating a new layout
         <Form.Item
         label="Template"
         name="withTemplate"
         style={{ width: '100%' }} // Full width
       >
         <Tooltip
           title="Select a template. You can update or edit the template elements later."
         >
           <Radio.Group
             onChange={onSelectTemplate}
             value={template} // Use local state for withTemplate
             style={{ width: '100%' }} // Full width
           >
             <Radio value="full">Full</Radio>
             <Radio value="noLeft">No Left</Radio>
             <Radio value="noRight">No Right</Radio>
             <Radio value="noSides">No Sides</Radio>
           </Radio.Group>
         </Tooltip>
       </Form.Item>
        )}
  
          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit" loading={states.loading}>
              Save
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
            ></div>
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
            ></Spin>
          </>
        )}
      </>
    );
  }
  