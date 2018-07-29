
function detectIE() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	if (msie > 0) { return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10); }
	var trident = ua.indexOf('Trident/');
	if (trident > 0) { var rv = ua.indexOf('rv:'); return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10); }
	var edge = ua.indexOf('Edge/');
	if (edge > 0) { return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);}
}
var version = detectIE();

if( version ) {
	var iediv = document.createElement('div');
	iediv.setAttribute( 'id', 'ie' );
	iediv.innerHTML = "Still using Internet Explorer? 😂 do yourself ( and everyone else ) a favor: <a href='https://www.google.com/chrome/' target='_blank'> Download a real browser </a>"
	document.body.appendChild( iediv );
}

