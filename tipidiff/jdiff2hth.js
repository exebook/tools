var fs = require('fs')
require('./simpler')
J=require('y:/data/Levels.json')
console.log(J.length)
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


console.log(x, a, b, c, aba, abb)
console.log(as.length, bs.length)

var thai = fs.readFileSync('Y:/data/bJalaThai.txt').toString()//.replace(/\n\n/g, '\n').split('\n')
var vri = fs.readFileSync('Y:/data/bJalaVRI.txt').toString()//.replace(/\n\n/g, '\n').split('\n')
vri = simpler(vri)
thai = simpler(thai)

console.log(thai.length, vri.length)