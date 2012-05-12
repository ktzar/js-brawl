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
    var width   = canvas.getAttribute('width');
    var height  = canvas.getAttribute('height');
    var c       = canvas.getContext('2d');
    var _this   = this;

    var all_players = {};

    var myPlayer = new Player(20,20, "miguel");
    c.font = "12px Verdana";

    //Generate particles from the current cursor position
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
        if ( myPlayer.moving ) {
            socket.emit('updatePosition', {x:myPlayer.x,y:myPlayer.y}); 
        }
        c.clearRect(0,0,width,height);
        c.fillStyle = 'rgba(0,0,0,0.75)';

        c.fillText(myPlayer.name, myPlayer.x, myPlayer.y);
        c.fillRect(myPlayer.x, myPlayer.y, 10, 10);

        for (player in all_players) {
            c.fillText(player.name, player.x, player.y);
            c.fillRect(player.x, player.y, 10, 10);
        }
    }

    //Set the nickname as soon as the connection is ready
    var socket = io.connect('/');
    socket.on('connect', function(){
        socket.emit('name', myPlayer.name);
    });
    socket.on('list', function(players){
        console.log('list', players);
        all_players = players;
    });
    socket.on('disconnect', function(){
        alert("Connection closed");
    });


    window.requestAnimFrame(frame);
};


