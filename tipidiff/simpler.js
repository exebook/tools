fs=require('fs')
//J=require('./vri.json')
var upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZṢṚḤÑĀĪŪḌḶṂṄṆṬ'
var lower = 'abcdefghijklmnopqrstuvwxyzṣṛḥñāīūḍḷṃṅṇṭ'
var simple = 'abcdefghijklmnopqrstuvwxyzsrhnaiudlmnnt'
	
var chars = []
for (var  i = 0; i < upper.length; i++) 
	chars[upper.charCodeAt(i)] = simple.charAt(i),
	chars[lower.charCodeAt(i)] = simple.charAt(i)
	
upper = upper.split('')
lower = lower.split('')

simpler = function(s) {
	var t = ''
	for (var i = 0; i < s.length; i++) {
		var c = s.charCodeAt(i)
		if (chars[c] != undefined) t += chars[c]
	}
	return t
}

simplerSpace = function(s) {
	var t = ['']
	for (var i = 0; i < s.length; i++) {
		var c = s.charCodeAt(i)
		if (chars[c] != undefined) t[t.length - 1] += chars[c]
		else if (t[t.length - 1].length > 0) t.push('')
	}
	return t.join(' ')
}

glueFile = function() {
	var glue = fs.createWriteStream('glue2')
	J=require('Y:\\thai\\pali2.json')
	for (k = 0; k < J.length; k++) {
		var s = J[k][2]
		if  (s == undefined) {
			console.log('undefined at ', k)
			continue
		}
		s = simpler(s)
		glue.write(s + '\n\n')
	}
}

if (process.mainModule == module) main()


