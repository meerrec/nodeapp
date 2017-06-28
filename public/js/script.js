(function() {
    var socket = io.connect('http://45.76.150.25:8080');
    document.getElementById("loader").style.display = "none";
    // Cache DOM selections
    var $downloadBtn = document.querySelector('.download-btn');
    $downloadBtn.style.display = "none";


    document.getElementById("uploadFile").onchange = function() {
        document.getElementById("uploadForm").submit();
         document.getElementById("loader").style.display = "";
    };
    function showPage() {
     document.getElementById("loader").style.display = "none";
     document.getElementById("container").style.display = "none";
  
    }
    socket.on('file-ready', function(data) {
        $downloadBtn.style.display = "";
        showPage();
    });
    $downloadBtn.addEventListener('click', function() {
        socket.emit('download-clicked');
    }, false);

})();