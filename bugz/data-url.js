var fs = require('fs'),
    http = require("http"),
    html = '<!DOCTYPE html><html><head><title>base64 nodejs test</title></head><body>';
var base64_data = new Buffer(fs.readFileSync('/newsite/images/subfotos/IMG_0783.jpg')).toString('base64');
html += '<img alt="base64 nodejs test" src="data:image/jpeg;base64,' + base64_data + '">';
html += '</body></html>';
var server = http.createServer(function(req, res) {
    res.end(html, 'utf-8');
}).listen(process.env.PORT, process.env.IP);
//console.log('<img alt="base64 nodejs test" src="data:image/jpeg;base64,' + base64_data + '">');

