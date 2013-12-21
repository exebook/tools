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
----a---------a--------a----------a-------a
----a--a------a---a----a----a---a----a-----

a---a-
a-a-a-

// !!   a12
// a12  a4
// a3   a5
//      a6
a12-a4
a3-a6
	

function diffString( o, n ) {
	var out = diff(o.split(''), n.split(''))
	C = '', state = -1

	if (out.n.length == 0) {
		for (var i = 0; i < out.o.length; i++) addChar(out.o[i], 1)
	} else {
		if (out.n[0].text == null) {
			for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
				addChar(out.o[n], 1)
			}
		}

		for ( var i = 0; i < out.n.length; i++ ) {
			if (out.n[i].text == null) addChar(out.n[i], 2)
			else {
				for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) addChar(out.o[n], 1)
				addChar(out.n[i].text, 0)
			}
		}
	}
	addChar('', -1)
	return C;
}

function diff( o, n ) {
  var ns = new Object();
  var os = new Object();
  
  for ( var i = 0; i < n.length; i++ ) {
    if ( ns[ n[i] ] == null )
      ns[ n[i] ] = { rows: new Array(), o: null };
    ns[ n[i] ].rows.push( i );
  }
  
  for ( var i = 0; i < o.length; i++ ) {
    if ( os[ o[i] ] == null )
      os[ o[i] ] = { rows: new Array(), n: null };
    os[ o[i] ].rows.push( i );
  }
  
  for ( var i in ns ) {
    if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
      n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
      o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
    }
  }
  
  for ( var i = 0; i < n.length - 1; i++ ) {
    if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && 
         n[i+1] == o[ n[i].row + 1 ] ) {
      n[i+1] = { text: n[i+1], row: n[i].row + 1 };
      o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
    }
  }
  
  for ( var i = n.length - 1; i > 0; i-- ) {
    if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && 
         n[i-1] == o[ n[i].row - 1 ] ) {
      n[i-1] = { text: n[i-1], row: n[i].row - 1 };
      o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
    }
  }
  
  return { o: o, n: n };
}

//console.log(diffString('banana!','obana!'))
A='allow one to create factories to generate.'
B='but, allow you to create factories to generate.'
B = A + '!'
while (A.length < 100) A += A, B += B
console.log(A)
console.log(B)
console.log(diffString(A, B))

//require('fs').writeFileSync('diffab', diffString(A, B))



