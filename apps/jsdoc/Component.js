sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("be.fiddle.jsdoco.Component", {		
		metadata: {
			manifest: "json"
		}
  });

	Component.prototype.init = function() {
		UIComponent.prototype.init.apply(this, arguments);

		//prepare the router
		if (this.getRouter() ){
			this.getRouter().initialize();
		}
	};

  return Component;
});