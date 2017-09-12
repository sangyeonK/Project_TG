"use strict";
const gulp = require("gulp");
const browser_sync = require("browser-sync");
let browserSync = browser_sync.create();


gulp.task('default', ['browserSync'], function () {
	gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], {cwd: 'app.web'}, browserSync.reload);
});

gulp.task('browserSync', function () {
	port: 9999,
    browserSync.init({
        server: {
            baseDir: 'app.web'
        },
    });
});
