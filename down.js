http=require('http')

data='filename=etext%2Fkangyur%2Fbka%26%2339%3B-%26%2339%3Bgyur_H0108%28mdo-sde.nga005%29.xml'

var options = { host: 'www.asianclassics.org', port: 80, path: '/downloader.php', method: 'POST', 
headers: {
	'Cookie': 'PHPSESSID=iuhru1kabkh8lq7lhiqkp32oi4',
	"Content-type":"application/x-www-form-urlencoded",
	'Content-Length': data.length
}};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.write(data);
req.end();
