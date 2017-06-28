// Dependencies
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
global.io = require('socket.io')(server);
const fileUpload = require('express-fileupload');

// Start server
server.listen(8080);


// Setup routing for static assets
app.use('/public', express.static('public'));
app.use(fileUpload());

// Express routes
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let sampleFile = req.files.foo;

    // Use the mv() method to place the file somewhere on your server 
    sampleFile.mv('/var/www/inputs/' + req.files.foo.name, function(err) {
        if (err)
            return res.status(500).send(err);

        //res.send('File '+ req.files.foo.name + ' uploaded & saved!');
        socket.emit('file-ready');

    });

});
app.get('/hello', function(req, res) {
    res.sendFile(__dirname + '/index.html');

    // sbgui call
    var child_process = require("child_process");
    child_process.exec("./sbgui -scriptpath /var/www/temp/smartbody-cli-mod -script python7.py", { cwd: "/var/www/smartbody/bin" }, function(err, stdout, stderr) {
        if (err) {
            console.log(err.toString());
        } else if (stdout !== "") {
            console.log(stdout);
            console.log("Finished execution")
                // Send client a websocket message about the file being ready.

        } else {
            console.log(stderr);
        }
    });
});

// Socket.io
io.on('connection', function(socket) {
    var count;

    // Read the count value from count.txt
    fs.readFile('count.txt', 'utf-8', function(err, data) {
        count = data;

        // Send the count to the client when they initially connect
        socket.emit('new-client-connection', {
            count: data
        });
    });

    // When a client clicks the button
    socket.on('btn-clicked', function() {

        // Read the count from count.txt
        fs.readFile('count.txt', 'utf-8', function(err, data) {
            count = data;
            count++;

            // Write the incremented value to count.txt
            fs.writeFile('count.txt', count, function(err, data) {

                // Emit the 'count-updated' event to all connected clients with the updated count value
                io.sockets.emit('count-updated', {
                    count: count
                });
            });
        });
    });

});