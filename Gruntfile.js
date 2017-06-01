module.exports = function(grunt) {
  grunt.initConfig({

    // Basic PHP server provided by PHP 5
    php: {
      server: {
        options: {
          // Setup a PHP server for the localhost on port 3002
          // Note: this runs the default server that comes with PHP 5
          hostname: '127.0.0.1', port: 3002,

          // Serve all files under the 'public' directory
          base: 'public/',

          // Do NOT open the server index page in a browser when the server starts
          // (we want to open the one proxied by browsersync instead)
          open: false
        }
      }
    },

    // Create a proxy browserSync server for live-reloading
    browserSync: {
  		server: {
        // Files to watch (reloads all browsers when they change)
  			bsFiles: {
  				src: [ 'public/**/*' ]
  			},

  			options: {
          // The server that should be proxied.  All requests are forwarded
          // to and from this server with the browser sync stuff injected.
  				proxy: '<%= php.server.options.hostname %>:<%= php.server.options.port %>',

          // Automatically open the server index page in your default browser when started
  				open: true,

          // Controlling how much stuff to log to the console
  				logLevel: 'info', logConnections: true,

          // Mirror all actions in each connected browser
          // e.g.: It looks like a GHOST is controlling your other browsers!!
  				ghostMode: {
  					clicks: true,
  					scroll: true,
  					links: true,
  					forms: true
  				}
  			}
  		}
  	},
  });

  // Load these grunt task managers as standard NPM packages (configured above)
  grunt.loadNpmTasks('grunt-php');
  grunt.loadNpmTasks('grunt-browser-sync');

  // Register default task to run both configured servers
  grunt.registerTask('default', ['php', 'browserSync']);
};
