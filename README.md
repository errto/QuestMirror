# QuestMirror
A GUI application with scrcpy for mirroing Oculus Quest. 

<img src="./readmeimg/app_screenshot.png"/>

# Introduction

Oculus Quest can be mirrored using scrcpy, but it takes time for a child or family to easily mirror it.
This app calls scrcpy from Electron for easy mirroring by kids and anyone.

# Install

## Install on Windows

It is better to use the pre-built package of links for easier execution.
Unzip the zip file and click **QuestMirror.exe** in the unzipped folder.

Pre-build: https://github.com/r-asada-ab/QuestMirror/releases/download/v1.1.0/quest-mirror-win32-x64.zip

## Install on Mac

### Prepare installation command

The Mac version requires Homebrew, so install it first.

Go to the Homebrew official site, and there is a download command, so copy it.

https://brew.sh/

You can use this as the installation command is pasted here as well.

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

### Open terminal

After that, paste the above command in the terminal and press enter.

Find Terminal from Application and start it. Terminal is in Utilites of Application.

<img src="./readmeimg/homebrew_install_01.png"/>

<img src="./readmeimg/homebrew_install_02.png"/>

Paste the above command into the terminal.

<img src="./readmeimg/homebrew_install_03.png"/>

Click enter to start the installation. Press Enter again to continue the installation.

<img src="./readmeimg/homebrew_install_04.png"/>

You will be asked for a password, so enter it and wait for a while until it completes.

It can take quite some time, so it's best to do something else.

When the installation is completed and QuestMirror is started, scrcpy and adb will be installed automatically.

See the instructions below for the rest of the operations.

# Instructions

When the application starts, the application downloads scrcpy, so press the OK button.

<img src="./readmeimg/introduction_01.png"/>

Wait for the download to complete.

<img src="./readmeimg/introduction_02.png"/>

Once downloaded, connect Oculus Quest to your PC. At this time, keep Oculus Quest in developer mode.

After connecting Oculus Quest, press the play button to start mirroring.

When performing wireless mirroring, press the radio button labeled Wi-Fi and the app will attempt to connect to Quest. When the connection is complete, disconnect the cable and press the play button to start mirroring.

## Build 

If you want to build it yourself, follow the steps below.

```
git clone git@github.com:r-asada-ab/QuestMirror.git
cd questmirror
npm install
npm start
```

When the app launches, the app first automatically downloads the scrcpy pre-built files from Github(See below).

https://github.com/Genymobile/scrcpy/releases/download/v2.0/scrcpy-win64-v2.0.zip


# Configuration

## crop

Oculus Quest shows a composite of the left and right renders. If you want to see either left or right, check crop and select left or right.

## Max Screen Size

Move the slider to change the screen size. You can select from 512 to 1980.

## FPS

Move the slider to change the FPS. You can select from 5 to 72.

## FullScreen

Check it if you want to perform mirroring in full screen.

## Window Border

Check if you want to erase the window title or button of the application.

## Window Name

If you want to set the window title of the application, put your favorite window title here.

## Capture

If you want to record the mirroring, check it and specify the folder to save the video.

# Licences

* scrcpy
https://github.com/Genymobile/scrcpy  
Apache License 2.0(http://www.apache.org/licenses/LICENSE-2.0)

* LoadinSpinner
https://github.com/ZulNs/LoadingSpinner.js  
MIT License(https://github.com/ZulNs/LoadingSpinner.js/blob/master/LICENSE)
