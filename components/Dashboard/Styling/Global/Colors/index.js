import React, { useState, useEffect } from "react";

import Colors from './Colors';

import tinycolor from "tinycolor2";

export function ColorPreview({ color, font }) {
    const [palette, setPalette] = useState([]);
    const [fontFamily, setFontFamily] = useState("");

    const generatePalette = (baseColor) => {
        const palette = [];
        var colors = tinycolor(baseColor).analogous();

        colors.map(function (t) { return palette.push(t.toHexString()) });
        return palette;
    };

    useEffect(() => {
        if (!color) {
            return;
        }


        const generatedPalette = generatePalette(color?.color);
        setPalette(generatedPalette);
    }, [color]);

    return <>{color ? <div style={{ fontFamily: `"${font?.fontFamily}", sans-serif` }}>
        <h1 style={{ color: color.color }}>{color?.name}</h1>
        <p style={{ color: color.color }}>
            Unleash your imagination and let the vibrant hues ignite your creativity. Dive into a world of endless possibilities and create designs that mesmerize and inspire.
        </p>
        <a href="#" style={{ color: color.color, pointerEvents: 'none' }} onClick={() => { return false }}>Explore More</a>
        <br />
        <br />
        <button
            style={{
                background: color.color,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                marginRight: 10,
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
            }}
        >
            {color?.name}
        </button>
        <button
            style={{
                background: '#fff',
                color: color.color,
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
            }}
        >
            {color?.name}
        </button>

        <br />
        <br />

        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {palette.map((color) => (
                <div>{color}<div style={{ background: color, width: '100px', height: '100px' }}></div> </div>
            ))}
        </div>


    </div> : <span>Please Select the Color</span>} </>
}

export function ColorComponent({ color, setColor }) {
    return <Colors color={color} setColor={setColor} />
};


