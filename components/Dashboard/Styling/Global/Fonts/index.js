import React from "react";


import Fonts from './Fonts';

export function FontComponent({ font, fonts, setFonts, setFont }) {
    return <Fonts font={font} fonts={fonts} setFont={setFont} setFonts={setFonts} />
};




export function FontPreview({ font }) {


    return <>{font ? <>
        <div style={{ fontFamily: `"${font?.fontFamily}", sans-serif` }}>
            <h1>This is heading 1</h1>
            <h2>This is heading 2</h2>
            <h3>This is heading 3</h3>
            <h4>This is heading 4</h4>
            <h5>This is heading 5</h5>
            <h6>This is heading 6</h6>


            <p>Lorem ipsum, or lipsum as it is <i>sometimes</i> known, is <strong>dummy text</strong> used in laying out <em>print</em>, <b>graphic</b> or web designs. </p>

            <span style={{ fontWeight: 100 }}>100 </span>
            <span style={{ fontWeight: 200 }}>200 </span>
            <span style={{ fontWeight: 300 }}>300 </span>
            <span style={{ fontWeight: 400 }}>400 </span>
            <span style={{ fontWeight: 500 }}>500 </span>
            <span style={{ fontWeight: 600 }}>600 </span>
            <span style={{ fontWeight: 700 }}>700 </span>
            <span style={{ fontWeight: 800 }}>800 </span>
            <span style={{ fontWeight: 900 }}>900 </span>

        </div></> : <span>Please Select the Font</span>}


    </>

}

