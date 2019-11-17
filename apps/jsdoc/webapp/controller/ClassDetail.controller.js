sap.ui.define([
	"be/fiddle/jsdoco/controller/Detail.controller"
], function(Controller) {
	"use strict";

	/**
	 * @class be.fiddle.jsdoco.controller.ClassDetail
	 * @alias be.fiddle.jsdoco.controller.ClassDetail
	 * @public
	 * @extends sap.ui.core.mvc.controller
	 * @author Tom Van Doorslaer
	 * @classdesc
	 * 
	 */
	var ClassDetail = Controller.extend("be.fiddle.jsdoco.controller.ClassDetail", 
	/**@lends be.fiddle.jsdoco.controller.ClassDetail.prototype **/
	{ });
	
	ClassDetail.prototype.onRouteMatched = function(oEvent, oData){
		Controller.prototype.onRouteMatched.apply(this,arguments);

		let sRoute = oEvent.getParameters().name;
		let sPath = oEvent.getParameters().arguments["node*"];
		if (sPath && !sPath.startsWith("/")) {
			sPath = "/" + sPath;
		}

		if(sRoute === "ClassDisplay"){
			//try to retrieve the property from the model
			this.getView().bindElement({"path":sPath, "model":"classes"});
		}
	};

	ClassDetail.prototype.onOpenMasterFromDetail = function(oEvent){
		this.navTo("Classes");
	};

	ClassDetail.prototype.getMethodSignature= function (sMethod, aParams, oReturn){
		var sSig = "";

		sSig += this.getReturnSignature(oReturn) + sMethod + "( ";

		for(var i = 0; i < (aParams && aParams.length) ; i++){
			if(i>0){
				sSig += ", ";
			}
			sSig += aParams[i].name;
		}

		sSig += " );";
		return "<code>" + sSig + "</code>"; 
	};

	ClassDetail.prototype.getReturnSignature = function(oReturn){
		var sSig ="";

		for(var i = 0; i < (oReturn && oReturn.length) ; i++){
			if(i === 0){
				sSig += "( ";
			}

			if(i > 0){
				sSig += " | ";
			}

			for(var j=0; j < (oReturn[i].type && oReturn[i].type.names && oReturn[i].type.names.length) ; j++){
				if(j > 0){
					sSig += " | ";
				}				
				sSig += oReturn[i].type.names[j];
			}

			if(i === oReturn.length - 1){
				sSig += " ) : ";
			}
		}
		
		return sSig;
	};

	ClassDetail.prototype.getParamtype = function(aTypes){
		var sType = "";

		for(var i = 0; i < (aTypes && aTypes.length) ; i++){
			if(i === 0) sType += "(";
			if(i > 1) sType += "|";
			sType += aTypes[i];
			if(i === aTypes.length - 1) sType += ")";
		}

		return sType;
	};

	ClassDetail.prototype.isArrayVisible = function(aArray){
		return (Array.isArray(aArray) && aArray.length > 0);
	};

	ClassDetail.prototype.getJSON=function(oObject){
		return JSON.stringify(oObject);
	};
	
	return ClassDetail;
});