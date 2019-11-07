sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter"
], function(Controller, Filter) {
	"use strict";

	var Classes = Controller.extend("be.fiddle.jsdoco.controller.Classes", { });
	
	Classes.prototype.onInit = function(oEvent){
		this._oRouter = this.getOwnerComponent().getRouter();
		this._oRouter.attachRoutePatternMatched(this.onRouteMatched, this);		
	};

	Classes.prototype.onExit = function(oEvent){
		if( this._oFileUploader ){
			this._oFileUploader.destroy();
			this._oFileUploader = null;
		}

		this._oRouter.detachRoutePatternMatched(this.onRouteMatched, this);		
	};

	Classes.prototype.onRouteMatched = function(oEvent, oData){
		var sRoute = oEvent.getParameter("name");
		var oArg = oEvent.getParameter("arguments");
		
		if(sRoute && sRoute.includes( "Class" ) ){	

			var oCtx = this.getView().getBindingContext("projects");

			if(!oCtx || oCtx.getPath() !== "/VersionSet('" + oArg.version + "')" ){ //new project/version selected: reconstruct!
			
				this.getView().setBindingContext( new sap.ui.model.Context( this.getView().getModel("projects"), "/VersionSet('" + oArg.version + "')" ), "projects") ;
				var oDoco = this.getView().getModel("projects").getProperty("/DocoSet('" + oArg.version + "')" ); //attempt to read the doco from the model
							
				if(!oDoco){ //doco not yet loaded. download and parse
					this.getView().getModel("projects").read(
						"/DocoSet('" + oArg.version + "')" ,
						{
							success:this.onDocoLoaded.bind(this),
							error:this.onDocoFailed.bind(this)
						}
					);
				}else{
					this.constructLibrary(JSON.parse( oDoco ) ) ;
				}	
				this.onSearch();
			}
		}
	};

	Classes.prototype.onItemSelect = function(oEvent){
		var oItem = oEvent.getParameter("listItem");

		if(oItem ){
			var sPath = oItem.getBindingContext("classes").getPath();
			var oVersion = this.getView().getBindingContext("projects").getObject();
			this.navToNode(sPath, oVersion);
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

	Classes.prototype.onToProjects = function(oEvent){
		this._oRouter.navTo("ProjectHome");
	};

	Classes.prototype.onUploadDoco = function(oEvent){
		//open up a small popup with a fileUploader
		if(!this._oFileUploader){
			this._oFileUploader = sap.ui.xmlfragment(this.getView().getId(), "be.fiddle.jsdoco.fragments.UploadFile", this);
			this.getView().addDependent(this._oFileUploader);
		}

		if(this._oFileUploader){
			this._oFileUploader.open();
		}
	};

	Classes.prototype.onFileSelected = function(oEvent){
		var aFiles = oEvent.getParameter("files");
		var oReader = new FileReader();
		
		oReader.onload = function(oFile) { 
			//do something with oFile.target.result
			var oCtx = this.getView().getBindingContext("projects");
			var oVersion = oCtx.getObject();
			var oDocoModel = this.getView().getModel("projects");

			oDocoModel.setProperty("/DocoSet('" + oVersion.Id + "')/Content", oFile.target.result);
			this.constructLibrary( JSON.parse(oFile.target.result) );
		}.bind(this);
		
		oReader.readAsBinaryString(aFiles[0]);
	};

	Classes.prototype.onDocoLoaded = function( oData, oResponse ){
		this.constructLibrary(JSON.parse( oData.Content) );
	};

	Classes.prototype.onDocoFailed = function( oError ){
	};

	Classes.prototype.onFileSave = function(oEvent){
		this.getView().getModel("projects").submitChanges();
		this._oFileUploader.close();
	};
	
	Classes.prototype.onFileCancel = function(oEvent){
		this.getView().getModel("projects").resetChanges();
		this._oFileUploader.close();

		var oVersion = this.getView().getBindingContext("projects").getObject();
		var oDoco = this.getModel("projects").getProperty("/DocoSet('" + oVersion.Id + "')/Content");
	
		this.constructLibrary( JSON.parse(oDoco) );		
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

			//if a comment is not documented, simply skip it, otherwise, find where it fits
			if(!oComment.undocumented){
				switch (oComment.kind){
					case "class":
						this.addClass(oLibrary, oComment);
						break;
					case "event":
						this.addEvent(oLibrary,oComment);
						break;
					case "member":
					case "constant":
						this.addProperty(oLibrary, oComment);
						break;
					case "function":
					case "method":
						this.addMethod(oLibrary, oComment);
						break;
				}
			}
		}
		this.getView().getModel("classes").setData(oLibrary);
		
		//now that the library is loaded, let's trigger the navigation
		var sNode = this.getView().getModel("appSettings").getProperty("/path");
		var sPath = this.getView().getBindingContext("projects").getPath();
		var oVersion = this.getView().getModel("projects").getProperty(sPath);

		if(oVersion){
			 this.navToNode(sNode, oVersion );
		}else {
			this.getView().getModel("projects").read(sPath, {
				success: this.navToNode.bind(this,sNode),
				error: this.navToNode.bind(this,sNode)
			});
		}


		return oLibrary;
	};

	Classes.prototype.navToNode = function(sNode, oVersion){
		if(sNode){
			this._oRouter.navTo("ClassDisplay", {"node*":sNode, "name":oVersion.Project, "version":oVersion.Id });
		}else{
			this._oRouter.navTo("ClassHome", { "name":oVersion.Project, "version":oVersion.Id});
		}
	};

	Classes.prototype.addClass = function(oLibrary, oComment){
		//get an existing or new node for the class, and extend it with the comment
		var sPath = oComment.alias;
		var oNode = this.getNode(oLibrary, sPath);
		oNode.methods = [];

		$.extend(oNode, oComment);

		//next, get the superior namespace and add the class as a property
		sPath = oComment.memberof;
		oNode = this.getNode(oLibrary, sPath);
		if(oNode && oNode.properties){
			oNode.properties.push( oComment.alias );
		}else{
			//debugger; //why does the node not have properties? //because the memberof is incorrect!
		}
	};

	Classes.prototype.addEvent = function(oLibrary, oComment){
		var sPath = oComment.memberof;
		var oNode = this.getNode(oLibrary, sPath);
		
		if(!oNode.events){
			oNode.events = [];
		}

		oNode.events.push(oComment);
	};

	Classes.prototype.addProperty = function(oLibrary, oComment){
		var sPath = oComment.memberof;
		var oNode = this.getNode(oLibrary, sPath);
		
		if(!oNode.properties){
			oNode.properties = [];
		}

		oNode.properties.push(oComment);
	};

	Classes.prototype.addMethod = function(oLibrary, oComment){
		var sPath = oComment.memberof;
		var oNode = this.getNode(oLibrary, sPath);
		
		if(!oNode.methods){
			oNode.methods = [];
		}

		oNode.methods.push(oComment);
		//if a method or a member contains todo's, they must be added to the class
		if(oComment.todo instanceof Array ){
			/*for (var i = 0; i < oComment.todo.length; i++){
				oNode.todo.push( oComment.todo[i]);
			}*/ //error in here... or some infinite loop
		}
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