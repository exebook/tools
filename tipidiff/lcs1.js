var indexMap = function(list) {
  var map = {}
  list.forEach(function(each, i) {
    map[each] = map[each] || []
    map[each].push(i)
  })
  return map
}

var longestCommonSubstring = function(seq1, seq2) {
  var result = {startString1:0, startString2:0, length:0}
  var indexMapBefore = indexMap(seq1)
  var previousOverlap = []
  seq2.forEach(function(eachAfter, indexAfter) {
    var overlapLength
    var overlap = []
    var indexesBefore = indexMapBefore[eachAfter] || []
    indexesBefore.forEach(function(indexBefore) {
      overlapLength = ((indexBefore && previousOverlap[indexBefore-1]) || 0) + 1;
      if (overlapLength > result.length) {
        result.length = overlapLength;
        result.startString1 = indexBefore - overlapLength + 1;
        result.startString2 = indexAfter - overlapLength + 1;
      }
      overlap[indexBefore] = overlapLength
    })
    previousOverlap = overlap
  })
  return result
}

var a = []
var b = []
console.time('a')
for (var i = 0; i < 20000; i++) {
	a.push(Math.round(Math.random() * 100))
	b.push(Math.round(Math.random() * 100))
}
console.timeEnd('a')
console.time('b')
c = longestCommonSubstring(a, b)
console.timeEnd('b')
console.log(c)
