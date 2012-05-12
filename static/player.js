var Player = function(x,y, name){
    this.x      = x;
    this.y      = y;
    this.name   = name;
    this.speedX = 0;
    this.speedY = 0;
    this.accel  = 1;
    this.maxAcc= 2;
    this.moving = true;
    var that    = this;

    this.moveRight = function (){
        that.speedX += Math.max(that.accel, that.maxAcc);
        that.moving = true;
    }

    this.moveLeft = function (){
        that.speedX -= Math.max(that.accel, that.maxAcc);
        that.moving = true;
    }

    this.moveUp = function (){
        that.speedY -= Math.max(that.accel, that.maxAcc);
        that.moving = true;
    }

    this.moveDown = function (){
        that.speedY += Math.max(that.accel, that.maxAcc);
        that.moving = true;
    }

    this.stop = function (){
        that.moving = false;
    }

    this.tick = function (){
        that.x += that.speedX;
        that.y += that.speedY;
        if (that.moving == false) {
            that.speedX *= 0.9;
            that.speedY *= 0.9;
        }
    }
}
