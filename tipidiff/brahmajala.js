var T = new Date().getTime()
var J = require('./pali1.json')
console.log(J.length)
//var J = require('./pali2.json')
console.log(J.length)
console.log(new Date().getTime() - T)
//return

var J1 = [
['1','1', 'blablbnma'],
['2','1', 'blabl6786a'],
['3','1', 'blablr4a'],
['4','1', 'blablsdfa'],
['6','1', 'match'],
['6','2', 'blafghfghbla']
]

fs=require('fs')
J = J.filter(function(a) { if (a[0] == '6' && parseInt(a[1]) <= '11') return true })
J = J.map(function(a) { return a[2] })
console.log(J)
fs.writeFileSync('bamajala1.txt', J.join('\n=========================\n'))




