/**
 * Small http static server.
 */

var express = require('express'),
    fs = require('fs'),
    server  = express(),
    root = './',
    port = process.env.PORT || 8080;

server.get(root, function (req, res) {
    console.log('serving index.html');
    res.sendfile('index.html');
});

server.get('*', function (req, res) {
    var requestedFile = req.url.substr(1);

    if (fs.existsSync(requestedFile)) {
        console.log('serving file: ' + requestedFile);
        res.sendfile(requestedFile);
    } else {
        console.log('could not find file: ' + requestedFile);
        res.sendfile('index.html');

        // use this when serverRouting = true
//        res.redirect(root + '#' + req.url.substr(4));
    }
});

console.log("Listening on " + port);

server.listen(port);