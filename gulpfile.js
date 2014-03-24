var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    info = require('./package.json'),
    mocha = require('gulp-mocha'),
	webpack = require('webpack'),
	dist = './build',
	jsIndex = './index.js',
	title = info.name,
	author = info.author,
	version = info.version,
	build = Date.now();

/**
 *	Packaging Config
 */
var webpackConfig = {
	cache: true,
	entry: jsIndex,
	output: {
		filename: "observe.min." + build + ".js"
	},
	resolve: {
		modulesDirectories: ['node_modules']
	},
	plugins: [
		new webpack.BannerPlugin(title + '\n' + author + '\n' + version + ':' + build)
	]
};

// Default
gulp.task('default', ['clean'], function() {
    gulp.start('hint', 'test', 'build');
});

// Build Task
gulp.task('build', function() {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.output.path = dist;
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
		if(err) throw new gutil.PluginError('webpack', err);
		gutil.log('[webpack]', stats.toString({
			colors: true
		}));
	});
});

// JSHinting
gulp.task('hint', function() {
  return gulp.src('lib/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Mocha
gulp.task('test', function () {
    gulp.src('./test/specs/*.js')
        .pipe(mocha({reporter: 'nyan'}));
});

// Pre-build cleanup
gulp.task('clean', function() {
  return gulp.src([dist], {read: false})
    .pipe(clean());
});

// Watch task
gulp.task('watch', function() {
	gulp.watch('lib/*.js', function(event) {
		gutil.log('Watch:', 'File ' + event.path + ' was ' + event.type + ', running tasks...');
		gulp.start('hint', 'build', 'test');
	});
});