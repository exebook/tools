var fs=require('fs')

var s = '<p n="1"> evaṃ <pb ed="M" n="1.0001"/><pb ed="V" n="1.0001"/><pb ed="P" n="1.0001"/><pb ed="T" n="1.0001"/> me sutaṃ – ekaṃ samayaṃ bhagavā antarā ca rājagahaṃ antarā ca nāḷandaṃ addhānamaggappaṭipanno hoti mahatā bhikkhusaṅghena saddhiṃ'

s = fs.readFileSync('mul/s0101m-d1.xml').toString()
//s += '<p n="2">Aaaaaaaaaaaaa.<p n="3">Bbbbbbbbbbbbb.<p n="4">'+
//'Cccccccccccc.<p n="5">Dddddddd.'

console.log('ok')
var R = [['','','']]
for (var i = 0; i < s.length; i++) {
	var c = s.charAt(i)
	if (c == '<') {
		var j = s.indexOf('>', i)
		var t = s.substr(i, j-i+1)
		t = t.split(' ')
		if (t[0] == '<p') {
			var z = t.filter(function (o) { if (o.indexOf('n=') == 0) return o} )
			var num = ''
			if (z.length > 0) 
				{
					num = z[0].match(/".*"/g)[0].replace(/"/g, '')
				}
			else {
					var z = t.filter(function (o) { if (o.indexOf('sid=') == 0) return o} )
					if (z.length > 0) 
						num = 'sid' + z[0].match(/".*"/g)[0].replace(/"/g, '')
				}
			R.push(['',num,''])
		}
		i = j
	} else {
		R[R.length - 1][2] += c
	}
}
fs.writeFileSync('vri.json', JSON.stringify(R))
T = []
for (var i = 0; i < R.length; i++) {
	T.push(R[i][1] + ' ' + R[i][2])
}
fs.writeFileSync('bJalaVRI.txt', T.join(''))

