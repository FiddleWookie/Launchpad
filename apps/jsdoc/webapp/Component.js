sap.ui.define(
	[
		"sap/ui/core/UIComponent"
	], 
	function(UIComponent) {
		"use strict";

		/**
		 * @name		be.fiddle.jsdoco.Component
		 * @alias 	be.fiddle.jsdoco.Component
		 * @constructor
		 * @public
		 * @extends sap.ui.core.mvc.Controller
		 * @class
		 * The main component of your app. This also serves as public interface when your component is embedded in another app.<br/>
		 * Be sure to define properties and events that need to be accessible from outside, as well as public methods.<br/>
		 **/
		const JSDocComponent = UIComponent.extend("be.fiddle.jsdoco.Component", 
			/**@lends be.fiddle.jsdoco.controller.Classes.prototype */
			{		
				metadata: {
					manifest: "json"
				},
				gitUrl:"https://github.com/FiddleWookie/Launchpad"
			}
		);

		/**
		 * @method	init
		 * @public
		 * @instance
		 * @memberof	be.fiddle.jsdoco.Component
		 * initialization of manifest, device model (if exists) and router (if exists).<br/>
		 * Then we start scanning the launchpad for namespaces.
		 **/
		JSDocComponent.prototype.init = function() {
			UIComponent.prototype.init.apply(this, arguments);

			//prepare the router
			if (this.getRouter() ){
				this.getRouter().initialize();
			}

			this.scanNamespaces();
		};

		/**
		 * @method	scanNamespaces
		 * @public
		 * @instance
		 * @memberof	be.fiddle.jsdoco.Component
		 * Once the component is launched, we retrieve all the declared modulenames from
		 * the UI5 framework. We filter them to remove the sap standard modules.
		 * PS: If you want, you can override this method in your deployment and change
		 * the filtering to work the other way around: only include namespaces of 
		 * my.company.*.Component || my.company.*.library (example).<br/>
		 * <br/>
		 * Once we've assembled all modulenames into an array, we throw it in a model.<br/>
		 **/
		JSDocComponent.prototype.scanNamespaces = function(){
			//retrieve all declared modules (up to now, because you only get the modules that already loaded)
			let modules = $.sap.getAllDeclaredModules();
			let roots = {};
			modules.forEach( module => {
				if (		!module.startsWith("sap") 
						&& 	!module.startsWith("jquery") 
						&& 	!module.startsWith("ui5")
						&&  module.endsWith("Component") ){
					roots[module] = {id:module};
				}
			});
			this.getModel("modules").setData(roots);
		};

		return JSDocComponent;
	}
);