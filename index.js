// Dependencies
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
server.listen(8080);
var io = require('socket.io')(server);
const fileUpload = require('express-fileupload');
var fileReady = false;
var path = require('path');

// Setup routing for static assets
app.use(express.static('public'));
app.use(fileUpload());

// Express routes
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // Use the mv() method to place the file somewhere on your server 
    let sampleFile = req.files.foo;
    sampleFile.mv('/var/www/inputs/' + req.files.foo.name, function(err) {
        if (err)
            return res.status(500).send(err);

        // Dynamic Python script generator
        var fileName;
        var autorigged_mesh_dae;

        var mesh_obj = req.files.foo.name;
        fileName = req.files.foo.name;
        var extension = path.extname(fileName);
        fileName = path.basename(fileName, extension);
        autorigged_mesh_dae = fileName + '.dae';
        console.log(autorigged_mesh_dae);
        var scriptContent = `getViewer().show()
from AutoRig import *
assetManager = scene.getAssetManager()
autoRigManager = SBAutoRigManager.getAutoRigManager()

# setup paths and object names
work_dir ='/var/www/inputs'
save_dir ='/var/www/outputs'
mesh_obj = '${mesh_obj}'
defaultPawn0 = 'defaultPawn4'
autorigged_mesh_dae = '${autorigged_mesh_dae}'
skeleton_sk = 'maddy.sk'

# load maddy.obj
assetManager.loadAsset(work_dir + '/' + mesh_obj)
pawn = scene.createPawn(defaultPawn0)
pawn.setStringAttribute('mesh', mesh_obj)

#next
autoRigManager.buildAutoRiggingFromPawnMesh(defaultPawn0, 0, skeleton_sk, autorigged_mesh_dae)
saveDeformableMesh(autorigged_mesh_dae, skeleton_sk, save_dir)
quit()
`;
        fs.writeFile('/var/www/temp/smartbody-cli-mod/' + fileName + '.py', scriptContent, function(err, data) {

            var child_process = require("child_process");
            child_process.exec("./sbgui -scriptpath /var/www/temp/smartbody-cli-mod -script " + fileName + '.py', {
                cwd: "/var/www/smartbody/bin"
            }, function(err, stdout, stderr) {
                if (err) {
                    console.log(err.toString());
                } else if (stdout !== "") {
                    console.log(stdout);
                    fileReady = true;
                    console.log("Finished execution");

                    res.download('/var/www/outputs/' + autorigged_mesh_dae, autorigged_mesh_dae);
                    fileName = "";
                    autorigged_mesh_dae = "";
                } else {
                    console.log(stderr);
                }
            });

        });




    });
});


// Socket.io
io.on('connection', function(socket) {
    var count;
    console.log("got a connection " + socket);
    // Read the count value from count.txt
    fs.readFile('count.txt', 'utf-8', function(err, data) {
        count = data;

        // Send the count to the client when they initially connect
        socket.emit('new-client-connection', {
            count: data
        });
    });
    if (fileReady == true) {
        fileReady = false;
        socket.emit('file-ready');
        console.log("File ready sent");
    }
    socket.on('pause', function() { socket.emit('file-ready'); });
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