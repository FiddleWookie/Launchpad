/* global window:true */
sap.ui.define([
	"sap/ui/core/Component"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("be.elia.bc.flp.ui.pic.Component", {

		metadata: {
			version: "@version@",
			library: "sap.ushell.demo.UIPluginSampleAddHeaderItems"
		},

		_getRenderer: function () {
			var that = this,
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");

			return new Promise(function (resolve, reject) {
				if (!that._oShellContainer) {
					reject(
						"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
				} else {
					oRenderer = that._oShellContainer.getRenderer();
					if (oRenderer) {
						resolve(oRenderer);
					} else {
						// renderer not initialized yet, listen to rendererCreated event
						that._oShellContainer.attachRendererCreatedEvent(function (oEvent) {
							oRenderer = oEvent.getParameter("renderer");
							if (oRenderer) {
								resolve(oRenderer);
							} else {
								reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
							}
						});
					}
				}
			});
		},

		init: function () {
			var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
			this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
			this._getRenderer().then(function (oRenderer) {
				var imageSource = "/sap/opu/odata/SAP/ZHR_USER_IMAGE_SRV/UserImageSet('')/$value";
				sap.ui.getCore().byId("meAreaHeaderButton").setIcon(imageSource);
				// $("#meAreaHeaderButton").html("<img style='width: 2.25rem; height:2.25rem;margin:0.25rem;' src=" + imageSource + ">");
				sap.ushell.Container.getService("UserInfo").getUser().setImage(imageSource);
				var oSheet = window.document.styleSheets[0];
				oSheet.insertRule('#sapUshellMeAreaContent .sapMImg { max-width:100px; }', 0);
			}).catch(function (sErrorMessage) {
				jQuery.sap.log.error(sErrorMessage, undefined, "be.elia.bc.flp.ui.pic");
			});
		},

		exit: function () {
			if (this._oShellContainer && this._onRendererCreated) {
				this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
			}
		}
	});
});