(function() {
	var socket = io.connect('http://45.76.150.25:8080');
	
	// Cache DOM selections
	var $count = document.querySelector('.count'),
		$theBtn = document.querySelector('.the-btn'),
		$downloadBtn = document.querySelector('.download-btn');
    $downloadBtn.hide();
	// When the 'new-client-connection' event happens, set the count on the page
	socket.on('new-client-connection', function(data) {
		$count.innerHTML = numberWithCommas(data.count);
	});

	// When the button is clicked, emit the 'btn-clicked' event
	$theBtn.addEventListener('click', function() {
		socket.emit('btn-clicked');
	}, false);

	// When the 'count-updated' event happens, update the count on the page
	socket.on('count-updated', function(data) {
		$count.innerHTML = numberWithCommas(data.count);
	});
	socket.on('file-ready', function(data) {
		$downloadBtn.show();
	});
	$downloadBtn.addEventListener('click', function() {
		socket.emit('download-clicked');
	}, false);

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
})();