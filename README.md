UW Stout Web Programming Course: HTML/JS/PHP Project Base
=========================================================

This project provides a base framework for running a local PHP capable server on your computer.  It will serve all the files located in the 'public' directory and automatically refresh any browser viewing those files as you change them.  It will also monitor the file 'scss/index.scss' and translate it from SCSS to CSS when it is saved.  It is primarily meant to mimic the behavior of a real server without the complexity of installing something like apache, nginx, iis, or some other LAMP/WAMP solution.  It also helps support a modern web programming development environment and modern technologies (like node, SASS, and some of ECMA2015).

Prerequisites
-------------
To use this project you must have the following installed:
- Node and npm
- grunt (installed globally)
- PHP v7 (even if you aren't using php)
- HIGHLY RECOMMENDED: Visual Studio Code

Installing
----------
0. RECOMMENDED FOR WINDOWS: Download and install git for windows to get Bash (https://gitforwindows.org/)
1. Download and install the Microsoft Web Platform Installer (https://www.microsoft.com/web/downloads/platform.aspx)
2. Run the web platform installer, search for PHP 7.4 and install.
3. Download and install the LTS version of node.js (https://nodejs.org/en/download/)
4. Open a bash terminal (in windows, right click any folder and select 'git bash here')
5. run `npm install -g grunt-cli eslint` to install both grunt and eslint 

One Time Setup
--------------
Once you have the prerequisites installed, the project can be setup locally as follows:
1. Download the latest release from the release tab.
2. Unzip the release into a new, empty folder.
2. Open a terminal in that folder (with git bash or visual studio code)
3. run npm install

Development and Usage
---------------------
To work on a project, and make changes:
1. Open a terminal in the project directory (or open it in VS code and bring up the terminal)
2. at the command line, run `grunt` to start monitoring files and running a local server

The standard php server is used to serve the pages on port 3002. This server is proxied through browsersync on port 3000 which is automatically opened in your default browser. Any time you save changes to any files under 'public', the browser will automatically refresh (using some JavaScript/Web Sockets magic).  Also, if you open the web page in multiple browsers they will all stay in sync. Input is automatically mimicked on the other browsers (again, web sockets magic).

Technologies
------------
This project uses the following technologies:
- node and npm to maintain all dependencies (except PHP)
- grunt to spin up the server, launch browsersync, and monitor files.
- Browsersync to refresh the browser and synchronize multiple browser sessions.
- node-sass (via grunt-sass) to compile SCSS files to their CSS equivalent.

Default configurations are provided for eslint and it is automatically installed when you run 'npm install'. If you use the eslint package for Atom or VS Code it will automatically lint your JavaScript code as you type.
