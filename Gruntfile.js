module.exports = function(grunt) {
  'use strict';

  var openCommand = process.platform === 'linux' ? 'xdg-open' : 'open',
      jsFiles = [ 'Gruntfile.js', 'src/**/*.js' ];

  var config = {
    jshint: {
      src: jsFiles,
      options: {
        jshintrc: './.jshintrc'
      }
    },

    jscs: {
      src: jsFiles,
      options: {
        config: './.jscs.json'
      }
    },

    shell: {
      openreports: {
        command: openCommand + ' .plato/index.html'
      }
    },

    plato: {
      scrollwatcher: {
        files: {
          '.plato/': [ 'src/*.js' ]
        }
      }
    },

    babel: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          'dist/loader.js': 'src/loader.js'
        }
      }
    },

    watch: {
      js: {
        files: jsFiles,
        tasks: [ 'babel' ]
      }
    }
  };

  grunt.config.init( config );

  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  grunt.registerTask('lint', [ 'jshint', 'jscs' ] );

  grunt.registerTask('js', [ /* 'lint', */ 'babel' ] );

  grunt.registerTask('report', [ 'plato', 'shell:openreports' ] );

  grunt.registerTask('default', [ 'watch' ] );
};
