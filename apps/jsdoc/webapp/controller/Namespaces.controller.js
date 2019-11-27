sap.ui.define([
	"be/fiddle/jsdoco/controller/BaseController"
], function(Controller) {
	"use strict";

	/**
	 * @class be.fiddle.jsdoco.controller.Namespaces
	 * @alias be.fiddle.jsdoco.controller.Namespaces
	 * @public
	 * @extends sap.ui.core.mvc.controller
	 * @author Tom Van Doorslaer
	 * @classdesc
	 * The namespaces controller acts when a user selects a namespace to display. it will then navigate to the details
	 * for that namespace.
	 */
	var Namespaces = Controller.extend("be.fiddle.jsdoco.controller.Namespaces", 
	/**@lends be.fiddle.jsdoco.controller.Namespaces.prototype **/
  { });
	
	/**
	 * When the user selects a namespace, we detect the root module path and navigate towards it.
	 * @method selectNamespace
	 * @public
	 * @instance
	 * @memberof be.fiddle.jsdoco.controller.Namespaces
	 * @public
	 */
  Namespaces.prototype.selectNamespace = function(event){
    let binding = event.getSource().getBindingContext("modules");

    if (binding && binding.getPath){
      let module = binding.getPath();

      if(module && module.length){
        let path = module.split(".").join("/");
        this.navTo("ClassDisplay", {"node*":path} );
      }
    }
  };	

	return Namespaces;
});