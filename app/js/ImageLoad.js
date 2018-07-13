module.exports = function (self) {
	self.addEventListener('message',function (ev){
		
        var url = ev.data;
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onreadystatechange = function(){
			try{
				if (4 !== xhr.readyState) return;
				self.postMessage( { url: url } );
			} catch (e){
				console.log(e);
			}
		};
		xhr.open('GET', url, false);
		xhr.send(null);
	});
};