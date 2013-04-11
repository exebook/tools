if (typeof define !== 'function') {var define = require('amdefine')(module); } 
define([], function(){ 

var map={'ཀ':'k','ཁ':'kh','ག':'g','ང':'ng',
'ཅ':'c','ཆ':'ch','ཇ':'j','ཉ':'ny',
'ཏ':'t','ཐ':'th','ད':'d','ན':'n',
'པ':'p','ཕ':'ph','བ':'b','མ':'m',
'ཙ':'ts','ཚ':'tsh','ཛ':'dz','ཝ':'w',
'ཞ':'zh','ཟ':'z','འ':"'",'ཡ':'y',
'ར':'r','ལ':'l','ཤ':'sh','ས':'s','ཧ':'h',

'ོ':'o','ི':'i','ེ':'e','ུ':'u',
'ཽ':'au','ཱ':'A',
'ཨ':'',
'་':' ',
'།':'/',' ':' ',

'\u0f90':'k',
'\u0f91':'kh',
'\u0f92':'g',
'\u0f93':'gh',
'\u0f94':'ng',
'\u0f95':'c',
'\u0f96':'ch',
'\u0f97':'j',

'\u0f99':'ny',
'\u0f9a':'tt',
'\u0f9b':'tth',
'\u0f9c':'dd',
'\u0f9d':'ddh',
'\u0f9e':'nn',
'\u0f9f':'t',
'\u0fa0':'th',
'\u0fa1':'d',
'\u0fa2':'dh',
'\u0fa3':'n',
'\u0fa4':'p',
'\u0fa5':'ph',
'\u0fa6':'b',
'\u0fa7':'bh',
'\u0fa8':'m',
'\u0fa9':'ts',
'\u0faa':'tsh',
'\u0fab':'dz',
'\u0fac':'dzh',
'\u0fad':'w',
'\u0fae':'zh',
'\u0faf':'z',
'\u0fb0':'-a',
'\u0fb1':'y',
'\u0fb2':'r',
'\u0fb3':'l',
'\u0fb4':'sh',
'\u0fb5':'ss',
'\u0fb6':'s',
'\u0fb7':'h',
'\u0fb8':'a',
'\u0fb9':'kss',
'\u0fba':'w',
'\u0fbb':'y',
'\u0fbc':'r',
}
var wylie=function(s) {
	var o='';
	for (var i in s) {
		var t=map[s[i]];
		if (t!=undefined) o+=t; else o+='?'+s[i];
	}
	return o;
}
var api={wylie:wylie};

return api;
});