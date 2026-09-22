
<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/rackman404/TBA">
	<img src="_Documentation/Images/gitdocs/readme_top.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Avionics SRAD Ground Station</h3>

  <p align="center">
     Custom SRAD GUI for 2025-2027
    <br />
    <a href="https://github.com/TBA/TBA/tree/main/_Documentation"><strong>See Main Documentation »</strong></a>
    <a href="https://github.com/TBA/TBA/tree/main/_Documentation"><strong>See User Manual »</strong></a>
    <br />
  </p>
</div>


<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a> </li>
    <li><a href="#telemetry">Telemetry</a> </li>
	<li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started-development">Getting Started (Development)</a></li>
    <li><a href="#documentation">Documentation</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#attributions-and-acknowledgements">Attributions and Acknowledgments</a></li>
  </ol>
</details>

Updated (2026-09-20)

# Overview

TODO NEW IMG
<sub>Preview - Version V0.1 - 2026-05-08</sub>

<video src="TODO NEW GITHUB GIF" controls></video> 
<sub>Long Demo (Using Test Launch Data) - Version V0.1 - 2026-05-08 (See other demos in _Documentation/Videos)</sub>

### Purpose
Desktop application specifically for displaying both raw and parsed telemetry data transmitted from Avionics' specific onboard firmware. Overall application comprises the Tauri built application as well as a Python webserver for receiving data from a connected radio.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# To be worked on current Academic year (2026-2027)

(will organize into proper task sheet later)

Unlike previous years, Avionics plans to reuse the current GUI iteration foe the coming academic year instead of recycling and making a new one. The following is a tentative list of improvements to be done:

- Control Systems livestream (Capturing -> Processing -> Display (GUI) -> Recording/Transmission)
	- GUI - Either separate window or replace current GUI to be more focused on the livestream
- Refactor
	- Entire:
		- Fix the CRUD operation stuff that was non functional.
		- Add unit testing for the more critical data parsing/serial stuff 
	- Backend
		- Possible merging of python webserver functionalities into just the Tauri's rust backend (to reduce dependencies/simplify things)
	- Frontend
		- Full JavaScript -> Typescript conversion
		- Revert bad temp code made before comp
		- Etc..
- Improvement
	- Possibly new data display components beyond what is currently implemented (TBD)
	- Performance (ex. currently 3D map + graphs do not perform well when rendering large number of data points ( < 2ish mins of launch data))

# Telemetry 

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

## Telemetry Data Display Modules

| Module                        | Image | Description                                                                                                                                                                                                                   | Data Supported                                                                                                 |
| ----------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Graph                         |       | Shows all data points recorded on graphs. Has option for single graph view, all graph view, or full screen graph views.<br><br>Note: For scaling, custom y axis domain may be switched on (datamin, datamax) or to auto scale | Altitude<br>Velocity<br>Acceleration<br>Pressure<br>Temperature                                                |
| Numerical Statistics          |       | By default, shows current value, max, min, and mean. If expanded, will show Standard Deviation and Variance. May also show uni                                                                                                | Altitude<br>Velocity<br>Acceleration<br>Pressure<br>Temperature<br>Voltage (Battery, Main, Drogue)<br><br><br> |
| 2D Map                        |       | Shows current rocket position on a 2D map using Leaflet. May switch between satellite view and normal view                                                                                                                    | Latitude<br>Longitude                                                                                          |
| 3D Map                        |       | Shows current rocket position in 3D view + rocket model (with orientation) + rocket path                                                                                                                                      | Latitude<br>Longitude<br>Altitude<br>Pitch/Roll/Yaw                                                            |
| Nav Ball<br>(3D Map Feature)  |       | Shows orientation of rocket                                                                                                                                                                                                   | Pitch/Roll/Yaw                                                                                                 |
| Altimeter<br>(3D Map Feature) |       | Simple display of rocket altitude relative to highest point/hard coded point                                                                                                                                                  | Altitude                                                                                                       |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Built With

### Main Desktop Tech Stack
* [![Tech Stack Badge](https://img.shields.io/badge/Tauri-blue?style=for-the-badge&logo=tauri&logoColor=61DAFB)](https://www.electronjs.org) - Application/Backend Framework
	* [![Tech Stack Badge](https://img.shields.io/badge/React-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev) - Frontend Library/Framework
		* [![Tech Stack Badge](https://img.shields.io/badge/Three.JS-red?style=for-the-badge&logo=javascript&logoColor=61DAFB)](https://mui.com) - 3D Library
		* [![Tech Stack Badge](https://img.shields.io/badge/Recharts.js-red?style=for-the-badge&logo=javascript&logoColor=61DAFB)](https://mui.com) - Graph Library
		*  [![Tech Stack Badge](https://img.shields.io/badge/leaflet-red?style=for-the-badge&logo=leaflet&logoColor=61DAFB)](https://mui.com) - Mapping Library
		*  [![Tech Stack Badge](https://img.shields.io/badge/MUI-red?style=for-the-badge&logo=javascript&logoColor=61DAFB)](https://mui.com) - UI Component Library


### Python Webserver Sub Process Tech Stack
* [![Tech Stack Badge](https://img.shields.io/badge/Pyinstaller-blue?style=for-the-badge&logo=python&logoColor=61DAFB)](https://www.electronjs.org) - Python Standalone Binary Builder
	* [![Tech Stack Badge](https://img.shields.io/badge/Pyserial-blue?style=for-the-badge&logo=python&logoColor=61DAFB)](https://react.dev) - Serial Communication Library
	* [![Tech Stack Badge](https://img.shields.io/badge/Websockets-red?style=for-the-badge&logo=python&logoColor=61DAFB)](https://mui.com) - Web Server Library


### Languages
* [![Tech Stack Badge](https://img.shields.io/badge/javascript-green?style=for-the-badge&logo=javascript&logoColor=61DAFB)](https://www.typescriptlang.org/) 
* [![Tech Stack Badge](https://img.shields.io/badge/Rust-green?style=for-the-badge&logo=rust&logoColor=61DAFB)]([https://rust-lang.org/](https://rust-lang.org/)) 
* [![Tech Stack Badge](https://img.shields.io/badge/Python-green?style=for-the-badge&logo=python&logoColor=61DAFB)]([https://rust-lang.org/](https://rust-lang.org/)) 

<p align="right">(<a href="#readme-top">back to top</a>)</p>


# Getting Started (Development)

### Requirements  
- Cargo (Rust package manager)
- Python
- Git

### Components

### Installation (Windows 10/11)

TBD 

For more detailed instructions, see [Documentation (Link to Markdown README in Documentation Folder)](_Documentation/README.md)
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Build Process (Via Github actions)
- 


# Documentation

This project uses [Obsidian](https://obsidian.md) for Markdown file editing. Most documentation for this project is included with the "\_Documentation" folder. Documentation is either in Markdown for text or Draw.io files for diagrams (can be downloaded and imported into Draw.io to read or directly opened in VSCode using extensions). Note that documentation may not always be up to date. All documentation can be found in the \_Documentation folder in this repo.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# License

N/A

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Attributions And Acknowledgements
### Acknowledgements
- [Michael Czomko](https://github.com/AlphaCloudX) - Did the vast majority of GUI styling and basic framework of the project in March 2026. Project forked from his original repo [here](https://github.com/AlphaCloudX/Aerial-Vehicle-Telemetry-Dashboard). 
- Jacky Zhang - Worked on all other features after March 2026.

## Attributions
- ESRI - Free GIS provider (used for satellite view in this software)
- OSM - Open Source Map Provider
- Maptiler (Note: data from them not actually included in repo but was used during comp) - Low Res Satellite imagery in MBTile format for offline use
- Martin (Note: not actually included in repo but was used during comp) - Offline MBTile server hosting solution
### Images
- apogee_symbol.png: WikiMeGa**** @@@-fr Accueil fr:Accueil 06:40, 13 May 2008 (UTC), CC BY-SA 3.0 <http://creativecommons.org/licenses/by-sa/3.0/>, via Wikimedia Commons 
- launch_marker.png: TemplateIcons, CC BY 4.0 <https://creativecommons.org/licenses/by/4.0>, via Wikimedia Commons 
