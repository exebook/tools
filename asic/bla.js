a = 0
setInterval(function() {
	process.stdout.write(a + '\u0008')
	a++; if (a == 10) a = 0
}, 300)
