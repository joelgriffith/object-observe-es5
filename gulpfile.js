//////////////////////////////////////
// Build Dependencies
//
// These are dependencies for the build
// process, and you're free to remove
// dependencies you're not using.
//////////////////////////////////////
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    info = require('./package.json'),
	webpack = require('webpack');

//////////////////////////////////////
// Location Abstractions
//
// These are abstractions for your
// project. Things such as build
// directories and banner comments
// are retrieved from these variables.
//////////////////////////////////////

	// Source Code Directory
	var base = './',

	// Dev build location to output
	dev = './build/dev',

	// Dist build location to output
	dist = './build/dist',

	// JS directory (for watch and hinting)
	js = base + '/lib',

	// Entry point for your JS app (builds look only at this)
	jsIndex = './index.js',

	// Package title for your comment banners in JS and CSS
	title = info.name,

	// Author title for our comment banners in JS and CSS
	author = info.author,

	// Version information for your comment banners in JS and CSS
	version = info.version,

	// Build# for your comment banners in JS and CSS
	build = Date.now();

//////////////////////////////////////////////
// Webpack Config (JS Compiling/Modules)
//
// Responsbile for compiling JS. Uses
// the Webpack build system for compilation,
// which can build from AMD or CommonJS
// modules.
//////////////////////////////////////////////
var webpackConfig = {
	cache: true,
	entry: jsIndex,
	output: {
		filename: "index.js"
	},
	resolve: {
		modulesDirectories: ['node_modules']
	},
	plugins: [
		new webpack.BannerPlugin(title + '\n' + author + '\n' + version + ':' + build)
	]
};

//////////////////////////////////////
// Task Mapping
//
// Gulp task abstractions happen here.
// Feel free to move things around to
// suite your needs.
//////////////////////////////////////
gulp.task('default', ['clean'], function() {
    gulp.start('hint', 'webpack:dev', 'webpack:dist', 'styles:dev', 'styles:dist', 'images:dev', 'images:dist', 'html:dev', 'html:dist');
});
gulp.task('build:dev', ['clean'], function() {
    gulp.start('hint', 'webpack:dev', 'styles:dev', 'images:dev', 'html:dev');
});
gulp.task('build:dist', ['clean'], function() {
    gulp.start('hint', 'webpack:dist', 'styles:dist', 'images:dist', 'html:dist');
});

//////////////////////////////////////
// JavaScript Tasks
//
// All JavaScript tasks here. This
// includes building Dist and Dev
// JS and hinting as well
//////////////////////////////////////

// JS packaging for distribution
gulp.task('webpack:dist', function() {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.output.path = dist + '/js';
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:dist', err);
		gutil.log('[webpack:dist]', stats.toString({
			colors: true
		}));
	});
});

// JS packaging for development
gulp.task('webpack:dev', function() {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.output.path = dev + '/js';
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	);
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:dev', err);
		gutil.log('[webpack:dev]', stats.toString({
			colors: true
		}));
		return gulp.src(dev);
	});
});

// JSHinting
gulp.task('hint', function() {
  return gulp.src(js + '/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

//////////////////////////////////////
// Cleanup Tasks
//
// Clean will just delete all files in
// /dev and /dist to ensure old
// files are removed.
//////////////////////////////////////
gulp.task('clean', function() {
  return gulp.src([dist, dev], {read: false})
    .pipe(clean());
});

//////////////////////////////////////
// Watching Tasks
//
// Gulp watch is built here. Looks
// at all .js and .scss files as well
// as images. New files will require a
// restart of the `gulp watch` command.
//////////////////////////////////////
gulp.task('watch', function() {

	// Watch .js files
	gulp.watch(base + '*.js', function(event) {
		gutil.log('Watch:', 'File ' + event.path + ' was ' + event.type + ', running tasks...');
		gulp.start('hint', 'webpack:dev');
	});
});