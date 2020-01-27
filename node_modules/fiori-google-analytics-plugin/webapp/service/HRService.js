sap.ui.define([
	"./CoreService"
], function (CoreService, Sorter) {
	"use strict";

	var HRService = CoreService.extend("be.wl.fiori.ga.service.HRService", {
		getUserInfo: function () {
			return this.odata("/ZODATA_BASIC_USER_DATA_CDS").get().then(function (resp) {
				return resp && resp.data && resp.data.results && resp.data.results.length > 0 && resp.data.results[0];
			});
		}
	});
	return new HRService();
});