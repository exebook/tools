var login = 'email@yourmail', password = 'yourpass'
var qs = require('querystring'), session = ''
var http = require('http')
var fs = require('fs')
fs.mkdir('data')
var volume = [], queue = [], sections = [], titles = []

function next() {
	if (queue.length > 0) {
		var o = queue.shift()
		if (typeof o == 'object') o.f(o); else o()
	}
}

function parse_volume() {
	var kangyur = fs.readFileSync('data/volume.html').toString().replace(/\r/g,'').split('\n')
	var A = []
	for (var i = 0; i < kangyur.length; i++) {
		var s = kangyur[i]
		if (s.indexOf('class="collection" onClick="getkangyurvolumes') >= 0) {
			s = s.split('<h3 id="')[1].split('"')[0]
			A.push(s)
		}
	}
	fs.writeFileSync('data/volume.json', JSON.stringify(A))
	volume = A
	console.log('* Got volume names: ' + volume.length)
	next()
}

function login() {
	if (fs.existsSync('data/session.txt')) {
		session = fs.readFileSync('data/session.txt')
		if (session.length == 26) { 
			console.log('* Using saved cookie session, ' +
			'if you have problems delete data/session.txt to force relogin'); 
			next()
			return 
		}
	}
	var data = 'login-username='+login+'&login-password='+password+'&url=http://www.asianclassics.org/etext.php'
	var options = { host: 'www.asianclassics.org', port: 80, path: '/execute_login.php', method: 'POST', 
		headers: {
			"Content-type":"application/x-www-form-urlencoded",
			'Content-Length': data.length
	}};

	var req = http.request(options, function(res) {
		session = qs.parse(res.headers['set-cookie'][1]).PHPSESSID.split(';')[0]
		console.log('login session: ', session)
		if (session == '') console.log('Unable to login!');
		else {
			fs.writeFileSync('data/session.txt', session)
			next()
		}
	});
	req.write(data);
	req.end();
}

function check_body(body, file) {
	console.log('got "' + file + '": ' + body.length + ' bytes');
	fs.writeFileSync('data/'+ file + '.html', body)
	if (body.indexOf('LOGIN') > 0) console.log('Not logged in!'); else {
		//console.log('Logged in.')
		next()
	}
}

function check_file(file) {
	if (!fs.existsSync('data/' + file + '.html')) return false
	var F = fs.readFileSync('data/' + file + '.html')
	if (F.length > 0) {
//		console.log('* Using data from local file "data/'+file+'.html", delete it if you want to force refetch')
		next()
		return true
	}
	return false
}

function get_volume() {
	if (check_file('volume')) return
	var options = { host: 'www.asianclassics.org', port: 80, path: '/etext.php?sub=two', method: 'GET',
	headers:{
	'Cookie': 'PHPSESSID='+session
	}};
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		var body = ''
		res.on('data', function (chunk) { body += chunk });
		res.on('end', function () { check_body(body, 'volume') } );
	});
	req.end();
}

function get_category(opt) {
	if (check_file('category_' + opt.id)) return
	var data = 'kangyurcategoryID=' + encodeURIComponent(volume[opt.id]) + '&restriction=0'
	var options = { host: 'www.asianclassics.org', port: 80, path: '/kangyursectioncontents.php', method: 'POST', 
		headers: {
			"Content-type":"application/x-www-form-urlencoded",
			'Content-Length': data.length
	}};
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		var body = ''
		res.on('data', function (chunk) { body += chunk });
		res.on('end', function () { check_body(body, 'category_' + opt.id) } );
	});
	req.write(data);
	req.end();
}

function get_titles(opt) {
	if (check_file('titles_' + opt.id)) return
	var data = 'kangyurcategoryID=' + encodeURIComponent(sections[opt.id]) + '&restriction=0'
	var options = { host: 'www.asianclassics.org', port: 80, path: '/kangyurvolumecontents.php', method: 'POST', 
		headers: {
			"Content-type":"application/x-www-form-urlencoded",
			'Content-Length': data.length
	}};
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		var body = ''
		res.on('data', function (chunk) { body += chunk });
		res.on('end', function () { check_body(body, 'titles_' + opt.id) } );
	});
	req.write(data);
	req.end();
}

function get_sections() {
	for (var i = volume.length - 1; i >= 0; i--) {
		queue.unshift({f:get_category, id:i})
	}
	next()
}

function parse_sections() {
	for (var i = 0; i < volume.length; i++) {
		var A = fs.readFileSync('data/category_' + i + '.html').toString().replace(/\r/g, '\n').split('\n')
		for (var a = 0; a < A.length; a++) {
			var s = A[a]
			if (s.indexOf('" onClick="getkangyurtitles(this.id,0);') > 0) {
				s = s.split('id="')[1].split('"')[0]
				sections.push(s)
			}
		}
	}
	next()
}

function get_all_titles() {
	for (var i = sections.length - 1; i >= 0; i--) {
		queue.unshift({f:get_titles, id:i})
	}
	next()
}

function parse_titles() {
	for (var i = 0; i < sections.length; i++) {
//		console.log('SECTION: ' + i)
		var A = fs.readFileSync('data/titles_' + i + '.html').toString().replace(/\r/g, '\n').split('\n')
		for (var a = 0; a < A.length; a++) {
			var s = A[a]
			if (s.indexOf('>etext<') > 0) {
				s = s.split('href="')[1].split('"')[0]
				titles.push(s)
			}
		}
	}
	fs.writeFileSync('data/titles.js', JSON.stringify(titles))
	console.log('TOTAL TITLES: ' + titles.length)
	next()
}

function report_ok() {
	console.log('* Successfully completed.')
}

queue = [login, get_volume, parse_volume, get_sections, parse_sections, get_all_titles, parse_titles, report_ok]

next()


/*
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

*/