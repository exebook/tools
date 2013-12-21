'use strict'
var O = {a:111}
Object.seal(O)
O.b = 222
O.a = 333
console.log(O)
