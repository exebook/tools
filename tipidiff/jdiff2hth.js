var disk = 'y:'
//disk = '/y'
var fs = require('fs')
require('./simpler')
function loadLevelsJson(test) {
	J = require(disk + '/data/Levels.json')
	if (test) {
		var a=0, b=0, c=0, aba = 0, abb = 0, x = 0
		var as = '', bs = ''
		for (var i = 0; i < J.length;i++) {
			var o = J[i]
			if (o.c != undefined) {
				x += o.c.length
				c += o.c.length
				as += o.c, bs += o.c
			} else {
				as += o.a, bs += o.b
				a += o.a.length
				b += o.b.length
				x += o.a.length + o.b.length
				if (o.a.length > 0 && o.b.length > 0) {
					aba += o.a.length
					abb += o.b.length
				}
			}
		}
		console.log(J.length)
		console.log(x, a, b, c, aba, abb)
		console.log(as.length, bs.length)
	}
}

function restoreFile() {
	thai = fs.readFileSync(disk + '/data/bJalaThai.txt').toString()
	vri = fs.readFileSync(disk + '/data/bJalaVRI.txt').toString()
	mapb = makeSimplerMap(vri)
	mapa = makeSimplerMap(thai)
	a = thai, b = vri
/*	mapa = [3,4,5,9,11,12,17,18,19], mapb = [6,7,8]
	J = [{c:'abc'},{c:'xyz'},{a:'qwe',b:'asd'}]
	a = '---abc+++X_yz/***qwe==='
	b = 'abcxyzasd'
	s = ''
	for (var i = 0; i < mapa.length; i++) s += a.charAt(mapa[i])
//	console.log(s);//	return
	b = 'abcxyzasd'*/
	function unpack(style, count, m) {
		var R = [[style,'']], x = mapa[m]
		for (var i = 0; i < count; i++) {
			var z = mapa[m + i]
			//console.log('m:', m, ', z:', z, ', x:', x)
			if (z == x) {
				R[R.length - 1][1] += a[z]
				x++
			} else {
				//console.log('**')
				var c = z - x
				R.push([1, a.substr(x, c)])
				R.push([0, ''])
				x += c
				R[R.length - 1][1] += a[z]
				x++
			}
			
		}
//		if (R[R.length - 1][1].length == 0) R.length--
		return R
		var x = mapa[m]
		var c = mapa[m + count - 1] + 1 - x
		var s = a.substr(x, c)
		return [[style, s]]
	}
//	console.log(unpack(0, 3, 3))
//	process.exit()
	function unpackb(style, s, n) {
		var x = mapb[n]
		var c = mapb[n + s.length - 1] + 1 - x
		s = b.substr(x, c)
		return [[style, s]]
	}
	var x = 0, m = 0, n = 0, R = []
	for (var j = 0; j < J.length; j++) {
		var o = J[j]
		if (o.c != undefined) {
			var z = mapa[m]
			if (z-x > 0) R.push([1, a.substr(x, z - x)])
			if (o.c.length > 0) R = R.concat(unpack(0, o.c.length, m))
			x = mapa[m + o.c.length - 1] + 1
			if (x == undefined) x = a.length
			m += o.c.length
			n += o.c.length
		} else {
			var z = mapa[m]
			if (z-x > 0) R.push([1, a.substr(x, z - x)])
			if (o.a.length > 0) R = R.concat(unpack(2, o.a.length, m))
			if (o.b.length > 0) R = R.concat(unpackb(3, o.b, n))
			x = mapa[m + o.a.length - 1] + 1
			if (x == undefined) x = a.length
			m += o.a.length
			n += o.b.length
		}
	}
	R.push([1, a.substr(x, a.length - x)])
	return R
}

loadLevelsJson(true)
var R = restoreFile(), s = '<link rel="stylesheet" type="text/css" href="cmpstyle.css">\r\n'
//fs.writeFileSync(disk + '/data/restoreThaiVRI.json', JSON.stringify(R))
for (var i = 0; i < R.length; i++) {
	if (R[i][0] == 0) s += '<j>' + R[i][1].replace(/\n/g, '<br>') + '</j>'
	if (R[i][0] == 1) s += '<x>' + R[i][1].replace(/\n/g, '<br>') + '</x>'
	if (R[i][0] == 2) s += '<y>' + R[i][1].replace(/\n/g, '<br>') + '</y>'
	if (R[i][0] == 3) s += '<z>' + R[i][1].replace(/\n/g, '\\n') + '</z>'
}
//console.log(s)
fs.writeFileSync(disk + '/data/restoreThaiVRI.html', s)

<j>Ukkoṭana</j><x>-</x><j>vañcana</j><x>-</x><j>nikati</j><x>- </x><j>sāci</j><x>-</x><j>yogā</j><x> </x><y>paṭivirato</y><x> </x><j>S</j><y>amaṇo</y><x> </x><j>Gotamo</j><x>. </x>

ukkoṭanavañcananikati   sāciyogā  sāviyogā (syā. kaṃ. ka.) paṭivirato samaṇo gotamo…|
Ukkoṭana-vañcana-nikati sāci-yogā paṭivirato Samaṇo Gotamo.


