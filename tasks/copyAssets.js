'use strict';

let gulp = require('gulp');

export default () => {
    return gulp.src(['src/assets/**/*', '!src/assets/shader/*', '!src/assets/shader'])
        .pipe(gulp.dest('dist/assets/'));
};
