REM RUN THIS FILE AFTER ALL TESTS ARE SUCCESSFUL (OR NOT IF NOT ACTUALLY BUILDING FOR RELEASE)
cd ..

REM PYTHON STUFF ----------------------

REM Package Python Build (Also renames file according to what tauri wants (name-target_platform))
cd Telemetry-Python-Webserver
pyinstaller --add-data="test_data\test-flight-2026-March-modified.csv:./test_data"  --onefile -n webserver_proc-x86_64-pc-windows-msvc webserver.py

REM Place build in tauri src folder
cd dist
copy ".\webserver_proc-x86_64-pc-windows-msvc.exe" ".\../../Main-Tauri-Application/src-tauri/binaries"

REM TAURI STUFF------------------------

cd ../../Main-Tauri-Application

call npm run tauri build

REM  e = subdirectories as well, y = overwrite all, echo D| ensure it is copying to directory
echo D|xcopy ".\src-tauri\target\release" ".\../_BUILD/" /e /y



pause