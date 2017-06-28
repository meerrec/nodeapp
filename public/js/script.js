(function() {
	var socket = io.connect('http://localhost:8080');

	// Cache DOM selections
	var $count = document.querySelector('.count'),
		$theBtn = document.querySelector('.the-btn');

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

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
})();