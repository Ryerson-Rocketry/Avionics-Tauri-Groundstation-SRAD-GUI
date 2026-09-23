REM see https://stackoverflow.com/questions/18309941/what-does-it-mean-by-command-cd-d-dp0-in-windows for use of /d %~dp0

cd setup_batch_jobs
call setup_python.bat

cd /d %~dp0
cd setup_batch_jobs
call setup_python_executable.bat

cd /d %~dp0
cd setup_batch_jobs
call setup_tauri.bat

PAUSE