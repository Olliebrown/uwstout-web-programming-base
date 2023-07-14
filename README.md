BIG DATABASE UPDATE
===================
As of July 14th, 2023 this project now includes everything you need to setup and test a MySQL database locally on your own machine. You will need to install the server yourself (instructions below) and then run `npm run createDB` to load testing data into the database and create a special account for use with PHP.  After that, the files under dbExample should work for exploring your own database.

UW Stout Web Programming Course: HTML/JS/PHP Project Base
=========================================================
This project provides a framework for running a local PHP capable server on your computer.  It will serve all the files located in the 'public' directory.  It can also monitor the file 'scss/index.scss' and translate it from SCSS to CSS when it is saved.  It is primarily meant to mimic the behavior of a real server without the complexity of installing something like apache, nginx, iis, or some other LAMP/WAMP solution.  It also helps support a modern web programming development environment and modern technologies (like node, SASS, and some of ECMA Next).

Prerequisites
-------------
To use this project you must have the following installed:
- Node and npm
- PHP v8 (only if using PHP)
- A local MySQL-compatible server (MariaDB recommended; only if using the database examples)
- HIGHLY RECOMMENDED: Visual Studio Code and Git for Windows

Install Prerequisites
---------------------
0. RECOMMENDED FOR WINDOWS: Download and install git for windows to get Bash (https://gitforwindows.org/)
1. Download and install PHP v8 ([https://windows.php.net/downloads/releases/php-8.2.7-Win32-vs16-x64.zip](https://windows.php.net/downloads/releases/latest/php-8.2-Win32-vs16-x64-latest.zip))
    - Need to extract the zip file to a folder and add that folder to your PATH environment variable.
3. Download and install the LTS version of node.js (https://nodejs.org/en/download/)
4. For using the database examples: Install a MySQL server
    - MariaDB is recommended (https://mariadb.org/download/?t=mariadb&p=mariadb&r=10.11.4&os=windows&cpu=x86_64&pkg=msi&m=gigenet)
    - Grab the latest Long Term Service release for your OS (10.11 currently)

One Time Setup
--------------
Once you have the prerequisites installed, the project can be setup locally as follows:
1. Download the latest release from the release tab.
2. Unzip the release into a new, empty folder.
2. Open a terminal in that folder (with git bash or visual studio code)
3. run npm install

Database Setup
--------------
To run the examples and complete Database related homework, you must set up data in your local database.
1. After installing MariaDB (or similar) be sure to open `example.env` and follow the instructions inside
   - You must update DB_PASSWORD to match your root user account password (set during install of the database)
2. Run `npm run createDB` to create the missing databases and a special user for use with PHP
3. Look at `dbUser.txt` for your username and password (which is different for everyone)
4. Copy the password into `public/dbExamples/php/database.php` (look around line 8)
5. Startup the PHP-compatible server with `npm run server` and visit http://localhost:3000/dbExamples/simpsonsDB.html

Development and Usage
---------------------
To work on a project:
1. Open the folder in your favorite editor (VS code recommended)
2. Get a command prompt (either via a built-in terminal in your editor or git bash)

If you do not require PHP support:

3. At the terminal command prompt, run `npm run clientServer:dev` to start monitoring files and serving the pages.
4. Open a browser and go to http://localhost:3000/ to view the pages contained in the 'public' directory.

If you do not require PHP support AND you don't need a server:

3. At the terminal command prompt, run `npm run client:dev` to start monitoring files and rebuilding them when you save.
4. You will need to serve the public directory on your own

If you DO need PHP support:

3. At the terminal command prompt, run `npm run server` to serve files from the 'public' directory using PHP.
4. Open a browser and go to http://localhost:3000/ to view the pages contained in the 'public' directory.
5. If you also want to monitor and regen the client files, open another terminal and run `npm run client:dev`

Technologies
------------
This project uses the following technologies:
- node and npm to maintain all dependencies (except PHP)
- node-sass (via esbuild) to compile SCSS files to their CSS equivalent.
- The built-in testing server from php for running PHP files.
- The mariadb node.js driver for building the example databases.

Default configurations are provided for eslint and it is automatically installed when you run 'npm install'. If you use the eslint package for VS Code it will automatically lint your JavaScript code as you type.
