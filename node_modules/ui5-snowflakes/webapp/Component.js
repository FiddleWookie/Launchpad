sap.ui.define(
	[
		"sap/ui/core/Component",
		"sap/ui/Device",
		"be/fiddle/snowflakes/control/Flake"
	],
	function(BaseComponent, Device, Flake) {
		"use strict";

		/**
		 * @name        be.fiddle.snowflakes.Component
		 * @alias       Component
		 * @instance
		 * @public
		 * @class
		 * @todo please replace Component with a meaningfulname.
		 * <p></p>
		 */
		const Component = BaseComponent.extend(
			"be.fiddle.snowflakes.Component",
			/**@lends be.fiddle.snowflakes.Component.prototype **/ {
				metadata: {
					manifest: "json"
				}
			}
		);

		/**
		 * @method init
		 * @public
		 * @instance
		 * @memberof be.fiddle.snowflakes.Component
		 * <p> </p>
		 * 
		 */
		Component.prototype.init = function(){
			// define snow variables
			this._flakes = [];
			
			//in case there's no canvas yet.
			$("#shell-cntnt").prepend('<canvas id="snowflakes" height="600" width="800" aria-hidden="true" style="position:absolute;z-index:-1"></canvas>');

			// get canvas to paint in: there seems to be only one in the Fiori Launchpad so this should always work
			this.canvas = $("#snowflakes").get(0); 
			if (!this.canvas) return; 

			window.addEventListener("resize", this.onResize.bind(this) );
			this.onResize();

			// first loop to create all Flake objects
			let i = 200;
			while (i--) {
				this._flakes.push(new Flake());
			}

			// start looping all flakes to move them
			requestAnimationFrame( this.render.bind(this) );
		};	

		/**
		 * @method destroy
		 * @public
		 * @instance
		 * @memberof be.fiddle.snowflakes.Component
		 * <p> </p>
		 * 
		 */
		Component.prototype.destroy = function(){
			this._flakes.forEach( flake => flake.destroy() );
			delete this._flakes;
			window.removeEventListener("resize", this.onResize.bind(this) );
			$("#shell-cntnt").get(0).removeChild( this.canvas );

			BaseComponent.prototype.destroy.apply(this,arguments);
		};

		/**
		 * @method onResize
		 * @public
		 * @instance
		 * @memberof be.fiddle.snowflakes.Component
		 * <p> </p>
		 * 
		 */
		Component.prototype.onResize = function(){
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		};

		/**
		 * @method loop
		 * @public
		 * @instance
		 * @memberof be.fiddle.snowflakes.Component
		 * <p></p>
		 */
		Component.prototype.render = function() { 
			if (!this._flakes ) return; //no more flakes to draw
			
			// clear canvas
			let context = this.canvas.getContext("2d");
			context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			
			// loop through the flakes and "animate" them
			let i = this._flakes.length;
			while (i--) {
				this._flakes[i].update(context);					
			}

			// continue animation...
			requestAnimationFrame( this.render.bind(this) );
		};

		return Component;
	}
);
