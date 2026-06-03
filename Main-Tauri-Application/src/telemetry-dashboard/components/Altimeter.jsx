import React from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";

import Slider from '@mui/material/Slider';
import Card from "@mui/material/Card";

export function Altimeter({rocketPos, maxSliderValue}) {
    const { tokens: ui, styles: uiStyles } = useTheme();
    const dash = uiStyles.telemetryDashboard;

    return (


  
    <Slider sx={{marginLeft: -2}}
      disabled
      getAriaLabel={() => 'Temperature'}
      orientation="vertical"
      
      defaultValue={[rocketPos.current.y, 1500]}

      value={rocketPos.current.y}

      min={0}
      max={rocketPos.apogeePoint.y < maxSliderValue ? maxSliderValue : rocketPos.apogeePoint.y + rocketPos.apogeePoint.y*0.05}
      
      marks={[
        {
          value: rocketPos.apogeePoint.y,
          label: <Card style={{fontSize: "x-small"}}>{rocketPos.apogeePoint.y.toString()}m <br/> (Apogee) </Card>,
        },

        {
          value: rocketPos.current.y,
          label: <Card style={{fontSize: "x-small" }}>{rocketPos.current.y.toString()}m <br/>  (Current) </Card>,
        },

      
      ]}
      valueLabelDisplay="off"
      
    />


)};