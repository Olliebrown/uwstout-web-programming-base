const sass = require('node-sass')
const path = require('path')

module.exports = function (grunt) {
  grunt.initConfig({

    // Translate SASS to CSS using node-sass (a native sass compiler)
    sass: {
      options: {
        // Pass in the sass parser to use
        implementation: sass,
        // Set the output to be very human readable
        // (change to 'compressed' for a minimized file)
        outputStyle: 'expanded'
      },
      dist: {
        // Will translate index.scss in the scss folder only
        // - generates public/index.css
        files: {
          'public/sassStyle.css': 'scss/sassStyle.scss'
        }
      }
    },

    // Task to watch files in the 'scss' directory and trigger sass when they change
    watch: {
      css: {
        files: 'scss/*.scss',
        tasks: ['sass']
      }
    },

    // Basic PHP server provided by PHP 5
    php: {
      server: {
        options: {
          // Setup a PHP server for the localhost on port 3002
          // Note: this runs the default server that comes with PHP 5
          hostname: '127.0.0.1',
          port: 3002,

          // Serve all files under the 'public' directory
          base: path.resolve(__dirname, 'public/'),

          // Do NOT open the server index page in a browser when the server starts
          // (we want to open the one proxied by browsersync instead)
          open: false,

          // Extra php.ini configuration options to make it behave more like a
          // normal php server.
          directives: {
            error_reporting: 'E_ERROR | E_WARNING | E_PARSE | E_NOTICE | E_STRICT',
            display_errors: '0',
            'cli_server.color': '1'
          }
        }
      }
    },

    // Create a proxy browserSync server for live-reloading
    browserSync: {
      server: {
        // Files to watch (reloads all browsers when they change)
        bsFiles: {
          src: ['public/**/*']
        },

        options: {
          // Let browsersync know that there is also a watch task that it should run
          // (without this, the Sass files would not get automatically translated)
          watchTask: true,

          // The server that should be proxied.  All requests are forwarded
          // to and from this server with the browser sync stuff injected.
          proxy: '<%= php.server.options.hostname %>:<%= php.server.options.port %>',

          // Automatically open the server index page in your default browser when started
          open: true,

          // Controlling how much stuff to log to the console
          logLevel: 'info',
          logConnections: true,

          // Mirror all actions in each connected browser
          // e.g.: It looks like a GHOST is controlling your other browsers!!
          ghostMode: {
            clicks: true,
            scroll: true,
            links: true,
            forms: true
          },

          // Register any callbacks for browsersync
          callbacks: {
            // This callback runs when the BS instance is finished initializing
            ready: function (err, bs) {
              // Handle any init error received
              if (err) {
                console.error('ERROR: Browsersync failed to initialize')
                console.error(err)
                process.exit(1)
              }

              // If Browsersync bound to a different port, that means it
              // is likely already running so don't start another one.
              if (bs.options.get('port') !== 3000) {
                console.error('ERROR: Port 3000 not available. Is your local server already running?')
                console.error('Please kill any process named \'node\' in your task manager and try again.')
                process.exit(1)
              }
            }
          }
        }
      }
    }
  })

  // Load these grunt task managers as standard NPM packages (configured above)
  grunt.loadNpmTasks('grunt-php')
  grunt.loadNpmTasks('grunt-browser-sync')
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Register default task to run both configured servers
  grunt.registerTask('default', ['sass', 'php', 'browserSync', 'watch'])
}
