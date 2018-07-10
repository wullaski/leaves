module.exports = function (grunt) {
  // Define some variables for watch files
  var srcFiles = [
    '<%= srcDir %>js/app.js',
    '<%= srcDir %>js/fn.js',
    '<%= srcDir %>js/item.js',
    '<%= srcDir %>js/player.js',
    '<%= srcDir %>js/weapon.js',
    '<%= srcDir %>js/room.js',
    '<%= srcDir %>js/program.js'
    ],
    banner = [
        '/**',
        ' * @license',
        ' * <%= pkg.name %> - v<%= pkg.version %>',
        ' * Copyright (c) 2014-<%= grunt.template.today("yyyy") %>, John Woolschlager',
        ' * <%= pkg.homepage %>',
        ' *',
        ' * Compiled: <%= grunt.template.today("yyyy-mm-dd") %>',
        ' *',
        // ' * <%= pkg.name %> is licensed under the <%= pkg.license %> License.',
        // ' * <%= pkg.licenseUrl %>',
        ' */',
        ''
    ].join('\n');
  // Load NPM plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-asciify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    srcDir: 'assets/',
    concat: {
      options: {
          banner: banner
      },
      dist:{
        src: srcFiles,
        dest: '<%= srcDir %>js/script.js'
      }
    },
    less: {
      development: {
        files: {
          "<%= srcDir %>css/style.css": "<%= srcDir %>css/style.less"
        }
      }
    },
    asciify: {
      myBanner: {
        text: 'leaves'
      }
    },
    uglify:{
      options: {
        banner: '/*!\n <%= asciify_myBanner %> \n*/\n'
      },
      all:{
        src:'<%= srcDir %>js/script.js',
        dest:'<%= srcDir %>js/script.min.js'
      }
    },
    watch: {
      styles: {
        files: '<%= srcDir %>css/style.less',
        tasks: 'css_task'
      },
      scripts: {
        files: srcFiles,
        tasks: 'js_task'
      }
    }
  });
  // Registered asks.
  grunt.registerTask('css_task', ['less']);
  grunt.registerTask('js_task', ['concat', 'asciify']);
  grunt.registerTask('default', ['less']);

};