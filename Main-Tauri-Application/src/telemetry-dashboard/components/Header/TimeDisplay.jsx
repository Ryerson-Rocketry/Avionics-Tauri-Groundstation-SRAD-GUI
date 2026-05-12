
import { useTheme } from "../../../styles/ThemeContext.jsx";
import React from "react";

//https://realcoding.blog/en/2023/07/10/javascript-number-padding/
function zeroPad(num, places) {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export function TimeDisplay({time = 0, label, padding}) {
    const { tokens: ui, styles: uiStyles } = useTheme();
    return (
        <div style={{textAlign: "center", marginLeft: 2, marginRight: 2}}>
            <span style={{ fontFamily: ui.font.orbitron, fontSize: ui.text.md, letterSpacing: "2px", color: ui.colors.cyan }}>
            {zeroPad(time, padding)}
            </span> 
            <div style={{ fontFamily: ui.font.googleSans, fontSize: ui.text.xs, color: ui.colors.gray, letterSpacing: "1px" }}>
            {label}
            </div>  
        </div>
    )

}