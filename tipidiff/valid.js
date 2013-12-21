var invalid = '\n-.,1023456789:;<=>?\'!"&()*/[]^_`{|} §º‘’“”†‡║'
chars = chars.split('')
console.log(chars)
for (var i = 0; i < chars.length; i++) chars[i] = chars[i].charCodeAt(0)
console.log(chars)
chars.sort(function (a, b) { return a- b})
for (var i = 0; i < chars.length; i++) chars[i] = String.fromCharCode(chars[i])
chars=chars.join('')
console.log(chars)
fs.writeFileSync('okchar.txt', chars)
return
z = {}
for (var i = 0; i < chars.length; i++) z[chars.charAt(i)] = 0
var s = ''
z = Object.keys(z)
console.log(z)
for (i in z) s += z[i] + ',';
console.log(s)
return


