// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame    || 
    window.webkitRequestAnimationFrame      || 
    window.mozRequestAnimationFrame         || 
    window.oRequestAnimationFrame           || 
    window.msRequestAnimationFrame          || 
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();


var Brawl = function (canvas, config) {

    //set the canvas and load the width and height
    var canvas  = canvas;
    var c       = canvas.getContext('2d');
    var stage   = this;

    stage.width   = canvas.getAttribute('width');
    stage.height  = canvas.getAttribute('height');

    stage.all_players = {};

    stage.drawPlayer = function(player, mine){
        if ( typeof mine == "undefined" )
            mine = false;
        size = c.measureText(player.name);
        c.fillStyle = player.color;
        c.fillRect(player.x-2, player.y-2, size.width+4, 19);
        if (mine == true) {
            c.fillStyle = "#000000";
            c.strokeRect(player.x-2, player.y-2, size.width+4, 19);
        }
        c.fillStyle = 'rgba(255,255,255,1)';
        c.fillText(player.name, player.x, player.y+ 10);
    }

    var myPlayer = new Player(20,20, prompt('Name?'), stage);
    c.font = "12px Verdana";

    var keyMappings = {
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
    };

    document.addEventListener('keydown', function(e) {
        if (    typeof keyMappings[e.keyCode] != "undefined" ) {
            var keyIdentifier = keyMappings[e.keyCode];
            eval("myPlayer.move"+keyIdentifier+"()");
            return false;
        }
    });
    document.addEventListener('keyup', function(e) {
        if (    e.keyIdentifier == "Up" ||
                e.keyIdentifier == "Down" ||
                e.keyIdentifier == "Left" ||
                e.keyIdentifier == "Right" ) {
            myPlayer.stop();
            return false;
        }
    });

    //Function to execute every frame
    var frame = function () {
        window.requestAnimFrame(frame);
        myPlayer.tick();
        if ( Math.abs(myPlayer.speedX) > 0.1 || Math.abs(myPlayer.speedY) > 0.1 ) {
            socket.emit('updateInfo', myPlayer); 
        }
        c.clearRect(0,0,stage.width,stage.height);
        var otherPlayer = null;
        for (player in stage.all_players) {
            otherPlayer = stage.all_players[player];
            if ( player == socket.socket.sessionid ) {
                continue;
            }
            stage.drawPlayer(otherPlayer);
        }
        //Draw mine later so it's on top
        stage.drawPlayer(myPlayer, true);
    }

    //Set the nickname as soon as the connection is ready
    var socket = io.connect('/');
    socket.on('connect', function(){
        socket.emit('updateInfo', myPlayer); 
    });
    socket.on('list', function(players){
        stage.all_players = players;
    });
    socket.on('disconnect', function(){
        alert("Connection closed");
    });


    window.requestAnimFrame(frame);
};


