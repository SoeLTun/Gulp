var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')({ lazy: true });
var config = require('./gulp.config')();
var del = require('del');
var port = config.defaultPort;
// var jshint = require('gulp-jshint');
// var jscs = require('gulp-jscs');
//var util = require('gulp-util');
// var gulpprint = require('gulp-print');
// var gulpif = require('gulp-if');


gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function() {
    log('Analyzing less with Auto Prefixer');
    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('less-watcher', function() {
    gulp.watch([config.less], ['styles']);
})

gulp.task('clean-styles', function() {
    var files = config.temp + '**/*.css';
    return clean(files);
});


gulp.task('inject', function() {

});

gulp.task('serve-dev', ['styles'], function() {
    var isDev = true;
    var nodeOptions = {
        script: config.nodeServer, //TODO app.js
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server] // TODO define the file to restart on

    }
    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function(ev) {
            log('** nodemon restarted **');
            log('files changes on restart:\n' + ev);
        })
        .on('start', function() {
            log("nodemon started");
            startBrowserSync();
        })
        .on('crash', function() {
            log("nodemon crashed")
        })
        .on('exit', function() {
            log("nodemon exit")
        });

});

function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    return del(path);
}

function startBrowserSync() {
    if (browserSync.active) {
        return;
    }
    log('Starting browser-sync on port' + port);
    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [config.client + '**/*.*'],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true,
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadedDelay: 1000,

    }
    browserSync(options);
}

/////
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }

}