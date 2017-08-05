'use strict';

let gulp        = require('gulp'),
    rename      = require('gulp-rename'),
    rollup      = require('rollup').rollup;

module.exports = () => {
    gulp.task('copy-dependencies', () => {
        return gulp
            .src([
                './node_modules/three/build/three.js'
            ])
            .pipe(gulp.dest('./dist/'))
    });

    gulp.task('build', ['copy-dependencies'], (callback) => {
        return rollup({
            entry: 'src/js/main.js',
            sourceMap: true,
            external: ['three']
        }).then(function(bundle) {
            return bundle.write({
                dest:  'dist/main.js',
                format: 'iife',
                globals: {
                    three: 'THREE'
                }
            });
        });
    });
};
