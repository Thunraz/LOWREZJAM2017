'use strict';

let colors  = require('ansi-colors'),
    clean   = require('gulp-clean'),
    flog    = require('fancy-log'),
    gulp    = require('gulp'),
    through = require('through2'),
    uglify  = require('gulp-uglify-es').default,
    zip     = require('gulp-zip');

function minifyJS() {
    return gulp
        .src('dist/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/temp'));
};

function copyDistFiles() {
    return gulp
        .src([
            './dist/*.css',
            './dist/index.html',
            './dist/assets/**/*'
        ], { base: 'dist' })
        .pipe(gulp.dest('dist/temp/'));
}

function createZip() {
    return gulp
        .src(['./dist/temp/*', './dist/temp/**/*'])
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('dist'))
        .pipe(getZipSize());
}

function deleteTempDir() {
    return gulp
        .src('./dist/temp')
        .pipe(clean());
}

function getZipSize(inKib) {
    return through.obj(function(file, encoding, callback) {
        let filenameShort = file.path.split(/\/|\\/).pop();

        // Check if we're dealing with a file or a buffer
        let byteSize = file.stat ? file.stat.size : Buffer.byteLength(String(file.contents));
        
        let formattedSize = byteSize;
        if(inKib === true) {
            formattedSize /= 1024;
        }
        formattedSize = formattedSize.toLocaleString();
        formattedSize += inKib ? ' KiB' : ' B';

        flog('Size', colors.cyan(filenameShort), ':', colors.magenta(formattedSize));

        callback(null, file);
    });
}

export default gulp.series(
    minifyJS,
    copyDistFiles,
    createZip,
    deleteTempDir
);
