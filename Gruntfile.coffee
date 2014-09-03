path = require("path")

module.exports = (grunt) ->
  grunt.initConfig 
    pkg: grunt.file.readJSON('package.json')

    build:
      src: 'app',
      dest: 'public'
      tmp: 'tmp'
      release: 'release'
    
    coffeelint:
      files:
        src: ['<%=build.src%>/js/**/*.coffee']
      options:
        max_line_length:
          value: false
          level: "warn"
        no_trailing_whitespace:
          value: true
          level: false
          
    
    less:
      compile:
        #options:
        #  paths: ['<%=build.src%>/css/']
        files:
          '<%=build.dest%>/landing.css': ['<%=build.src%>/css/landing.less']
      build:
        #options:
        #  compress: true
        files:
          '<%=build.release%>/<%=pkg.name%>.css': ['<%=build.src%>/css/landing.less']
          
    watch:
      scripts:
        files: ['<%=build.src%>/js/**/*.coffee', "<%=build.src%>/css/**/*.less"]
        tasks: ['compile']
      options:
        nospawn: true

    browserify:
      main:
        src: ['<%=build.src%>/js/**/*.coffee']
        dest: '<%=build.dest%>/main.js'
        options:
          debug: true
          transform: ['caching-coffeeify']
      specs:
        src: ['spec/<%=pkg.name%>_spec.js']
        dest: 'spec/<%=pkg.name%>_spec.js'
        options:
          debug: true

    uglify:
      build:
        files:
          '<%=build.release%>/<%= pkg.name %>.js': ['<%=build.dest%>/main.js']

    express:
      options: 
        port: process.env.PORT
      livereload:
        options:
          server: path.resolve('./server/index.coffee')
          #livereload: true
          #serverreload: true
          #bases: [path.resolve('./public')]
          
    jasmine:
      src: '<%=build.dest%>/js/*.js',
      options:
        specs: 'spec/*_spec.js'
        helpers: 'spec/helpers/*.coffee'


  # load plugins
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-express'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-coffeelint'

  # tasks
  grunt.task.registerTask 'clean', 'clears out temporary build files', ->
    grunt.file.delete grunt.config.get('build').tmp

  grunt.registerTask 'default', ['compile', 'watch']
  grunt.registerTask 'lint', ['coffeelint']
  grunt.registerTask 'compile', ['browserify:main', 'less:compile']
  grunt.registerTask 'build', ['browserify:main', 'uglify', 'less:build']
  grunt.registerTask 'spec', ['compile', 'browserify:specs', 'jasmine']