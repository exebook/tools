var A = require('fs').readFileSync('./big.txt').toString().split('\n')
var max = 0, skip = 0
var S = {}, B = ''
for (var i = 0; i < A.length; i++) {
  if (A[i].charAt(0) == ' ') { skip++; continue }
  if (max < A[i].length) max = A[i].length
  if (A[i].length > 70) B += i +'>'+ A[i] + '\n'
  if (S[A[i].length] == undefined) S[A[i].length] = 1; else S[A[i].length]++
}
console.log(max, skip)
require('fs').writeFileSync('size.txt', JSON.stringify(S))
require('fs').writeFileSync('long.txt', B)





