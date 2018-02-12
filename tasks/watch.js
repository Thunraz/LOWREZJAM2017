'use strict';

let browserSync = require('browser-sync').create(),
    gulp       = require('gulp'),
    http       = require('http'),
    path       = require('path'),
    st         = require('st');

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

    /*gulp.task('server', (done) => {
        let port = process.env.GULP_PORT || 8080;
        
        http.createServer(
            st({ path: path.join(__dirname, '..', 'dist'), index: 'index.html', cache: false })
        ).listen(port, done);
    });*/
};
