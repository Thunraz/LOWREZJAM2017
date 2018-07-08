'use strict';

let gutil = require('gulp-util'),
    http  = require('http'),
    path  = require('path'),
    st    = require('st');

export default (done) => {
    let port = process.env.GULP_PORT || 8080;

    gutil.log('Starting server on port', gutil.colors.magenta(port));
    
    http.createServer(
        st({
            path: path.join(__dirname, '..', 'dist'),
            index: 'index.html',
            cache: false
        })
    ).listen(port);

    done();
}
