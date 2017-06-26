UW Stout Web Programming Course: HTML/JS/PHP Project Base
=========================================================

This project provides a base framework for running a local PHP capable server on your computer.  It will serve all the files located in the 'public' directory and automatically refresh any browser viewing those files as you change them.  It is meant to mimic the behavior of a real server without the complexity of installing something like apache, nginx, iis, or some other LMAP/WAMP solution.

Prerequisites
-------------
To use this project you must have the following installed:
- Node and npm
- grunt (installed globally)
- PHP v5 (even if you aren't using php)

Setup and Usage
---------------
Once you have the prerequisites installed, the project can be setup locally as follows:
1. Clone the project to a local folder using git
2. run npm install in the local directory
3. run 'grunt' to start the local server

The standard php server is used to serve the pages on port 3002. This server is proxied through browsersync on port 3000 which is automatically opened in your default browser. Any time you save changes to any files under 'public', the browser will automatically refresh.  Also, if you open the web page in multiple browsers they will all stay in sync. Input is automatically mimicked on the other browsers.

Technologies
------------
This project uses the following technologies:
- node and npm to maintain all dependencies (except PHP)
- grunt to spin up the server, launch browsersync, and monitor files.
- Browsersync to refresh the browser and syncronize multiple browser senssions.

Default configurations are provided for eslint and it is automatically installed when you run 'npm install'. If you use the eslint package for Atom it will automatically lint your JavaScript code as you type.
