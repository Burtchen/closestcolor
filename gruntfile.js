var webpack = require('webpack');

module.exports = function (grunt) {
    var path = require('path');
    grunt.initConfig({
        watch: {
            react: { // TODO: Update this
                files: 'js/**/*.js',
                tasks: ['webpack', 'cssmin'],
            },
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'build/closestcolor.css': ['assets/normalize.css', 'assets/stylesheet.css']
                }
            },
        },
        webpack: {
            closestcolor: {
                entry: ['./js/main'],
                output: {
                    filename: 'build/closestcolor.js'
                },
                module: {
                    loaders: [
                        {
                            test: /\.json$/,
                            loader: "json-loader"
                        },
                        {
                            test: /\.js$/,
                            loader: 'babel-loader',
                            query: {
                                presets: ['es2015', 'react']
                            }
                        },
                        {
                            test: require.resolve("react"),
                            loader: "expose?React"
                        },
                    ]
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compressor: {
                            warnings: false,
                        },
                    }),
                    new webpack.DefinePlugin({
                        'process.env': {
                            'NODE_ENV': JSON.stringify('production')
                        }
                    })
                ],
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.registerTask('default', ['webpack', 'cssmin']);
};
