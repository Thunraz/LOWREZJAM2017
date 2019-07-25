'use strict';

let colors = require('ansi-colors'),
    flog   = require('fancy-log'),
    http  = require('http'),
    path  = require('path'),
    st    = require('st');

export default (done) => {
    let port = process.env.GULP_PORT || 8080;

    flog('Starting server on port', colors.magenta(port));
    
    http.createServer(
        st({
            path: path.join(__dirname, '..', 'dist'),
            index: 'index.html',
            cache: false
        })
    ).listen(port);

    done();
}
