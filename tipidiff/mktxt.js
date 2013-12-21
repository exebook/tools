J = require('./pali1.json')
//J = require('./cache.json')
//J=J.slice(0, 100)
//require('fs').writeFileSync('cache.json', JSON.stringify(J))
//return

/*
var Z = []
for (var i = 0; i < J.length - 1; i++) {
	var s = J[i][2]
	var N = s.split('\n')
	for (var j = 0; j < N.length; j++) {
		s = N[j]
		for (var x = 0; x < s.length; x++) {
			var c = s.charCodeAt(x)
			if (c != 32) { if (x > 0) { if (Z[x] == undefined) Z[x] = 0; Z[x]++; }; break }
		}
	}
}
for (var i = 0; i < Z.length; i++) if (Z[i] == undefined) Z[i] = 0
console.time(1)
var sum = 0; for (var i = 0; i < Z.length; i++) sum += Z[i]
console.timeEnd(1)
console.log(sum)
console.time(2)
var sum = Z.reduce(function(p, c) { return p+c })
console.timeEnd(2)
console.log(sum)
console.log(Z.join(','))
return
*/
//63415
//65199
bjStart = 'i. Brahmajāla Sutta.] *'
bjEnd = 'BRAHMA-JĀLA-SUTTAṂ'
var state = 0

var T = ['']
for (var i = 0; i < J.length - 1; i++) {
	s = J[i][2]
//	if (s.charCodeAt(0) == 32 && s.charCodeAt(1) == 32 && s.charCodeAt(2) == 32 && s.charCodeAt(3) == 32 && s.charCodeAt(4) == 32) T.push('')
//	T.push('{'+s+'}')
	var N = s.split('\n')
	for (var j = 0; j < N.length; j++) {
		s = N[j]
		if (state == 0 && s.indexOf(bjStart) >= 0) state = 1
		if (state == 1 && s.indexOf(bjEnd) >= 0) state = 2
		if (state != 1) continue
		if (s.charCodeAt(0) == 32) T.push('')
		T[T.length - 1] += ' ' + s
//		if (T.length > 20) break
	}
}

require('fs').writeFileSync('bJalaThai.txt', T.join('\n'))

