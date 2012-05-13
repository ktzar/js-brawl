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

    var myPlayer = new Player(20,20, "miguel", stage);
    c.font = "12px Verdana";

    document.addEventListener('keydown', function(e) {
        console.log(e);
        if (    typeof e.keyIdentifier != undefined && (
                    e.keyIdentifier == "Up" ||
                    e.keyIdentifier == "Down" ||
                    e.keyIdentifier == "Left" ||
                    e.keyIdentifier == "Right" 
                )
            ) {
            eval("myPlayer.move"+e.keyIdentifier+"()");
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
            socket.emit('updatePosition', {x:myPlayer.x,y:myPlayer.y}); 
        }
        c.clearRect(0,0,stage.width,stage.height);
        var size = c.measureText(myPlayer.name);
        c.fillStyle = myPlayer.color;
        c.fillRect(myPlayer.x, myPlayer.y, size.width, 15);
        c.fillStyle = 'rgba(255,255,255,1)';
        c.fillText(myPlayer.name, myPlayer.x, myPlayer.y+ 10);
        var otherPlayer = null;

        for (player in stage.all_players) {
            otherPlayer = stage.all_players[player];
            if ( player == socket.socket.sessionid ) {
                continue;
            }
            size = c.measureText(otherPlayer.name);
            c.fillStyle = otherPlayer.color;
            c.fillRect(otherPlayer.x, otherPlayer.y, size.width, 15);
            c.fillStyle = 'rgba(255,255,255,1)';
            c.fillText(otherPlayer.name, otherPlayer.x, otherPlayer.y+ 10);
        }
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


