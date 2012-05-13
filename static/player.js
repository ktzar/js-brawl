var Player = function(x,y, name, stage){
    this.x      = x;
    this.y      = y;
    this.name   = name;
    this.speedX = 0;
    this.speedY = 0;
    this.accel  = 0.4;
    this.maxSpeed= 3;
    this.moving = false;
    var player  = this;

    player.color = '#'+Math.floor(Math.random()*16777215).toString(16);

    player.moveRight = function (){
        player.speedX = Math.min(player.speedX+player.accel, player.maxSpeed);
        player.moving = true;
    }

    player.moveLeft = function (){
        player.speedX = Math.max(player.speedX-player.accel, -player.maxSpeed);
        player.moving = true;
    }

    player.moveUp = function (){
        player.speedY = Math.max(player.speedY-player.accel, -player.maxSpeed);
        player.moving = true;
    }

    player.moveDown = function (){
        player.speedY = Math.min(player.speedY+player.accel, player.maxSpeed);
        player.moving = true;
    }

    player.stop = function (){
        player.moving = false;
    }

    player.tick = function (){
        //Don't go offlimits
        if ( player.x < 0 && player.speedX < 0 ) player.speedX = 0;
        if ( player.x > stage.width -30 && player.speedX > 0 ) player.speedX = 0;
        if ( player.y < 0 && player.speedY < 0 ) player.speedY = 0;
        if ( player.y > stage.height -30 && player.speedY > 0 ) player.speedY = 0;
        player.x += player.speedX;
        player.y += player.speedY;
        if (player.moving == false) {
            player.speedX *= 0.9;
            player.speedY *= 0.9;
        }
    }
}
