/*global history */
sap.ui.define(
	[
		"sap/ui/core/mvc/Controller", 
		"sap/ui/core/routing/History",
		"be/fiddle/jsdoco/util/formatter"
	],
	function(Controller, History, Formatter) {
		"use strict";

		/**
		 * @name	be.fiddle.jsdoco.controller.BaseController
		 * @alias 	be.fiddle.jsdoco.controller.BaseController
		 * @constructor
		 * @public
		 * @extends sap.ui.core.mvc.Controller
		 * @class
		 * The basecontroller is inherited by all the controllers of the application. It contains shared functionality that can be triggered
		 * from multiple locations in the app.<br/>
		 **/
		const BaseController = Controller.extend(
			"be.fiddle.jsdoco.controller.BaseController", 
			/**@lends be.fiddle.jsdoco.controller.BaseController.prototype */
			{
				formatter:Formatter,
				navProps:null
			}
		);

		/**
		 * register onRouteMatchedEvent in the basecontroller. You'll need it anyway...
		 * @method onInit
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 * @public
		 */
		BaseController.prototype.onInit = function() {
			if (this.getRouter()){
				this.getRouter().attachEvent("routeMatched", {}, this.onRouteMatched, this)
			}
		};

		/**
		 * Don't forget to detach route hanlers
		 * @method onExit
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 * @public
		 */
		BaseController.prototype.onExit = function(oEvent){
			this.getRouter().detachEvent("routeMatched",this.onRouteMatched, this);		
		};
	
		/**
		 * the base handler for on route matched. Simply stores the navigation arguments in a variable, so we can reuse it again later.
		 * @todo can, or should we limit ourselves in this method to only store the child* and parent* arguments?
		 * @method onRouteMatched
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 * @public
		 */
		BaseController.prototype.onRouteMatched = function(event){
			this.navProps = event.getParameter("arguments") || {};	
		};

		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @method getRouter
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 * @returns {sap.f.routing.Router} the router for this component
		 */
		BaseController.prototype.getRouter = function() {
			return this.getOwnerComponent().getRouter();
		};

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @method getModel
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		BaseController.prototype.getModel = function(sName) {
			return this.getView().getModel(sName);
		};

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @method setModel
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		BaseController.prototype.setModel = function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		};

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @method getResourceBundle
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		BaseController.prototype.getResourceBundle = function() {
			return this.getOwnerComponent()
				.getModel("i18n")
				.getResourceBundle();
		};

		/**
		 * Event handler  for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 * @method onNavBack
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 */
		BaseController.prototype.onNavBack = function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("master", {}, bReplace);
			}
		};

		/**
		 * convenience method for routing, that automatically passes parent and child params (nested components).
		 * @method navTo
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 */
		BaseController.prototype.navTo = function( route, params ){
			let parentChild =  this.navProps || {};
			let resultParams = {};
			params = params || {}; //make sure it's an object

			for( let key in parentChild ){
				resultParams[key] = parentChild[key];
			}

			for( let key in params ){
				resultParams[key] = params[key];
			}

			this.getRouter().navTo(route, resultParams);
		};

		/**
		 * convenience method to retrieve the component startup parameters.
		 * @method getStartupParameters
		 * @public
		 * @instance
		 * @memberof be.fiddle.jsdoco.controller.BaseController
		 */
		BaseController.prototype.getStartupParameters = function() {
			return (
				this.getOwnerComponent().getComponentData().startupParameters || {}
			);
		};

		return BaseController;
	}
);
