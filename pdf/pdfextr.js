var arg = process.argv.slice(2)
fileName = 'output.pdf'
imageNo = 2
if (arg.length >= 1) fileName = arg[0]
if (arg.length >= 2) imageNo = parseInt(arg[1])

fs=require('fs')
var zlib = require('zlib')

var f = fs.openSync(fileName, 'r')
var objs = []

function readHeader() {
	var size=fs.statSync(fileName).size
	var tail = fs.readSync(f, 30, size - 30).toString()
	var startxref = tail.split('startxref\n')[1].split('\n')[0]
	startxref=parseInt(startxref)
	var tabl = fs.readSync(f, size-startxref, startxref).toString().split('\n')
	while(tabl[0] != 'xref')tabl=tabl.slice(1)
	var objcnt = parseInt(tabl[1].split(' ')[1])
	tabl=tabl.slice(2, 2+objcnt)
	for (var i=0; i < tabl.length; i++) {
		var o = {}
		o.pos = parseInt(tabl[i].split(' ')[0])
		objs.push(o)
	}
	for (var i = 0; i < objs.length; i++) {
		var N = startxref
		if (i < objs.length -1)	N = objs[i + 1].pos;
		objs[i].size = N - objs[i].pos
	}
	objs=objs.filter(function(o){return (o.size > 1000)})
	console.log(JSON.stringify(objs))
}

function extractImage(obj) {
	var hdr = fs.readSync(f, 1000, obj.pos).toString()
	var disp = hdr.indexOf('\nstream\n') + 8
	hdr = hdr.split('\n').filter(function(s){return (s.indexOf('/Length') == 0)})
	var leng = parseInt(hdr[0].split(' ')[1])
	console.log(obj.pos+disp, leng)
	var img = fs.readSync(f, leng, obj.pos+disp, 'binary').toString()
	fs.writeFileSync('out.jpg', img, 'binary')
}

readHeader()
extractImage(objs[imageNo]) 

