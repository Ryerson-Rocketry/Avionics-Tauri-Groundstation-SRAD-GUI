REM PYTHON STUFF ----------------------

REM Package Python Build (Also renames file according to what tauri wants (name-target_platform))
cd ../../Telemetry-Python-Webserver

cd .venv/Scripts
call activate.bat
cd ../..

pyinstaller --add-data="test_data\test-flight-2026-March-modified.csv:./test_data"  --onefile -n webserver_proc-x86_64-pc-windows-msvc webserver.py

cd .venv/Scripts
call deactivate.bat
cd ../..

REM Place build in tauri src folder (tauri itself will automatically include this binary in its own buildd)
cd dist
copy ".\webserver_proc-x86_64-pc-windows-msvc.exe" ".\../../Main-Tauri-Application/src-tauri/binaries"

