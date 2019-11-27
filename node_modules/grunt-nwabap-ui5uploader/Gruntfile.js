/*
 * grunt-nwabap-ui5uploader
 * https://github.com/pfefferf/grunt-nwabap-ui5uploader
 *
 * Copyright (c) 2018 Florian Pfeffer
 * Licensed under the Apache-2.0 license.
 */

'use strict';

module.exports = function (grunt) {

    // get user, password and server
    var sUser = grunt.option('user');
    var sPwd = grunt.option('pwd');
    var sServer = grunt.option('server');

    // project config
    grunt.initConfig({
        eslint: {
            target: [
                'Gruntfile.js',
                'tasks/**/*.js',
                'test/*.js'
            ],
            options: {
                configFile: '.eslintrc.json'
            }
        },

        //  test configurations
        nwabap_ui5uploader: {
            options: {
                conn: {
                    server: sServer
                },
                auth: {
                    user: sUser,
                    pwd: sPwd
                }
            },
            upload_webapp: {
                options: {
                    ui5: {
                        package: '$TMP',
                        bspcontainer: 'ZZ_GUI5UP_TMP',
                        bspcontainer_text: 'Test Grunt UI5 upload'
                    },
                    resources: {
                        cwd: 'test/webapp',
                        src: '**/*.*'
                    }
                }
            },
            upload_webapp_empty: {
                options: {
                    ui5: {
                        package: '$TMP',
                        bspcontainer: 'ZZ_GUI5UP_TMP',
                        bspcontainer_text: 'Test Grunt UI5 upload'
                    },
                    resources: {
                        cwd: 'test/webapp_empty',
                        src: '**/*.*'
                    }
                }
            }
        }
    });

    // load tasks
    grunt.loadTasks('tasks');

    // plugins
    grunt.loadNpmTasks('grunt-eslint');

    // register tasks
    grunt.registerTask('test', ['eslint', 'nwabap_ui5uploader:upload_webapp']);
    grunt.registerTask('test_empty', ['eslint', 'nwabap_ui5uploader:upload_webapp_empty']);

    // register default task
    grunt.registerTask('default', ['test']);
};
