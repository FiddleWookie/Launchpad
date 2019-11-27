sap.ui.define([
	"be/fiddle/jsdoco/controller/BaseController"
], function(Controller) {
	"use strict";

	/**
	 * @class be.fiddle.jsdoco.controller.Detail
	 * @alias be.fiddle.jsdoco.controller.Detail
	 * @public
	 * @extends sap.ui.core.mvc.controller
	 * @author Tom Van Doorslaer
	 * @classdesc
	 * 
	 */
	var Detail = Controller.extend("be.fiddle.jsdoco.controller.Detail", 
	/**@lends be.fiddle.jsdoco.controller.Detail.prototype **/
	{ });
	
	Detail.prototype.onInit = function(){
		this._oRouter = this.getOwnerComponent().getRouter();
		this._oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
	};

	Detail.prototype.onExit = function(){
		this._oRouter.detachRoutePatternMatched(this.onRouteMatched, this);
	};

	Detail.prototype.onRouteMatched = function(oEvent, oData){

	};

	Detail.prototype.onOpenMasterFromDetail = function(oEvent){
		this._oRouter.navTo("home");
	};

	return Detail;
});