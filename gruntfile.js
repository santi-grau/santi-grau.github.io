module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    pug: {
      compile: {
        options: {
          data: {
            debug: false,
            page: "main"
          }
        },
        files: {
          "index.html": "app/views/main.pug"
        }
      }
    },
    stylus: {
      compile: {
        options: {
          paths: ['public/css/main.styl'],
          use: [
            require('nib') // use stylus plugin at compile time
          ]
        },
        files: {
          'css/main.css': 'app/css/main.styl'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Build Tasks
  grunt.registerTask('build', [
    'pug',
    'stylus'
  ]);
};