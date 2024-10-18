import { Form, Input, message, Spin, Switch, Alert } from "antd";
import { useState, useEffect, useReducer } from "react";
const { TextArea } = Input;
import UserServices from "@/lib/services/users";

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return { ...state, loading: true };
    case "error":
      return { ...state, error: action.error };
    case "finish":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function AddUser({ user, onSubmit }) {
  const [states, dispatch] = useReducer(reducer, {
    loading: false,
    layouts: [],
  });
  const [form] = Form.useForm();
  const [state, setState] = useState(user);

  useEffect(() => {
    const laod = async () => {
      try {
        dispatch({ type: "start" });
        console.log(user)

        if (user._id !== -1) {
          const res = await UserServices.getUser(user._id);
          if (res.user) {
            setState(res.user);
          }
        }

        form.setFieldsValue({
          name: user?.name,
          email: user?.email,
          isEmailPublic: user?.isEmailPublic,
          bio: user?.bio,
          emailVerified: user?.emailVerified,
        });
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
  }, [user]);

  const onChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onEmailPublicChange = (checked) => {
    setState((prevState) => ({ ...prevState, isEmailPublic: checked }));
  };

  const onSubmitForm = (values) => {
    onSubmit({ ...state });
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
              message: "Please enter the user name (alphanumeric).",
              pattern: /^[a-zA-Z0-9\s]+$/,
            },
            {
              min: 2,
              message: "User name must be at least 4 characters long",
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
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter the email.",
            },
            {
              type: "email",
              message: "Please enter a valid email address.",
            },
          ]}
        >
          <Input
            placeholder="Email"
            name="email"
            onChange={onChange}
            value={state.email}
          />
        </Form.Item>
        <Form.Item label="Make email verified" name="emailVerified">
          <Switch checked={state.emailVerified} />
        </Form.Item>
        <Form.Item label="Make email public" name="isEmailPublic">
          <Switch
            checked={state.isEmailPublic}
            onChange={onEmailPublicChange}
          />
        </Form.Item>
        <Form.Item label="Bio" name="bio">
          <TextArea
            rows={4}
            name="bio"
            value={state.bio}
            onChange={onChange}
            placeholder="Tell something about yourself..."
          />
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
          />
        </>
      )}
    </>
  );
}
