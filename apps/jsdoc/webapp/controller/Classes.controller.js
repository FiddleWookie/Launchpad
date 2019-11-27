sap.ui.define([
	"be/fiddle/jsdoco/controller/BaseController",
	"sap/ui/model/Filter"
], function(Controller, Filter) {
	"use strict";

	/**
	 * @name		be.fiddle.jsdoco.controller.Classes
	 * @alias 	be.fiddle.jsdoco.controller.Classes
	 * @constructor
	 * @public
	 * @extends sap.ui.core.mvc.Controller
	 * @class
	 * Tree structure of all classes in the documentation file.<br/>
	 **/
	const Classes = Controller.extend("be.fiddle.jsdoco.controller.Classes",
		/**@lends be.fiddle.jsdoco.controller.Classes.prototype */
		{ 
			_currentPath:null			
		}
	);
	
	Classes.prototype.onRouteMatched = function(event){
		Controller.prototype.onRouteMatched.apply(this,arguments);

		let navProps = event.getParameter("arguments");
		let path = navProps["node*"];

		this.loadDocoFromPath(path);
	};

	Classes.prototype.loadDocoFromPath = function(path){
		//check if this module was already loaded, otherwise, ignore.
		if ( path && !this._currentPath  || ! path.includes(this._currentPath) ){
			this._currentPath = path;

			//correct the path
			if (path.startsWith("/") ) path = path.substring(1); //trim of leading "/"
			if (path.indexOf("Component") > 0 ) path = path.substring(0, path.indexOf("Component") ); //take the path upto the component
			if (path.indexOf("Library") > 0 ) path = path.substring(0, path.indexOf("Library") ); //or upto the library		

			if (path.length) {
				path = path + "/documentation.json";//and then add the presumable path to the documentation
				let url = sap.ui.require.toUrl(path);
		
				//get the documentation file
				var oReq = new XMLHttpRequest();
				oReq.addEventListener("load", this.onDocoLoaded.bind(this));
				oReq.open("GET", url);
				oReq.send();		
			}
		}
	};

	Classes.prototype.onItemSelect = function(oEvent){
		var oItem = oEvent.getParameter("listItem");

		if(oItem ){
			var sPath = oItem.getBindingContext("classes").getPath();
			this.navToNode(sPath);
		}
	};

	Classes.prototype.onSearch = function (oEvent) { 
		// add filter for search
		var aFilters = [];
		var oFilter;
		var sQuery = this.getView().getModel("appSettings").getProperty("/search");

		if (sQuery && sQuery.length > 0) {
			oFilter = new Filter("key", sap.ui.model.FilterOperator.Contains, sQuery);
			aFilters.push(oFilter);
		}

		oFilter = new Filter("key", sap.ui.model.FilterOperator.Contains,"");
		aFilters.push(oFilter);

		// update list binding
		var oTree = this.getView().byId("treeLib");
		var oBinding = oTree.getBinding("items");
		if(oBinding){
			oBinding.filter(new Filter({filters:aFilters, and:true}), "Application");

			if(sQuery && sQuery.length > 0){
				this.expandTree(oTree);
			}else{
				this.collapseTree(oTree);
			}	
		}
	};

	Classes.prototype.onDocoLoaded = function( session ){
		if (session.target.status >= 200 && session.target.status <= 304 ) {
			this.constructLibrary(JSON.parse( session.target.response ) );
		} else {
			//invalid path
			let parts = this._currentPath.split("/"); //determine the parts of the path

			if (parts.length){
				parts.pop(); //pop off the last part
				this.loadDocoFromPath( parts.join("/") ); //try loading from a slightly higher path	
			} else {
				this.navTo("home")
			}

		}
	};

	Classes.prototype.onDocoFailed = function( oError ){
	};

	Classes.prototype.expandTree = function(oTree){
		oTree.expandToLevel(12);
		var aItems = oTree.getItems();

		for(var i = 0; i < aItems.length ; i++){
			if(aItems[i].isLeaf() ){
				aItems[i].setUnread(true);
			}
		}
	};

	Classes.prototype.collapseTree = function(oTree){
		var aItems = oTree.getItems();

		for(var i = 0; i < aItems.length ; i++){
			aItems[i].setUnread(false);
		}
		oTree.expandToLevel(0);		
	};

	Classes.prototype.constructLibrary = function(aComments){
		var oLibrary = {};
		var iLength = (aComments && aComments.length) || 0;

		//process each comment
		for(var i=0; i < iLength; i++){
			var oComment = aComments[i];
			let oNode ;

			//if a comment is not documented, simply skip it, otherwise, find where it fits
			if(!oComment.undocumented){
				switch (oComment.kind){
					case "class":
						oNode = this.addClass(oLibrary, oComment);
						break;
					case "event":
						oNode = this.addEvent(oLibrary,oComment);
						break;
					case "member":
					case "constant":
						oNode = this.addProperty(oLibrary, oComment);
						break;
					case "function":
					case "method":
						oNode = this.addMethod(oLibrary, oComment);
						break;
				}

				if( Array.isArray( oComment.todo ) ) {
					oNode.todo = oNode.todo.concat( oComment.todo );
				}
			}
		}
		this.getView().getModel("classes").setData(oLibrary);
		
		return oLibrary;
	};

	Classes.prototype.navToNode = function(sNode){
		if(sNode){
			this.navTo("ClassDisplay", {"node*":sNode });
		}else{
			this.navTo("Home");
		}
	};

	Classes.prototype.addClass = function(oLibrary, oComment){
		//get an existing or new node for the class, and extend it with the comment
		var sPath = oComment.name;
		if(sPath.indexOf(oComment.memberof) < 0 ){//if the name is a shorthand notation without the namespace: add it.
			sPath = oComment.memberof + "." + sPath;
		}
		var oNode = this.getNode(oLibrary, sPath);
		oNode.methods = [];

		$.extend(oNode, oComment);

		//next, get the superior namespace and add the class as a property
		sPath = oComment.memberof;
		oNode = this.getNode(oLibrary, sPath);
		if(oNode && oNode.properties){
			oNode.properties.push( {name:oComment.name, type:{names:["Class"]}, description:oComment.description } );
		}

		//add the todo's to the node.
		if(Array.isArray(oComment.todo)){
			oNode.todo = oNode.todo.concat(oComment.todo);
		}

		return oNode;
	};

	Classes.prototype.addEvent = function(oLibrary, oComment){
		var sPath = oComment.memberof;
		var oNode = this.getNode(oLibrary, sPath);
		
		if(!oNode.events){
			oNode.events = [];
		}

		oNode.events.push(oComment);
		return oNode;
	};

	Classes.prototype.addProperty = function(oLibrary, oComment){
		var sPath = oComment.memberof;
		var oNode = this.getNode(oLibrary, sPath);
		
		if(!oNode.properties){
			oNode.properties = [];
		}

		oNode.properties = oNode.properties.concat( oComment.properties );

		return oNode;
	};

	Classes.prototype.addMethod = function(oLibrary, oComment){
		var sPath = oComment.memberof;
		var oNode = this.getNode(oLibrary, sPath);
		
		if(!oNode.methods){
			oNode.methods = [];
		}

		oNode.methods.push(oComment);

		return oNode;		
	};

	Classes.prototype.getNode = function(oLibrary, sPath){
		var aParts = (sPath && sPath.split(".")) || [];
		var oNode = oLibrary;
		var sParent = "";

		for(var i=0; i< aParts.length; i++){

			//if the node you're looking for does not yet exist: create it and add it
			if(!oNode[aParts[i]]){
				oNode[aParts[i]] = {
					"key":aParts[i],
					"memberof": sParent,
					"classdesc":"",
					"alias": (sParent === "" ? aParts[i] : sParent + "." + aParts[i]),
					"properties":[],
					"children":[], //this will contain sub-namespaces
					"todo":[],
					"missing":[]
				};
			}		
			oNode = oNode[aParts[i]];
			sParent = (sParent === "" ? aParts[i] : sParent + "." + aParts[i]);
		}

		return oNode;
	};

	Classes.prototype.getLength = function(aArray){
		if( Array.isArray(aArray)){
			return "" + aArray.length;
		}
		return "0";
	};

	Classes.prototype.getVisibleFromArray = function(aArray){
		if( Array.isArray(aArray)){
			return (aArray.length > 0);
		} 
		return false;
	};
	
	return Classes;
});