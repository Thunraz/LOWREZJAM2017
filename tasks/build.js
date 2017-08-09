'use strict';

let gulp        = require('gulp'),
    rollup      = require('rollup').rollup;

let cache;

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
            cache: cache,
            sourceMap: true,
            external: ['three']
        }).then(function(bundle) {
            return bundle.write({
                dest:  'dist/main.js',
                sourceMap: true,
                format: 'iife',
                globals: {
                    three: 'THREE'
                }
            });
        });
    });
};
