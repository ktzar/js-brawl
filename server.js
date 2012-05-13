//Constants
var SERVER_PORT = 1080;

var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
, util = require('util')
, mime = require('./lib/mime')


app.listen(SERVER_PORT);

//HTTP handler
function handler (req, res) {

    //Dump any existing file in the /static folder
    if (req.url.indexOf("/static/")==0) {
        var file = req.url;

        //Read the desired file and output it
        fs.readFile(__dirname + '/'+file,
            function (err, file_data) {
                if (err) {
                    res.writeHead(500);
                    res.end('Not found '+req.url);
                } else {
                    // returns MIME type for extension, or fallback, or octet-steam
                    var extension = file.substr(file.lastIndexOf('.'));
                    var mime_type = mime.lookupExtension(extension);
                    res.writeHead(200, {'Content-Type' : mime_type});
                    res.end(file_data);
                }
            }
        );
    } else {
        //Elsewhere, redirect to the static page
        res.writeHead(302, {
            'Location': '/static/index.html'
        });
        res.end();
    }

}


var createBrawl = function(){

    var players = {};
    var user_count = 0;


    var room = io.on('connection', function (socket) {

        var refreshPlayers = function () {
            socket.broadcast.emit('list', players);
        };

        //If the client doesn't set any nickname it'll remain Anonymous
        var _this = this;

        players[socket.id] = {x:0,y:0,name:"Loading..."};

        socket.on('updateInfo', function (player) {
            //Information that will be shared
            var playerInfo = {
                x:      player.x,
                y:      player.y,
                name:   player.name,
                color:  player.color
            };
            players[socket.id] = player;
            players[socket.id] = player;
            refreshPlayers();
        });

        //User disconnects
        socket.on('disconnect', function () {
            socket.get('nick', function(err, nick) {
                //delete this user from contact list
                delete players[socket.id];
                refreshPlayers();
            });
        });
    });
};

createBrawl();
  
