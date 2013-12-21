fs=require('fs')
require('/text/simpler')

console.log(simpler('Pañhaṃ puṭṭhā samānā.'))
return
require('y:/text/salcs')

var thai = fs.readFileSync('Y:/thai/bJalaThai.txt').toString()//.replace(/\n\n/g, '\n').split('\n')
var vri = fs.readFileSync('Y:/cstxml/bJalaVRI.txt').toString()//.replace(/\n\n/g, '\n').split('\n')
vri = simpler(vri)
thai = simpler(thai)

listLongMatches(vri, thai, 900)
return

var n = longestCommonSubstring(simpler(vri), simpler(thai))
//var n = longestCommonSubstring((vri), (thai))
console.log(n)
return

//thai = thai.splice(0, 10)
//vri = vri.splice(0, 10)
vri = vri.filter(function(a) { if (a.length > 0) return true } )
thai = thai.filter(function(a) { if (a.length > 0) return true } )
console.log(thai.length)
console.log(vri.length)

//var s = 'me sutaṃ – ekaṃ samayaṃ bhagavā antarā ca rājagahaṃ antarā ca nāḷandaṃ addhānamaggappaṭipanno hoti mahatā bhikkhusaṅghena saddhiṃ'
//console.log(simpler(s))
//console.log(simplerSpace(s))

//console.log(longestCommonSubstring('simpler(s)', 'simplerSpace(s)'))
console.log(thai[2])
//return
var R = []
for (var b = 0; b < thai.length; b++) {
	console.log(b + '/' + thai.length)
	var N = []
	for (var a = 0; a < vri.length; a++) {
		var n = longestCommonSubstring(simpler(vri[a]), simpler(thai[b]))
		N.push([a, n])
	}
	N = N.sort(function(a, b) { return b[1] - a[1] })
	N = N.slice(0, 5)
	R.push(JSON.stringify([b, N]))
}
fs.writeFileSync('bJalaCMP.json', R.join('\n'))
for (var b = 0; b < thai.length; b++) thai[b] = '{' + b +'}  '+ thai[b]
for (var a = 0; a < vri.length; a++) vri[a] = '{' + a +'}  '+ vri[a]
fs.writeFileSync('thai.cmp.txt', thai.join('\n'))
fs.writeFileSync('vri.cmp.txt', vri.join('\n'))




