var A = require('./pali1.json')
console.log(A.length)
return
var B = ''
for (var i = 0; i < A.length; i++) {
//  if (i > 1000) break
  if  (A[i].length < 3) continue
  B += A[i][2] + '\n'
}
require('fs').writeFileSync('big.txt', B)
return
console.log(A.length)
var T = {}
for (var i = 0; i < A.length; i++) {
   if  (A[i].length < 3) continue
   var s = A[i][2]
   for (var x = 0; x < s.length; x++) {
     var c = s.charAt(x)
     if (T[c] == undefined) T[c] = 1; else T[c]++;
   }
}

require('fs').writeFileSync('stat.txt', JSON.stringify(T))
require('fs').writeFileSync('keys.txt', JSON.stringify(Object.keys(T)))





