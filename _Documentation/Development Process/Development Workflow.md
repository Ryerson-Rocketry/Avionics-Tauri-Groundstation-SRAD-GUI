Last Updated: Sept 2026

---

The following is the method to work on the application. This does not cover the actual build process (i.e packaging and building the application into something the end user can just launch in a single executable). For that see [Build Process Doc](<Build Process>)

# General Workflow
This workflow should be followed in most cases.

A few things to note:
- Tauri application handles CRUD operations and the frontend
- Python webserver handles the following:
	- "Fake" demo data parsing and transmission to main GUI (for testing GUI without access to radios)
	- Actual serial receiving from radio receiver for actual live GUI use
	- C.S Livestream capturing from serial and transmission to GUI

Normally for the production build (i.e whats actually used for comp), the user only needs to run the main executable which launches everything required.
- However, when actually working on the GUI, it can be impractical/slow to constantly package the python webserver into the main Tauri GUI. Thus, you will require two IDEs to be open to work on the GUI (one for manually launching the python webserver, one for hosting the main GUI)

## Process

### 1. In first IDE (Python Webserver)
- Open your Terminal in .VENV
- Run webserver.py
If changes are made to webserver, simply close and rerun it

### 2. In second IDE (Tauri Application)
- Open Terminal in "Main-Tauri-Application"
- Run the following
``` shell
npm run tauri dev
```
- If changes are made to rust backend, program will automatically restart.
- If changes are made to React frontend, program will "hot reload", however this can cause unintended behaviour (mainly to data receiving from webserver (multiple hooks might be running at once))
	- To be safe, you can do a full restart of application after every frontend change if you want
	- To do so, do "CTRL-C" in terminal then rerun the command above
- NOTE: Always close terminate the application in terminal before closing it, otherwise the process will still be active on the development port which will require you to terminate the process somehow in another way

