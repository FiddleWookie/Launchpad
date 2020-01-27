sap.ui.define([
	"./CoreService"
], function (CoreService, Sorter) {
	"use strict";

	var ConfigService = CoreService.extend("be.wl.fiori.lang.service.ConfigService", {
		getConfig: function () {
			return this.odata("/ConfigSet").get();
		},
		getLanguage: function () {
			if (!this.model) {
				return Promise.resolve({
					data: {
						Value: this.selectedLanguage || "EN"
					}
				});
			}
			return this.odata("/ConfigSet('Language')").get();
		},
		updateConfig: function (sKey, sValue) {
			if (!this.model) {
				this.selectedLanguage = sValue;
				return Promise.resolve({
					data: {
						Value: sValue
					}
				});
			}
			var oConfig = {
				Key: sKey,
				Value: sValue
			};
			return this.odata("/ConfigSet('" + sKey + "')").put(oConfig);
		},
		updateLanguage: function (sLanguage) {
			return this.updateConfig("Language", sLanguage);
		}
	});
	return new ConfigService();
});