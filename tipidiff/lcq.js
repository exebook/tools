require('./simpler')
lcq = function(x,y){
	var symbols = {},
		r=0,p=0,p1,L=0,idx,
		m=x.length,n=y.length,
		S = '';
	p1 = popsym(0);
	for(i=0;i < m;i++){
		p = (r===p)?p1:popsym(i);
		p1 = popsym(i+1);
		idx=(p > p1)?(i++,p1):p;
		if(idx===n){p=popsym(i);}
		else{
			r=idx;
			S+=x.charAt(i)
		}
	}
	return S;
 
	function popsym(index){
		var s = x[index],
			pos = symbols[s]+1;
		pos = y.indexOf(s,pos>r?pos:r);
		if(pos===-1){pos=n;}
		symbols[s]=pos;
		return pos;
	}
}


fs=require('fs')
var thai = fs.readFileSync('Y:/thai/bJalaThai.txt').toString()//.replace(/\n\n/g, '\n').split('\n')
var vri = fs.readFileSync('Y:/cstxml/bJalaVRI.txt').toString()//.replace(/\n\n/g, '\n').split('\n')
vri = simpler(vri)
thai = simpler(thai)
console.log('lcs start')

console.log(lcq('banana!', 'obana!na!na!na!'))
console.log(lcq('banana!', 'obana!'))
console.log(lcq('112222222222222223', '123456'))
//while (thai.length < 100000) thai += thai, vri += vri
s = lcq(thai, vri)

fs.writeFileSync('thai_vri_lcq.txt', s)
require('./lcs1')
longestCommonSubstring()
