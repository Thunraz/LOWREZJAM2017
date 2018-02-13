'use strict';

let browserSync = require('browser-sync').create(),
    gulp       = require('gulp'),
    path       = require('path');

module.exports = () => {
    gulp.task('watch', ['server'], () => {
        return gulp.watch(
            ['src/js/**/*.js', 'src/sass/**/*.s?ss', 'src/index.pug', 'src/assets/*', 'src/assets/**/*'],
            ['build', 'css', 'template', 'assets', 'reload-browser']
        );
    });

    gulp.task('server', function() {
        browserSync.init({
            server: {
                baseDir: path.join(__dirname, '..', 'dist')
            }
        });
    });

    gulp.task('reload-browser', function() {
        browserSync.reload();
    });
};
