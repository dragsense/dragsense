import React, { useState, useEffect } from "react";

import Variables from "./Vairables";

export function VariablesPreview({ variable, font }) {
  const [selectedOption, setSelectedOption] = useState("font-size");
  const [selectedSize, setSelectedOptionSize] = useState("width");
  const [selectedSpace, setSelectedSpace] = useState("margin");

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const handleChangeSize = (e) => {
    setSelectedOptionSize(e.target.value);
  };
  const handleChangeSpace = (e) => {
    setSelectedSpace(e.target.value);
  };
  return variable ? (
    <>
      {variable.type === "font" ? (
        <>
          <div style={{ fontFamily: `"${font?.fontFamily}", sans-serif` }}>
            <div style={{ display: "flex", gap: 10 }}>
              <label>
                <input
                  type="radio"
                  value="font-size"
                  checked={selectedOption === "font-size"}
                  onChange={handleChange}
                />{" "}
                Font Size
              </label>
              <label>
                <input
                  type="radio"
                  value="font-weight"
                  checked={selectedOption === "font-weight"}
                  onChange={handleChange}
                />{" "}
                Font Weight
              </label>
              <label>
                <input
                  type="radio"
                  value="line-height"
                  checked={selectedOption === "line-height"}
                  onChange={handleChange}
                />{" "}
                Line Height
              </label>
              <label>
                <input
                  type="radio"
                  value="word-spacing"
                  checked={selectedOption === "word-spacing"}
                  onChange={handleChange}
                />{" "}
                Word Spacing
              </label>
              <label>
                <input
                  type="radio"
                  value="letter-spacing"
                  checked={selectedOption === "letter-spacing"}
                  onChange={handleChange}
                />{" "}
                Letter Spacing
              </label>
            </div>

            <p style={{ [selectedOption]: variable.value }}>
              Lorem ipsum, or lipsum as it is <i>sometimes</i> known, is{" "}
              <strong>dummy text</strong> used in laying out <em>print</em>,{" "}
              <b>graphic</b> or web designs.{" "}
            </p>
            <button style={{ [selectedOption]: variable.value }}>
              Button Text
            </button>
          </div>{" "}
        </>
      ) : variable.type === "size" ? (
        <div style={{ fontFamily: `"${font?.fontFamily}", sans-serif` }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <label>
              <input
                type="radio"
                value="width"
                checked={selectedSize === "width"}
                onChange={handleChangeSize}
              />{" "}
              Width
            </label>
            <label>
              <input
                type="radio"
                value="height"
                checked={selectedSize === "height"}
                onChange={handleChangeSize}
              />{" "}
              Height
            </label>
            <label>
              <input
                type="radio"
                value="border"
                checked={selectedSize === "border"}
                onChange={handleChangeSize}
              />{" "}
              Border
            </label>
            <label>
              <input
                type="radio"
                value="border-radius"
                checked={selectedSize === "border-radius"}
                onChange={handleChangeSize}
              />{" "}
              Border Radius
            </label>
          </div>

          {selectedSize === "width" ? (
            <div
              style={{
                background: "#d67822",
                width: variable.value,
                height: "100px",
              }}
            ></div>
          ) : selectedSize === "height" ? (
            <div
              style={{
                background: "#d67822",
                width: "100%",
                height: variable.value,
              }}
            ></div>
          ) : selectedSize === "border" ? (
            <div
              style={{
                border: `${variable.value} solid #2fc1ff`,
                width: "100%",
                boxSizing: "border-box",
                height: 400,
              }}
            ></div>
          ) : (
            <div
              style={{
                border: `2px solid #2fc1ff`,
                borderRadius: variable.value,
                width: "100%",
                height: 400,
              }}
            ></div>
          )}
        </div>
      ) : (
        variable.type === "space" && (
          <div style={{ fontFamily: `"${font?.fontFamily}", sans-serif` }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <label>
                <input
                  type="radio"
                  value="margin"
                  checked={selectedSpace === "margin"}
                  onChange={handleChangeSpace}
                />{" "}
                Margin
              </label>
              <label>
                <input
                  type="radio"
                  value="padding"
                  checked={selectedSpace === "padding"}
                  onChange={handleChangeSpace}
                />{" "}
                Content Padding
              </label>
              <label>
                <input
                  type="radio"
                  value="buttonPadding"
                  checked={selectedSpace === "buttonPadding"}
                  onChange={handleChangeSpace}
                />{" "}
                Button Padding
              </label>
            </div>

            {selectedSpace === "margin" ? (
              <div
                style={{ border: `2px solid #2fc1ff`, display: "inline-block" }}
              >
                <div
                  style={{
                    background: "#d67822",
                    margin: variable.value,
                    width: 100,
                    height: 100,
                    boxSizing: "content-box",
                  }}
                ></div>
              </div>
            ) : selectedSpace === "buttonPadding" ? (
              <div
                style={{ border: `2px solid #2fc1ff`, display: "inline-block" }}
              >
                <button
                  style={{
                    padding: variable.value,
                    width: 100,
                    height: 100,
                    boxSizing: "content-box",
                  }}
                >
                  Button Text
                </button>
              </div>
            ) : (
              <div
                style={{
                  border: `2px solid #2fc1ff`,
                  display: "inline-block",
                  padding: variable.value,
                }}
              >
                <div style={{ border: `2px solid #2fc1ff` }}>Content</div>
              </div>
            )}
          </div>
        )
      )}{" "}
    </>
  ) : (
    <span>Please Select the Variable</span>
  );
}

export function VariableComponent({ variable, setVariable }) {
  return <Variables variable={variable} setVariable={setVariable} />;
}
