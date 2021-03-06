var tinylr = require('tiny-lr');

// TODO: take options (port, ssl)
module.exports = function() {
    // TODO: lazy initialise when needed only
    var port = 35729;
    var server = tinylr({port: port});
    server.server.removeAllListeners('error');
    server.server.on('error', function(err) {
        if (err.code === 'EADDRINUSE') {
            console.error('Port ' + port + ' is already in use by another process.');
        } else {
            console.error(err);
        }
        process.exit(1);
    });
    server.listen(port, function(err) {
        if (err) { return console.error(err); }
        console.log('Live reload server started on port: ' + port);
    });

    return function(reports) {
        // FIXME: filter reports only
        if (reports.length > 1) {
            var files = reports.map(function(report) {
                return report.writtenResource.absolute();
            });
            console.log('Live reloading ' + files.length + ' files...');
            server.changed({body: {files: files}});
        }

        // TODO: return reload report? avoid output?
        return [];
    };
};
