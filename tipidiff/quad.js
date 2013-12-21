fs=require('fs')
var J
var out = fs.createWriteStream('pairs.txt')
   if (J == undefined) { 
		J = fs.readFileSync('glue').toString().split('\n\n')
		console.log(J.length)
	}
//return
function inter(a, b) {
	var ma = 0, mb = 0, mab = 0
	for (var i = 0; i < J.length; i++) {
		var A = J[i].indexOf(a) >= 0
		var B = J[i].indexOf(b) >= 0
		if (A) {
			if (B) mab++; else ma++;
		} else if (B) mb++;
	}
	out.write(a + ' ' + b + ' ' + mab)
}
var W = require('./weighted.json')
var Z = W.filter(function(a) { if (a[1] >= 1 && a[1] <= 200 && a[0].length >= 4) return true })
//console.log(Z)
var M = [], MN = [], MO = []
var flat = []
for (var j = 0; j < Z.length; j++) flat.push(0)
for (var j = 0; j < J.length; j++) {
	M.push(flat.concat([]))
	MN.push(0), MO.push(0)
}
console.log('empty set done')
for (var a = 0; a < Z.length; a++) {
	for (var j = 0; j < J.length; j++) {
		if (J[j].indexOf(Z[a][0]) >= 0) M[j][a] = 1, MN[j] = 1, MO[j]++
	}
	console.log(a + '/' + Z.length)
}
var MNC = 0, MOC = 0
for (var i = 0; i < MN.length; i++) {
	MNC += MN[i], MOC += MO[i]
}
console.log('MO/MN =', MOC/MNC, 'MNC =', MNC, 'of', J.length)
//fs.writeFileSync('map', JSON.stringify(M))
return
for (var j = 0; j < J.length; j++) {
	for (var a = 0; a < Z.length; a++) {
		console.log(a, '/', Z.length)
		for (var b = a + 1; b < Z.length; b++) {
		inter(Z[a][0], Z[b][0])
		}
	}
}
//inter('khala', 'pandu')

return

require('./simpler')

var A = require('./parcount_glue.json')
var B = [], v = 'aoiue'
for (var i = 0; i < A.length; i++) {
	var q = A[i]
	if (q[0].length > 3 && v.indexOf(q[0].charAt(0)) < 0) {
		if (q[0].length == 5) q[1] /= 1.3
		if (q[0].length == 6) q[1] /= 1.8
		if (q[0].length >= 7) q[1] /= 2.1
		q[1] = Math.round(q[1])
		B.push(q)
	}
}
B.sort(function(a, b) { return b[1] - a[1] } )
fs.writeFileSync('./weighted.json', JSON.stringify(B, 0, ' '))
return

var sounds = fs.readFileSync('sounds.txt').toString().split('\n')

function once(name) {
	var T=fs.readFileSync(name).toString().split('\n\n')
	console.log(T.length)
	var counts = []
	for (var i = 0; i < sounds.length; i++) counts[i] = [sounds[i], 0]
	console.log(sounds.length)

	for (var t = 0; t < T.length; t++) {
		var s = T[t]
		//console.log(s.length)
		var S = []
		for (var x = 0; x < sounds.length; x++) {
			var C = s.match(new RegExp(sounds[x],'g'))
			if (C == undefined) C = 0; else C = 1
			counts[x][1] += C
		}
		console.log(t + '/' + T.length)
	}
	counts.sort(function(a, b) { return b[1] - a[1] } )
	fs.writeFileSync('parcount_' + name + '.json', JSON.stringify(counts, 0, ' '))
}

once('glue')
//once('bvri.txt')
//once('bthai.txt')

