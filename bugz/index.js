var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    crypto = require('crypto');
 
http.createServer(function (request, response) {
 
    console.log('Request starting...');
     
    var filePath = '.' + request.url;
    
    path.exists(filePath, function(exists) {
        var stream;
        var eTag = crypto.createHash('md5');
        eTag.update(request.url);
        var eTagDigest = eTag.digest('base64');
        var responseHeaders = {
            'Content-Type'  : 'image/jpeg'
          , 'ETag'          : eTagDigest    // this is enough to ensure caching in Safari 6.0, Chrome 18+, Firefox 17.0 (beta) and Opera Mobile 12.1
          , 'Cache-Control' : 'max-age=31536000'    // 31536000==1year
          , 'Date'          : new Date().toUTCString()
         /* , 'Last-Modified' : new Date(2012, 4, 10).toUTCString()*/
        };
        
        console.log("got request on ", filePath, " from ", request.headers['user-agent']);
        if (exists) {
            fs.stat(filePath, function(err, stat) {
                responseHeaders['Last-Modified'] = stat.mtime.toUTCString();
                console.log("Sending headers:");
                console.dir(responseHeaders);
                if(request.headers['if-none-match'] === eTagDigest) {
                    console.log("The image is cached");
                    response.writeHead(304, responseHeaders);
                    response.end();
                    return;
                }
                console.log("We are sending the image.");
                console.dir(request.headers);
                stream = fs.createReadStream(filePath);
                stream.on('error', function() {
                    response.writeHead(500);
                    response.end();
                });
                stream.on('end', function() {
                    response.end();
                });
                response.writeHead(200, responseHeaders);
                stream.pipe(response);
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
     
}).listen(process.env.PORT);