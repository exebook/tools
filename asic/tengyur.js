require('logininfo.js')
var max_files_to_download = 5000
var qs = require('querystring'), session = ''
var http = require('http')
var fs = require('fs')
if (!fs.existsSync('data2')) fs.mkdir('data2')
var volume = [], queue = [], sections = [], titles = []
var delay_between = 3000
var multi_tasks = 10
if (multi_tasks > 1) delay_between = 0

function next() {
	if (queue.length > 0) {
		var o = queue.shift()
		if (typeof o == 'object') o.f(o); else o()
	}
}

function parse_volume() {
	var tengyur = fs.readFileSync('data2/volume.html').toString().replace(/\r/g,'').split('\n')
	var A = []
	for (var i = 0; i < tengyur.length; i++) {
		var s = tengyur[i]
		if (s.indexOf('class="collection" onClick="gettengyurvolumes') >= 0) {
			s = s.split('<h3 id="')[1].split('"')[0]
			A.push(s)
		}
	}
	fs.writeFileSync('data2/volume.json', JSON.stringify(A))
	volume = A
	console.log('* Got volume names: ' + volume.length)
	next()
}

function login() {
	if (fs.existsSync('data2/session.txt')) {
		session = fs.readFileSync('data2/session.txt')
		if (session.length == 26) { 
			console.log('* Using saved cookie session, ' +
			'if you have problems delete data/session.txt to force relogin'); 
			next()
			return 
		}
	}
	var data = 'login-username='+login1+'&login-password='+password+'&url=http://www.asianclassics.org/etext.php'
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
			fs.writeFileSync('data2/session.txt', session)
			next()
		}
	});
	req.write(data);
	req.end();
}

function check_body(body, file) {
	console.log('got "' + file + '": ' + body.length + ' bytes');
	fs.writeFileSync('data2/'+ file + '.html', body)
	if (body.indexOf('LOGIN') > 0) console.log('Not logged in!'); else {
		//console.log('Logged in.')
		next()
	}
}

function check_file(file) {
	if (!fs.existsSync('data2/' + file + '.html')) return false
	var F = fs.readFileSync('data2/' + file + '.html')
	if (F.length > 0) {
//		console.log('* Using data from local file "data/'+file+'.html", delete it if you want to force refetch')
		next()
		return true
	}
	return false
}

function get_volume() {
	if (check_file('volume')) return
	var options = { host: 'www.asianclassics.org', port: 80, path: '/etext.php?sub=three', method: 'GET',
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
	var data = 'tengyurcategoryID=' + encodeURIComponent(volume[opt.id]) + '&restriction=0'
	var options = { host: 'www.asianclassics.org', port: 80, path: '/tengyursectioncontents.php', method: 'POST', 
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
	var data = 'tengyurcategoryID=' + encodeURIComponent(sections[opt.id]) + '&restriction=0'
	var options = { host: 'www.asianclassics.org', port: 80, path: '/tengyurvolumecontents.php', method: 'POST', 
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
		var A = fs.readFileSync('data2/category_' + i + '.html').toString().replace(/\r/g, '\n').split('\n')
		for (var a = 0; a < A.length; a++) {
			var s = A[a]
			if (s.indexOf('" onClick="gettengyurtitles(this.id,0);') > 0) {
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
		var A = fs.readFileSync('data2/titles_' + i + '.html').toString().replace(/\r/g, '\n').split('\n')
		for (var a = 0; a < A.length; a++) {
			var t = A[a]
			if (t.indexOf('"tohokuno"') > 0) {
				t = t.split('<span class="tohokuno">')[1].split('</span>')[0]
				t = t.replace(/Toh./g, '').replace(/ /g, '')
				titles.push(t)
			}
		}
	}
	fs.writeFileSync('data2/titles.js', JSON.stringify(titles))
	console.log('TOTAL TITLES: ' + Object.keys(titles).length)
//	console.log(JSON.stringify(titles))
	next()
}

function download_once(opt) {
	if (check_file('page_' + opt.id)) return
	var options = { host: 'www.asianclassics.org', port: 80, path: '/reader.php?collection=tengyur&index=' + opt.id, method: 'GET',
	headers:{
	'Cookie': 'PHPSESSID='+session
	}};
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		var body = ''
		res.on('data', function (chunk) { body += chunk; 
			var s = '' + (body.length / (1024 * 1024)).toFixed(2) + 'M', t = s
			while (t.length < s.length * 2) t += '\u0008'
			process.stdout.write(t)
		});
		res.on('end', function () { check_body(body, 'page_' + opt.id) } );
//		res.on('error', function () { check_body(body, 'page_' + opt.id) } );
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message + ', retrying');
		download_once(opt)
	});
	req.end();
}

function delay(opt) {
	console.log('waiting: ' + opt.time + ' ms')
	setTimeout(function() {
		console.log('continuing')
		next()
	}, opt.time)
}

function download() {
	var not_downloaded = []
	for (var i = 0; i < titles.length; i++) {
		var data = '', file = 'data2/page_' + titles[i] + '.html'
		if (fs.existsSync(file)) data = fs.readFileSync(file).toString()
			if (data.length == 0 || data.indexOf('</text>') < 0) 
				not_downloaded.push(titles[i])
	}
	console.log('Not yet downloaded titles: ' + not_downloaded.length)
	console.log('Trying to download ' + max_files_to_download + ' files this time')
	if (not_downloaded.length > max_files_to_download) not_downloaded.length = max_files_to_download
	while (not_downloaded.length > 0) {
//		console.log(not_downloaded.shift())
		if (delay_between > 0) queue.unshift({f:delay, time: delay_between})
		queue.unshift({f:download_once, id: not_downloaded.shift()})
	}
	for (var i = 0; i < multi_tasks; i++) next()
}

function report_ok() {
	console.log('* Successfully completed.')
}

queue = [login, get_volume, parse_volume, get_sections, parse_sections, get_all_titles, parse_titles, download, report_ok]

next()


/*
// this can download pure XML from another location
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