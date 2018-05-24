module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt,{
    sasslint: 'grunt-sass-lint',
    sass: 'grunt-sass',
    complexity: 'grunt-complexity-report'
  });

  var taskConfig = {};
  taskConfig.pkg = grunt.file.readJSON('package.json');

  var dirs = {
    "target": "target",
    "build": "target/build",
    "tmp": "target/tmp",
    "src": "src",
    "reports": "target/reports"
  };

  taskConfig.clean = {
    target : {
      src : dirs.target
    }
  };

  // templates copy
  taskConfig.copy = {
    libs : {
      files : [{ cwd: dirs.src, src: ['lib/**/*.*'], dest: dirs.build, expand: true}]
    },
    templates: {
      files : [{ cwd: dirs.tmp, src: ['**/pug/*.js'], dest: dirs.tmp, expand: true}],
      options: {
        process: function (content) {
          return content + '\ntry{module.exports = template;}catch(e){}';
          //return content + '\nexport default template';
        }
      }
    }
  };

  // TEMPLATES
  taskConfig.pug = {
    pug : {
      files : [{ cwd: dirs.src, src: ['**/*.pug'], dest: dirs.tmp, expand: true, ext: '.pug.js'}],
      options : {
        client : true,
        compileDebug: false,
        inlineRuntimeFunctions: false,
        namespace : false
      }
    }
  };

  // CSS

  // lint

  var sassLintOptions = {
    configFile: '.sass-lint.yml'
  };
  taskConfig.sasslint = {
    allFiles: [
      dirs.src + '/**/*.scss'
    ],
    options: sassLintOptions
  };

  // sass

  taskConfig.sass = {
    allFiles: {
      files : [{ cwd: dirs.src, src: ['**/*.scss'], dest: dirs.build, expand: true, ext : '.css'}],
      options: {
        includePaths: ['node_modules/'],
        sourceMap: true,
        sourceMapContents: true,
        outputStyle: 'compressed'
      }
    }
  };

  // JS

  // lint

  taskConfig.jshint = {
    tests:{
      src:['Gruntfile.js']
    },
    js:{
      options : {
        jshintrc : 'error.jshintrc'
      },
      src: [
        dirs.src + '/**/*.js'
      ]
    },
    warnings:{
      options : {
        jshintrc : 'warn.jshintrc',
        reporter : 'checkstyle',
        reporterOutput : dirs.reports + '/jshint-warn.xml',
        force: true
      },
      src: [dirs.src + '/**/*.js']
    }
  };

  var istanbul = require('browserify-istanbul');
  var pugify = require('pugify');
  var karmaPreProcessors = {};
  karmaPreProcessors[dirs.src+'/!(lib)/**/*.js'] = ['browserify'];
  karmaPreProcessors[dirs.src+'/**/pug/*.*'] = ['browserify'];
  var karmaReporters = ['progress','coverage'];
  var karmaCoverageReporters = [
    {type: 'lcov', subdir: '.'},
    {type: 'text', subdir: '.'}
  ];
  taskConfig.karma = {
    unit: {
      options: {
        browsers: ['ChromeHeadless'],
        browserify: {
          debug: !!grunt.option('debug'),
          transform: [
            ['babelify', {
              plugins: [
                ['istanbul',{exclude:['**/test/*.*']}] /*,
                'rewire'*/
              ],
              presets: ['es2015']
            }],
            pugify.pug({
              basedir: './../',
              client : true,
              compileDebug: true,
              inlineRuntimeFunctions: false,
              namespace : false,
              doctype: 'html'
            }),
            istanbul({ignore:['**/test/*.*'],instrumenterConfig: { embedSource: true }})/*, 'rewireify'*/]
        },
        frameworks: ['mocha','sinon-chai','browserify'],
        files: ['test-deps.js',dirs.src+'/**/*.js',dirs.src+'/**/pug/*.*'],
        exclude: [dirs.src+'/lib/**/*.*'],
        singleRun: true,
        failOnEmptyTestSuite: false,
        plugins:[
          'karma-mocha',
          'karma-coverage',
          'karma-chrome-launcher',
          'karma-browserify',
          'karma-sinon-chai'
        ],
        browserConsoleLogOptions: {
          level: 'log',
          format: '%b %T: %m',
          terminal: true
        },
        client : {
          mocha : {
            ui: 'bdd'
          }
        },
        preprocessors: karmaPreProcessors,
        reporters: karmaReporters,
        junitReporter: {
          outputDir: dirs.reports + '/test-results'
        },
        coverageReporter : {
          dir : dirs.reports,
          reporters : karmaCoverageReporters,
          check: {
            global: {
              statements: 0,
              branches: 0,
              functions: 0,
              lines: 0
            }
          }
        },
        logLevel: grunt.option('debug') ? 'DEBUG' : 'INFO',
        browserNoActivityTimeout: 100000
      }
    }
  };

  taskConfig.jscpd = {
    jscpd: {
      path: dirs.src,
      exclude: '**/test/**.*',
      output : dirs.reports + '/jscpd.xml'
    }
  };

  // compile
  taskConfig.browserify = {
    options: {
      browserifyOptions: {
        debug: true
      },
      transform: [
        ["babelify", {presets: ['es2015']}]
      ]
    },
    js : {
      files : [{ cwd: dirs.src, src: ['**/js/*.js'], dest: dirs.tmp, expand: true}]
    },
    jsdev : {
      files : [{ cwd: dirs.src, src: ['**/js/*.js'], dest: dirs.build, expand: true, ext : '.min.js'}]
    }
  };

  // minify
  taskConfig.uglify = {
    pug : {
      files : [{ cwd: dirs.tmp, src: ['**/pug/*.js'], dest: dirs.build, expand: true}]
    },
    js : {
      files : [
        { cwd: dirs.tmp, src: ['**/js/*.js'], dest: dirs.build, expand: true, ext : '.min.js'}
      ],
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        sourceMapIn: function(src) {
          if(grunt.file.exists(src+'.map')) {
            return src + '.map';
          }
        }
      }
    }
  };

  // exorcise
  taskConfig.exorcise = {
    exorcise: {
      files : [{ cwd: dirs.tmp, src: ['**/js/*.js'], dest: dirs.tmp, expand: true, ext: '.js.map'}]
    }
  };

  // document
  taskConfig.jsdoc = {
    dist: {
      src: [
        dirs.src + '/**/*.js'
      ],
      options: {
        configure : 'jsdoc.conf.json',
        destination: dirs.reports + '/doc'
      }
    }
  };

  taskConfig.watch = {
    css: {
      files: ['src/**/*.scss'],
      tasks: ['sass']
    },
    js: {
      files: ['*.js','src/**/*.js'],
      tasks: ['jsdev']
    }
  };

  grunt.initConfig(taskConfig);

  grunt.registerTask('templates', ['pug','copy','uglify:pug']);
  grunt.registerTask('css', ['sasslint', 'sass']);
  grunt.registerTask('test',['jshint','karma','jscpd']);
  grunt.registerTask('js',['browserify:js','exorcise','uglify:js']);
  grunt.registerTask('jsdev',['browserify:jsdev']);
  grunt.registerTask('default', ['clean','templates','test','css','js', 'jsdoc']);
};
