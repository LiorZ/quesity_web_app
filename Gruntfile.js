module.exports = function(grunt) {
	
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  connect: {
      server: {
        options: {
          port: 8000,
          base: 'public/.',
        }
      }
    },
    
    express: {
        options: {
         
        },
        dev: {
          options: {
            script: 'app.js',
            args:['--mode' ,'development']
          }
        },
        prod: {
          options: {
            script: 'app.js',
            node_env: 'mode production'
          }
        },
        test: {
          options: {
            script: 'app.js',
            args:['--mode' ,'test_local']
          }
        }
      },
      mochaTest: {
          'test-api': {
            options: {
              reporter: 'spec',
              timeout: 2500000
            },
            src: ['tests/server/*.js']
          }
      }
});

//grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-express-server');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.registerTask('test',['express:test','mochaTest:test-api'])
};