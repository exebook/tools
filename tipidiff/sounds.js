require('./simpler')
fs=require('fs')

function countVowel(s) {
	var v = 'aoiue', R = 0
	for (var i = 0; i < s.length; i++) if (v.indexOf(s.charAt(i)) >= 0) R++
	return R
}

var ci = fs.readFileSync('cidian.txt').toString().replace(/\r/g,'').split('\n')
var sounds = []
for (var i = 0; i < ci.length; i++) {
	var s = ci[i].split('=')[1]
	if (s == undefined) continue
	s = simplerSpace(s).split(' ')
	for (var x = 0; x < s.length; x++)
		if (countVowel(s[x]) == 2) {
			var j = sounds.indexOf(s[x])
			if (j < 0) sounds.push(s[x])
		}
}

fs.writeFileSync('sounds.txt', sounds.join('\n'))

