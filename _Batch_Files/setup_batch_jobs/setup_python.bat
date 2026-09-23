REM Setup Python Env
cd ../../Telemetry-Python-Webserver
python -m venv .venv

cd .venv/Scripts
call activate.bat
cd ../..

pip install -r requirements.txt

cd .venv/Scripts
call deactivate.bat
cd ../..