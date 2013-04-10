var qs = require('querystring');

var http = require('http');
http.createServer(
function (request, response) {
console.log('req headers: '+JSON.stringify(request.headers))
console.log('res headers: '+JSON.stringify(response.headers))
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
console.log('data: '+data)
            body += data;
	require('fs').writeFileSync('post.txt', data.toString())
        });
        request.on('end', function () {

            var POST = qs.parse(body);
console.log('POST: '+JSON.stringify(POST))
            // use POST

        });
    }
}
).listen(88);
console.log('Server running');

