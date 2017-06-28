// Dependencies
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
server.listen(8080);
global.io = require('socket.io')(server);
const fileUpload = require('express-fileupload');
var fileReady = false;


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

    // Use the mv() method to place the file somewhere on your server 
    let sampleFile = req.files.foo;
    sampleFile.mv('/var/www/inputs/' + req.files.foo.name, function(err) {
        if (err)
            return res.status(500).send(err);

// Dynamic Python script generator
        var scriptContent1="getViewer().show()
from AutoRig import *
assetManager = scene.getAssetManager()
autoRigManager = SBAutoRigManager.getAutoRigManager()
# setup paths and object names
work_dir ='/var/www/inputs'
save_dir ='/var/www/outputs'
skeleton_sk = 'maddy.sk'
defaultPawn0 = 'defaultPawn4' "

mesh_obj="mesh_obj= "+req.files.foo.name+" ";
autorigged_mesh_dae="autorigged_mesh_dae= "+req.files.foo.name.substr(req.files.foo.name.lastIndexOf('.')+1)+'.dae';

scriptContent2="assetManager.loadAsset(work_dir + '/' + mesh_obj)
pawn = scene.createPawn(defaultPawn0)
pawn.setStringAttribute('mesh', mesh_obj)
#next
autoRigManager.buildAutoRiggingFromPawnMesh(defaultPawn0, 0, skeleton_sk, autorigged_mesh_dae)
saveDeformableMesh(autorigged_mesh_dae, skeleton_sk, save_dir)
quit()"
scriptContent=scriptContent1+mesh_obj+autorigged_mesh_dae+scriptContent2;

fs.writeFile('/var/www/outputs/' + req.files.foo.name + '.py', scriptContent, function(err, data) {
         
          var child_process = require("child_process");
    child_process.exec("./sbgui -scriptpath /var/www/temp/smartbody-cli-mod -script python7.py", { cwd: "/var/www/smartbody/bin" }, function(err, stdout, stderr) {
        if (err) {
            console.log(err.toString());
        } else if (stdout !== "") {
            console.log(stdout);
            console.log("Finished execution")
                // Send client a websocket message about the file being ready.
res.sendFile(__dirname + '/index.html');
        //res.send('File '+ req.files.foo.name + ' uploaded & saved!');
        fileReady = true;
        } else {
            console.log(stderr);
        }
    });

        });



        
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
    if (fileReady == true) {
        fileReady = false;
        socket.emit('file-ready');
    }
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