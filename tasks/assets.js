'use strict';

let gulp = require('gulp');

module.exports = () => {
    gulp.task('assets', () => {
        return gulp.src(['src/assets/**/*', '!src/assets/shader/*', '!src/assets/shader'])
            .pipe(gulp.dest('dist/assets/'));
    });
};