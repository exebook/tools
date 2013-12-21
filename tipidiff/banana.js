require('./suffixarray')

var s = ''
console.time('a')
	for (var i = 0; i < 25000000; i++) s += String.fromCharCode(Math.random() * 26 + 65)
console.timeEnd('a')

//console.log(s)

console.time('b')
	var t = suffixArray(s)
console.timeEnd('b')

//console.log(JSON.stringify(t))

return

function show(s) {
	var X = suffixArray(s), R = []
	for (var i = 0; i < X.length; i++) {
		t = s.slice(X[i])
		R.push(t)
	}
	return R
}

function matchSize(a, b) {
	var i = 0
	while (i < a.length && a.charAt(i) == b.charAt(i)) i++
	return i
}

function walk(A, B) {
	a = show(A)
	b = show(B)
	A = suffixArray(A)
	B = suffixArray(B)
	var ai = bi= 0;
	var result = []
	while( ai < a.length && bi < b.length ){
		var M = matchSize(a[ai], b[bi])
		if (a[ai] < b[bi] ) {
			if (M > 0) result.push([M, A[ai], B[bi]])
			ai++
		} else if (a[ai] > b[bi] ) {
			if (M > 0) result.push([M, A[ai], B[bi]])
			bi++
		} else {
			if (M > 0) result.push([M, A[ai], B[bi]])
			ai++, bi++
		}
	}
//	while (ai < a.length) result.push('+' + a[ai++])
//	while (bi < b.length) result.push('-' + b[bi++])
	console.log('-------')
	for (var i = 0; i < result.length; i++) console.log(i,result[i])
	console.log()
	return result;
}

function sortMatches(A) {
	// longest matches first, if same length then closer to each other first
	return A.sort(function(a, b) { return a[1] - b[1] })
}

function sortMatchesOld(A) {
	return A.sort(function(a, b) {
		if (a[0] != b[0]) return b[0] - a[0]
		return Math.abs(a[2] - a[1]) - Math.abs(b[2] - b[1])
	})
}

function filterOrder(A) {
	var R = []
	for (var i = 0; i < A.length; i++) {
		if (i > 0 && A[i][2] < A[i - 1][2]) continue
		R.push(A[i])
	}
	return R
}

function filterSuffixes(A) {
	var R = []
	for (var i = 0; i < A.length; i++) {
		if (i > 0 && A[i][1] == A[i - 1][1] + 1 && A[i][2] == A[i - 1][2] + 1) continue
		R.push(A[i])
	}
	return R
}

function showMap(A) {
	var s = ''
	for (var i = 0; i < A.length; i++) s += (A[i]?'1':'-')
	console.log(s)
}

var A = 'banana', B = 'obana'
//var B = 'banana', A = 'obana'
//A = '_abc++abc_!', B = '...abc...!'
//B = '_abc++abc_!', A = '...abc...!'
A = 'although many tests allow one to create factories to generate'
B = 'but, although many tests allow you to create factories to generate'
A = 'allow one to create factories to generate'
B = 'but, allow you to create factories to generate'

var F = walk(A, B)
F = sortMatches(F)

	console.log('--- SORTED BY A----')
	for (var i = 0; i < F.length; i++) console.log(i,F[i])
	console.log()

F = filterOrder(F)

	console.log('---ORDERED----')
	for (var i = 0; i < F.length; i++) console.log(i,F[i])
	console.log()

F = filterSuffixes(F)

	console.log('--- SUFFIXED----')
	for (var i = 0; i < F.length; i++) console.log(i,F[i])
	console.log()

var mapA = [], mapB = []
for (var f = 0; f < F.length; f++) {
	var m = F[f]
	if (mapA[m[1]] == true) continue
	if (mapB[m[2]] == true) continue
	for (var i = 0; i < m[0]; i++) mapA[m[1] + i] = true, mapB[m[2] + i] = true
	console.log(f, F[f])
	showMap(mapA)
	showMap(mapB)
}

var a = 0, b = 0
var C = ''
var state = -1 // 0-both, 1-from A, 2-from B
function addChar(character, newstate) {
	if (state != newstate) {
		if (state == 1) C += '>'
		else if (state == 2) C += ']'
		if (newstate == 1) C += '<'
		else if (newstate == 2) C += '['
		state = newstate
	}
	C += character
}
console.log('' + A + '\n' +B)
while (a < A.length && b < B.length) {
	if (mapA[a]) 
		if (mapB[b]) addChar(A.charAt(a++), 0), b++; else addChar(B.charAt(b++), 2)
	else addChar(A.charAt(a++), 1)
}
while (a < A.length) { addChar(A.charAt(a), 1), a++ } 
while (b < B.length) { addChar(B.charAt(b), 2), b++ } 
addChar('', -1)
console.log(C)
return


//F = walk('_abc++abc_', '...abc...')
//walk('obana', 'banana')
//walk('...abc...', '_abc+abc_')


/*
<o>b[an]ana
<o>ban[an]a
<o>bana[na]
*/
