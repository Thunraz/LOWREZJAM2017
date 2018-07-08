'use strict';

let clean   = require('gulp-clean'),
    gulp    = require('gulp');

export default () => {
    return gulp
        .src('./dist/*')
        .pipe(clean());
}
