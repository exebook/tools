require('./suffixarray')

function showPair(a, b, ax, bx) {
	function showSA(s, a) {
		var R = []
		for (var i = 0; i < a.length; i++) {
			var t = ''
			for (var j = a[i]; j < s.length; j++) t += s[j]
			R.push(t)
		}
		return R
	}
	function zap(s, x) {
		while (s.length < x) s += ' '
		return s
	}
	var Ra = showSA(a, ax), Rb = showSA(b, bx)
	var i = 0
	while (i < Ra.length || i < Rb.length) {
		var q = Ra[i], w = Rb[i]
		if (q == undefined) q = ''
		if (w == undefined) w = ''
		var s = zap(q, a.length + 1) + w
		console.log(s)
		i++
	}
}

function cmpAt(a, b, x, y) {
	var c = 0
	while (true) {
		if (x == a.length) {
			if (y == b.length) return { size: c, ab: 0 }
			return { size: c, ab: -1 }
		}
		if (y == b.length) return { size: c, ab: 1 }
		if (a.charCodeAt(x) != b.charCodeAt(y)) {
			var ab = 1; 
			if (a.charCodeAt(x) < b.charCodeAt(y)) ab = -1
			return { size: c, ab: ab }
		}
		c++, x++, y++
	}
}

function join(as, bs, A, B) {
	var a = 0, b = 0, R = [], max = 1
	while (a < A.length && b < B.length) {
		var M = cmpAt(as, bs, A[a], B[b])
		if (M.size > 0) {
			if (M.ab < 0) {
				var x = b; while (x < B.length) {
					var C = cmpAt(as, bs, A[a], B[x])
					if (C.size >= M.size) {  if (C.size >= max) max = C.size, R.push([a, x, C.size]) } else break
					x++
				}
			} else {
				var x = a; while (x < A.length) {
					var C = cmpAt(as, bs, A[x], B[b])
					if (C.size >= M.size) { if (C.size >= max) max = C.size, R.push([x, b, C.size]) } else break
					x++
				}
			}
		}
		if (M.ab < 0) a++; else b++
	}
	R = R.filter(function(a){ if (a[2] == max) return true })
	return R
}

function findLongMatches(as, bs, A, B, howLong) {
	var a = 0, b = 0, R = [], max = 1
	while (a < A.length && b < B.length) {
		var M = cmpAt(as, bs, A[a], B[b])
		if (M.size >= howLong) {
			R.push([A[a], B[b], M.size])
			if (M.ab < 0) {
				var x = b+1; while (x < B.length) {
					var C = cmpAt(as, bs, A[a], B[x])
					if (C.size >= M.size) { if (C.size >= howLong) R.push([A[a], B[x], C.size]) } else break
					x++
				}
			} else {
				var x = a+1; while (x < A.length) {
					var C = cmpAt(as, bs, A[x], B[b])
					if (C.size >= M.size) { if (C.size >= howLong) R.push([A[x], B[b], C.size]) } else break
					x++
				}
			}
		}
		if (M.ab < 0) a++; else b++
	}
	return R
}

function showResult(a, b, R) {
	console.log('Result of join:', R.length)
	for (var i = 0; i < R.length; i++) {
		var o = R[i][0], u = R[i][1]
		var c = cmpAt(a, b, o, u)
		var s = a.substr(o, c.size)
		console.log('{' + R[i][0] +':'+ R[i][1] +'}', i, o + '-' + u, c.size, '"'+s+'"')
	}
}

longestCommonSubstring = function(a, b) {
	var ax = suffixArray(a)
	var bx = suffixArray(b)
	var cx = join(a, b, ax, bx)
	showResult(a, b, ax, bx, cx)
	if (cx.length == 0) return 0
	return cx[0][2]
}


	function wingHasOverlaps(A) { // check overlaps for one side of the matches
//		var z = A[4]; z[0]++; A.push(z)
		// part-1 check those that start at same position
		var T = [], B = []
		for (var i = 0; i < A.length; i++) {
			var n = A[i][0], c = A[i][1]
			if (T[n] != undefined) {
				if (T[n] != c) {
					console.log('one')
					return true
				}
			} else {
				B.push(A[i])
				T[A[i][0]] = A[i][1]
			}
		}
		// stage-2 check every char
		var M = []
		for (var i = 0; i < B.length; i++) {
			var n = B[i][0], c = B[i][1]
			console.log(n, c)
			for (var x = n; x < n+c; x++) {
				if (M[x] == undefined) M[x] = 1; else {
					console.log('two')
					return true
				}
			}
		}
		return false
	}
	// this is for testing only, if no overlaps will be found in many tests - this code can be removed
	// 
	function checkOverlaps(R) {
		var A = [], B = []
		for (var i = 0; i < R.length; i++) {
			var o = R[i][0], u = R[i][1]
			A.push([ax[R[i][0]], R[i][2]])
			B.push([bx[R[i][1]], R[i][2]])
		}
		if (wingHasOverlaps(A)) {
			console.log('ERROR: A has overlaps')
			process.exit()
		}
		if (wingHasOverlaps(B)) {
			console.log('ERROR: B has overlaps')
			process.exit()
		}
		console.log('fine, no overlaps')
		process.exit()
	}

function removeSuffixes(A) {
	var S = A.sort(function(a, b) { return b[0]-a[0] })
	var R = []
	for (var i = 0; i < S.length; i++) {
		var a = A[i]
		var j = i + 1, isSuffix = false
		while (j < S.length) {
			var b = S[j]
			if (a[0] == b[0] + 1 && a[1] == b[1] + 1) { isSuffix = true; break }
			j++
		}
		if (!isSuffix) R.push(S[i])
	}
//	console.log('suffexes removed: ', A.length - R.length)
	return R
}

function getChainSize(T) {
	var R = 0
	for (var i = 0; i < T.length; i++) R += T[i].size
	return R
}

// longestMatchChain is quadratic time, very slow on long list: size=[10,15,20,25,26,30], time ms = [0,15,300,1000,2000,19000]
// can this ever be optimized or an alternate approach used?
// this problem is similar to "Longest Common Subsequence", (but not exactly it)
function longestMatchChain(T, X, Y, id) {
	function findNextPossible() {
		var x = id
		while (x < T.length) {
			if (T[x][0] >= X && T[x][1] >= Y) return x
			x++
		}
		return -1
	}
	var id = findNextPossible()
	if (id < 0) return []
	var C = [{a:T[id][0], b:T[id][1], size:T[id][2] }]
	// with current
	var o = T[id]
	var A = C.concat(longestMatchChain(T, o[0]+o[2], o[1]+o[2], id+1))
	// without current
	var B = longestMatchChain(T, X, Y, id+1)
	if (getChainSize(A) < getChainSize(B)) A = B
	return A
}

listLongMatches = function(a, b, ax, bx, howLong, remSuf) {
	console.time('* flm')
	var cx = findLongMatches(a, b, ax, bx, howLong)
//	console.log(cx)
	console.timeEnd('* flm')
	if (remSuf === true) cx = removeSuffixes(cx)
//	console.log('common substrings: ', cx.length)
	cx = cx.sort(function(a, b) { return b[2] - a[2] })
	if (cx.length > 10) cx.length = 10
//	if (cx.length > 15) cx.length = 15
//	if (cx.length > 25) cx.length = 25
//	if (cx.length > 1) cx.length = 1
	//	fs.writeFileSync('bjcommon.txt', JSON.stringify(cx))
	// sort by A before we find longest common match sequence
	cx = cx.sort(function(a, b) { return a[0] - b[0] })
	console.time('* lmc')
	var lm = longestMatchChain(cx, 0, 0, 0, '')
	console.timeEnd('* lmc')
	return lm
}
// R.push({ a: [x, X - x], b: [y, Y - y] })
// R.push({c: [X, L[i].size]})
// R.push({ a: [x, O.a.length - x], b: [y, Y] })

var retry=0

function tryToListLongMatches(a, b, ax, bx) {
	var opts = findBestOpts(a, b), keepTrying
	while (true) {
		var R = listLongMatches(a, b, ax, bx, opts.commonSubstringLenght, opts.unsuffix)
		if (R.length > 0) {
			var sum = 0; for (var i = 0; i < R.length; i++) sum += R[i].size
			console.log('matches:', R.length, sum)
		}
		if (keepTrying === undefined) keepTrying = haveCommonChar(a, b)
		if (R.length == 0) {
			if (keepTrying) {
				opts.commonSubstringLenght /= 2
				opts.commonSubstringLenght--
				retry++
			} else return []
		} else return R
	}
}
function processDiff(O) {
	console.time('* suffix array')
	O.ax = suffixArray(O.a)
	O.bx = suffixArray(O.b)
	console.timeEnd('* suffix array')
	var opts = findBestOpts(O.a, O.b)
	var L = tryToListLongMatches(O.a, O.b, O.ax, O.bx)
	//break text into pieces, and mark the parts that were already found
	if (L.length == 0) {
		return [{ a:O.a, b:O.b, final: true }]
	}
	var R = [], x = 0, y = 0
	for (var i = 0; i < L.length; i++) {
		var X = L[i].a, Y = L[i].b
		if (x < L[i].a || y < L[i].b) {
			R.push({ a: O.a.substr(x, X - x), b: O.b.substr(y, Y - y) })
		}
		x = X + L[i].size, y = Y + L[i].size
		R.push({c: O.a.substr(X, L[i].size)})
	}
	X = O.a.length - x, Y = O.b.length - y
	if (X > 0 || Y > 0)
		R.push({ a: O.a.substr(x, O.a.length - x), b: O.b.substr(y, Y) })
	return R
}

function processLevels(O) {
	while (true) {
		var R = []
		var remain = 0
		for (var i = 0; i < O.length; i++) {
			if (O[i].a != undefined) R = R.concat(processDiff(O[i])); else R.push(O[i])
		}
		O = R
		for (var i = 0; i < O.length; i++) {
			if (O[i].a != undefined && !O[i].final) remain++
		}
		if (remain == 0) 
		break
	}
	fs.writeFileSync('y:/data/Levels.json', JSON.stringify(R))
}
console.timeEnd = function() {}

function findBestOpts(a, b) {
	var opts = {}
	if (a.length > 30) opts.unsuffix = true; else opts.unsuffix = false;
	opts.commonSubstringLenght = a.length / 30;
	if (opts.commonSubstringLenght < 1) opts.commonSubstringLenght = 1
	return opts
}
require('./simpler')
function main() {
	fs=require('fs')
	var a = 'yyyyyyyyybc6abc3abc2', b = 'abc1xxx4abc5uuuuuuuu'
	var a = 'bc6abc3abc2', b = 'abc1xxx4abc5'
	var a = 'bc6abc555553abc2', b = 'abc1xxx555554abc5'
	a = 'although many tests allow one to create factories to generate'
	b = 'but, although many tests allow you to create factories to generate'
	//	a = 'a+a',  b = 'a-a'
	console.time('ALL')
//	a = fs.readFileSync('y:/data/bthai.txt').toString()
//	b = fs.readFileSync('y:/data/bvri.txt').toString()
	var thai = fs.readFileSync('Y:/data/bJalaThai.txt').toString()//.replace(/\n\n/g, '\n').split('\n')
	var vri = fs.readFileSync('Y:/data/bJalaVRI.txt').toString()//.replace(/\n\n/g, '\n').split('\n')
	vri = simpler(vri)
	thai = simpler(thai)
	a = thai, b = vri

//	a = 'yabcqabcabc', b = 'abcxxxabc'
	//	a = 'rtwqeyrtgdhjaskiqweyoqry', b = 'gfasdqhtkjudortwqgfkaejhsdgfkjsa'
//	a = 'banana!', b = 'obana!'
	//a+=a,b+=b
	//a+=a,b+=b
//	a += '\u0000', b += '\u0001'
	var o = [{a:a,b:b}]
	processLevels(o)
	console.timeEnd('ALL')
}


function haveCommonChar(a, b) {
	var mapa = [], mapb = [], mappeda = 0, mappedb = 0, x = 0, y = 0
	while(x < a.length && y < b.length) { // smart part, while both strings still have more chars
		if (mappeda >= mappedb) { //compare against the largest map
			// one way to speed up this part, will be to work in chunks of fixed size (now it's 1)
			var c = b.charCodeAt(y++)
			if (mapa[c] === 1) return true
			if (mapb[c] !== 1) mapb[c] = 1, mappedb++
		} else {
			var c = a.charCodeAt(x++)
			if (mapb[c] === 1) return true
			if (mapa[c] !== 1) mapa[c] = 1, mappeda++
		}
	}
	//quickly finish the remaining chars
	while(x < a.length) if (mapb[a.charCodeAt(x++)] !== undefined) return true
	while(y < b.length) if (mapa[b.charCodeAt(y++)] !== undefined) return true
	return false
}

if (process.mainModule == module) main()
console.log('total retry to find matches', retry)