sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	var JSDocComponent = UIComponent.extend("be.fiddle.jsdoco.Component", {		
		metadata: {
			manifest: "json"
		}
  });

	JSDocComponent.prototype.init = function() {
		UIComponent.prototype.init.apply(this, arguments);

		//prepare the router
		if (this.getRouter() ){
			this.getRouter().initialize();
		}

		this.scanNamespaces();
	};

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
		this.getModel("docs").setData(roots);
	};

  return JSDocComponent;
});