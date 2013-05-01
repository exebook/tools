var imglist = ('08860003.jpg 08860004.jpg 08860005.jpg 08860006.jpg 08860007.jpg 08860008.jpg 08860009.jpg 08860010.jpg 08860011.jpg 08860012.jpg 08860013.jpg 08860014.jpg 08860015.jpg 08860016.jpg 08860017.jpg 08860018.jpg 08860019.jpg 08860020.jpg 08860021.jpg 08860022.jpg 08860023.jpg').split(' ');

PDFDocument = require('pdfkit');
doc = new PDFDocument({size:[2000,400]});

for( var i = 0; i < imglist.length; i++) {
	console.log('adding ' + i + ' of ' + imglist.length)
	if (i > 0) doc.addPage()
	doc.image('pdf/'+imglist.shift(), 0, 0, {width:2000});
}
doc.write('output.pdf');
