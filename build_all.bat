REM RUN FILE AFTER ONLY ALL TESTS ARE SUCCESSFUL


REM PYTHON STUFF ----------------------

REM Package Python Buildd
cd Telemetry-Python-Webserver
pyinstaller --add-data="test_data\test-flight-2026-March-modified.csv:./test_data"  --onefile -n webserver_proc-x86_64-pc-windows-msvc webserver.py

REM Place build in target folder (ROOT/Build/Python_Process) (also renames the dep as required by Tauri)
cd dist


robocopy ".\webserver" ".\../../BUILD/Python_Process" /e

REM TAURI STUFF------------------------






pause