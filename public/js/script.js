(function() {
    var socket = io.connect('http://45.76.150.25:8080');

    // Cache DOM selections
    var $downloadBtn = document.querySelector('.download-btn');
    $downloadBtn.style.display = "none";


    document.getElementById("uploadFile").onchange = function() {
        document.getElementById("uploadForm").submit();
    };

    socket.on('file-ready', function(data) {
        $downloadBtn.style.display = "";
    });
    $downloadBtn.addEventListener('click', function() {
        socket.emit('download-clicked');
    }, false);

})();