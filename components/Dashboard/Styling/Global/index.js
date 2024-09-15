import { Button, Input, Space, Divider, Row, Col, theme, Select, Spin } from "antd";
import { useState } from "react";

import SwitchComponents from "@/components/Panel";
import { FontsIFrame } from "@/components/Iframe/setting";

import { ColorComponent, ColorPreview } from "./Colors";
import { FontComponent, FontPreview } from "./Fonts";
import { VariableComponent, VariablesPreview } from "./Variables";

export default function GlobalStyleComponent() {
  const [element, setElement] = useState("Fonts");
  const [color, setColor] = useState(null);
  const [variable, setVariable] = useState(null);

  const [font, setFont] = useState(null);
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [backgroundColor, setBackgroundColor] = useState("#fff");

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const onLoad = (fonts) => {
    setFonts(fonts || []);
    setLoading(false);
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Space wrap>
            <Button
              style={
                element == "Fonts"
                  ? { borderColor: colorPrimary, color: colorPrimary }
                  : {}
              }
              onClick={(e) => {
                e.preventDefault();
                setElement("Fonts");
              }}
            >
              {" "}
              Fonts{" "}
            </Button>
            <Button
              style={
                element == "Colors"
                  ? { borderColor: colorPrimary, color: colorPrimary }
                  : {}
              }
              onClick={(e) => {
                e.preventDefault();
                setElement("Colors");
              }}
            >
              {" "}
              Colors{" "}
            </Button>
            <Button
              style={
                element == "Variables"
                  ? { borderColor: colorPrimary, color: colorPrimary }
                  : {}
              }
              onClick={(e) => {
                e.preventDefault();
                setElement("Variables");
              }}
            >
              {" "}
              Variables{" "}
            </Button>
          </Space>
          <br />
          <br />
          <SwitchComponents active={element}>
            <ColorComponent color={color} setColor={setColor} index="Colors" />
            <FontComponent
              font={font}
              setFonts={setFonts}
              fonts={fonts}
              setFont={setFont}
              index="Fonts"
            />
            <VariableComponent
              variable={variable}
              setVariable={setVariable}
              index="Variables"
            />
          </SwitchComponents>
        </Col>
        <Col span={12}>
          &nbsp;&nbsp;
          <Input
            style={{ backgroundColor, width: 50, height: 25 }}
            type="color"
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
          &nbsp;&nbsp;{" "}
          <Select
            placeholder="Select Font"
            onChange={(value) => {
              const font = fonts.find((f) => f._uid === value);
              setFont(font);
            }}
            value={font?._uid}
            style={{ width: 300, textAlign: "left" }}
          >
            {fonts.map((font, i) => (
              <Option
                key={font._uid}
                value={font._uid}
              >{`${font.name} (${font.fontFamily})`}</Option>
            ))}
          </Select>
          <div style={{ height: 600 }}>
            <FontsIFrame onLoad={onLoad} onLoading={(value) => setLoading(value)}>
              <div style={{ backgroundColor, height: "100%", padding: 24 }}>
                <SwitchComponents active={element}>
                  <ColorPreview index="Colors" font={font} color={color} />
                  <FontPreview index="Fonts" font={font} />
                  <VariablesPreview
                    index="Variables"
                    font={font}
                    variable={variable}
                  />
                </SwitchComponents>
              </div>
            </FontsIFrame>
          </div>
        </Col>
      </Row>

      {loading && (
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
      )}
      <Spin
        tip="Loading"
        size="small"
        spinning={loading}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",

          transform: "translate(-50%, -50%)",
        }}
      ></Spin>
    </>
  );
}
