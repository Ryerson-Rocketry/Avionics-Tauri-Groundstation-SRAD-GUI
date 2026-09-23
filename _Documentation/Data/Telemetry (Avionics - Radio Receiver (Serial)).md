
To provide data to the GUI, a Python Webserver with serial port access is used (a connected radio receiver should be used in conjunction with this). At this time only hardcoded data that is required is supported
- Note: Will include custom data mapping (via a specified schema) later

General Flow is from CSV string received from the Webserver which is then parsed into a JSON object for use in the GUI itself. The CSV string can be parsed either using headers received from radio or on a positional basis (via. position of element in csv string)

## Supported Telemetry Data
### Hardcoded Data

| Data            | Radio (Header/Position) -> Webserver JSON Mapping | Webserver -> Tauri JSON Mapping | Data Type | Data Vis                  |
| --------------- | ------------------------------------------------- | ------------------------------- | --------- | ------------------------- |
| Latitude        | latitude -> x                                     |                                 | Number    | 2D Map                    |
| Longitude       | longitude -> z                                    |                                 | Number    | 2D Map                    |
| Altitude        | altitude -> y                                     |                                 | Number    | 2D Map<br>3D Map<br>Graph |
| Pressure        | pressure ->                                       |                                 | Number    | Text<br>Graph             |
| Temperature     | temperature -> temp                               |                                 | Number    | Text<br>Graph             |
| Battery Voltage | battery_voltage -> battVolt                       |                                 | Number    | Text                      |
| Main Voltage    | main_voltage -> mainVolt                          |                                 | Number    | Text                      |
| Drogue Voltage  | drogue_voltage -> drogVolt                        |                                 | Number    | Text                      |
| Velocity        | speed -> vel                                      |                                 | Number    | Text<br>Graph             |
| Acceleration    | acceleration -> acceleration                      |                                 | Number    | Text<br>Graph             |
| State           | state_name -> state                               |                                 | String    | Text                      |
| Time            | time -> timestamp                                 |                                 | Number    | Graph                     |
| Pitch/Roll/Yaw  |                                                   |                                 | Vector3   | 3D Map<br>Text            |
