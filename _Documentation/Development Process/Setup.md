Last Updated: Sept 2026

---

Please note that I have verified these setup instructions by following the same steps in a windows VM. If you are stuck, please ask in the Avionics Groundstation chat on Discord for help.

# Notes Before Proceeding

## OS and Development Environment
- These steps are only for windows 10/11. If you don't use Windows then figure out how to get it to work on your own i guess.
- Preferable if you use Visual Studio Code, but anything else works fine if it can show rust/python/java script syntax.
- NOTE: you'll need at least 10 GB of free space on wherever you install the project to.

### Mandatory 
This application uses the following:
- Rust + Cargo (package manager) 
	- Requires Visual C++ installed as well
- Python + pip (package manager)
- Node
- Git
	- Note: Do this yourself if you don't have, should be basic to install (google it bruh)
	- Note: some steps below assume you are using Github Desktop, feel free to use some other means of using git (i.e CLI) 

There are further packages and dependencies. however, the above 3 are required by you to be manually installed (due to these being package managers/runtime environments).

### Optional
There are other optional requirements (not required, if you need them they will be given to you):
- Martin Map Server - NOT DIRECTLY USED IN APPLICATION, only needed for comp so that map data in the format needed by the maps in this application can be used without internet access
	- In the future this may be integrated directly into application however.
- FFmpeg - If you don't care for C.S livestream, then FFmpeg does not technically need to be installed.




---
# Prereqs
You MUST have the following 3 steps done to proceed (can ignore steps from which you have already have installed from previous projects and what not)

## 1. Rust + Cargo
### C++ Prereq (Skip if you already have C++ build tools)
![](../_Images/Pasted%20image%2020260922155928.png)
- Download "Build Tools for Visual Studio 2026" Under "Tools for Visual Studio" here https://visualstudio.microsoft.com/downloads/
	- NOTE: you not actually installing the VS IDE here (though you can if you want), all we need is the C++ linkers and libraries that Rust requires.
- Run installer and continue
- When you get to the page shown below, select "Desktop development with C++", then click install
![](../_Images/Pasted%20image%2020260922155807.png)
-  Wait for installation (only actually 1.67 GB download, should not take too long)

### Actual Rust Installation
- Download "rustup-init.exe" from [https://rustup.rs/](https://rust-lang.org/tools/install/)
- Run it and follow instructions (Literally just enter 1 in console and wait)
![](../_Images/Pasted%20image%2020260922160528.png)
- This should install rust and cargo on your system successfully
- Check installation with the following in terminal (outputs your rust/cargo version if installed right)
``` bash
rustc --version
```

## 2. Node
- Download either the .MSI or .zip from https://nodejs.org/en/download
	- Ensure its for Windows and x64
- Run it and follow instructions (default settings are fine (just keep clicking next))
- Node.js should be installed
- Check installation with the following in terminal (outputs your nodejs version if installed right)
``` bash
node -v
```


## 3. Python + Pip
- Download Python from here (preferably 3.14, but 3.12-3.15 should be fine too): https://www.python.org/downloads/release/pymanager-263/
- Run installer (either MSI or MSIX installer version)
- Check installation with the following in terminal (outputs your python version if installed right)
``` bash
python
```


---
# Project Installation (Automatic (RECOMMENDED) - Batch Files)
This is the recommended way personally cause while its not that complicated overall, there's still a lot of steps to do. You must manually clone the repo, then from there you will run a batch file that calls multiple other batch files that automatically executes project setup

## Clone Repo
1. Clone the repo (NOTE: can be done however you want, follow the below if you don't know how)
	1. Enter Github Desktop
	2. Enter Clone Repo (Via. URL) menu
	3. Copy Following in URL: https://github.com/Ryerson-Rocketry/Avionics-Tauri-Groundstation-SRAD-GUI.git
	4. Use whichever path you want
	5. Wait for cloning to finish
 ![](../_Images/Pasted%20image%2020260922173048.png)

## Run Batch File
![](../_Images/Pasted%20image%2020260922210624.png)
Run the batch file in project folder under "\_Batch_File/firsttime_setup.bat"
- This is literally the same EXACT steps as below (in manual setup) but automated
- NOTE: if the terminal is stuck for a while, just click inside and press enter
	- If still stuck, ask in discord for help


---
# Project Installation (MANUAL)
Preferably you'd do these in the integrated terminal in VSC + Github Desktop but you can obviously use smth use

The following steps are required:
1.  Clone Repo
2. Setup Python Webserver companion process
	1. Setup Venv
	2. Install packages
	3. Build Executable for Tauri
3. Setup Main Tauri Application

## Clone Repo
1. Clone the repo (NOTE: can be done however you want, follow the below if you don't know how)
	1. Enter Github Desktop
	2. Enter Clone Repo (Via. URL) menu
	3. Copy Following in URL: https://github.com/Ryerson-Rocketry/Avionics-Tauri-Groundstation-SRAD-GUI.git
	4. Use whichever path you want
	5. Wait for cloning to finish
 ![](../_Images/Pasted%20image%2020260922173048.png)

## Setup Python Webserver
NOTE: we will be using the webserver in [Venv](https://docs.python.org/3/library/venv.html) , For obvious reasons this can be done in the terminal but out of convenience we will simply use VSC to do it:

### Setup VENV
1. Open Python Webserver Folder in VSC
![](../_Images/Pasted%20image%2020260922180053.png)
2. Open any .py file (i.e webserver.py)
3. Bottom right panel, click on your Python version (in my case, Python 3.14.7)
![](../_Images/Pasted%20image%2020260922180152.png)
4. Click on "Create Virtual Environment"
 ![](../_Images/Pasted%20image%2020260922180212.png)
5. Click Quick Create
You'll know VENV environment was setup correctly if venv shows up in the environment on bottom right and venv folder created on top left
![](../_Images/Pasted%20image%2020260922180712.png)
NOTE: VSC will conveniently automatically enter the VENV on every new integrated terminal when in the webserver folder. 

### Install Python Libraries to VENV
NOTE, this is only if requirements were not automatically done in prev step
1. enter VENV in the "Python Webserver" Folder in terminal. Run the following:
```shell
pip install -r requirements.txt
```
This will install all packages specified in the "requirements.txt" file.

### Build Temporary Webserver Executable For Tauri
Tbh just run this file in the root folder, otherwise might be confusing:
![](../_Images/Pasted%20image%2020260923151603.png)

## Setup Main Tauri Application
1. go to root folder in terminal. Run the following:
``` bash
cd Main-Tauri-Application 
npm install
```
- First command changes directory into the Tauri application
- Second command installs react and other dependencies

NOTE: if you get a "npm.ps1 cannot be loaded because running scripts is disabled on this system" error, open powershell as admin and run the following:
``` shell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Should be safe but if you still don't trust this then just revert it afterwards from RemoteSign

# Conclusion
If you've made it this far congrats. You've setup everything properly. please see LINK for actually running development builds