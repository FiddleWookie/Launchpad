sap.ui.define(
  [
	  "sap/ui/base/Object"
  ], 
  function(Object) {
    "use strict";

    return Object.extend("be.fiddle.snowflakes.control.Flake", {

      constructor: function(){
				let x = this.randomBetween(0, window.innerWidth, true);
				let y = this.randomBetween(0, window.innerHeight, true);
				this.init(x, y);
      },
      
      init: function(x,y) {
        let maxWeight = 5,
            maxSpeed = 3;
            
        this.x = x;
        this.y = y;
        
        this.r = this.randomBetween(0, 1);
        this.a = this.randomBetween(0, Math.PI);
        
        this.aStep = 0.01;
        this.weight = this.randomBetween(2, maxWeight);
        this.alpha = (this.weight / maxWeight);
        this.speed = (this.weight / maxWeight) * maxSpeed;
      },
      
      randomBetween: function(min, max, round) {
        let num = Math.random() * (max - min + 1) + min;
        if (round) {
          return Math.floor(num);
        } else {
          return num;
        }
      },
      
      distanceBetween: function(vector1, vector2) {
        let dx = vector2.x - vector1.x;
        let dy = vector2.y - vector1.y;
        return Math.sqrt(dx * dx + dy * dy);
      },
      
      update: function(canvas) {
        this.x += Math.cos(this.a) * this.r;
        this.a += this.aStep;
        this.y += this.speed;

				this.y = this.y % window.innerHeight;
        this.x = this.x % window.innerWidth;

        this._render(canvas);          
      },

      _render: function(canvas){
				canvas.beginPath();
				canvas.arc(this.x, this.y, this.weight, 0, 2 * Math.PI, false);
				canvas.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
				canvas.fill();
      }
      
    });
  }
);
