module.exports = function(grunt) {
  'use strict';

  var openCommand = process.platform === 'linux' ? 'xdg-open' : 'open';

  var config = {

    eslint: {
      options: {
        configFile: './.eslintrc'
      },
      target: [ 'src/loader.js' ]
    },

    jscs: {
      src: [ 'src/loader.js' ],
      options: {
        config: './.jscs.json',
        esnext: true
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
        files: [ 'src/loader.js' ],
        tasks: [ 'babel' ]
      }
    }
  };

  grunt.config.init( config );

  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  grunt.registerTask('lint', [ 'eslint', 'jscs' ] );

  grunt.registerTask('js', [ 'lint', 'babel' ] );

  grunt.registerTask('report', [ 'plato', 'shell:openreports' ] );

  grunt.registerTask('default', [ 'watch' ] );
};
