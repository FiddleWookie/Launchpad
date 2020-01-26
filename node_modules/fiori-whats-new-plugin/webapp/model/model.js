sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";
	var demoData = {
		"FolderSet": {
			"data": {
				"results": [{
					"Name": "LATEST",
					"Date": new Date(),
					"Folderpath": "",
					"AmountFiles": 1,
					"Status": false,
					"FileInfo": {
						"results": [{
							"Name": "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
							"Size": "123953",
							"Foldername": "",
							"FileMimetype": "video/mp4",
							"FileType": "video",
							"FileExtension": "mp4",
							"FileTitle": "Whats New - 1/2",
							"FileText": "What's new example"
						}, {
							"Name": "https://raw.githubusercontent.com/SAP/ui5-migration/master/docs/images/UI5_logo_wide.png",
							"Size": "123953",
							"Foldername": "",
							"FileMimetype": "image/png",
							"FileType": "image",
							"FileExtension": "PNG",
							"FileTitle": "Whats New - 1/2",
							"FileText": "What's new example"
						}]
					}
				}, {
					"Name": "20200118",
					"Date": new Date(),
					"Folderpath": "",
					"AmountFiles": 1,
					"Status": false,
					"FileInfo": {
						"results": [{
							"Name": "https://raw.githubusercontent.com/SAP/ui5-migration/master/docs/images/UI5_logo_wide.png",
							"Size": "123953",
							"Foldername": "",
							"FileMimetype": "image/png",
							"FileType": "image",
							"FileExtension": "PNG",
							"FileTitle": "Whats New - 1/2",
							"FileText": "What's new example"
						}, {
							"Name": "https://raw.githubusercontent.com/SAP/ui5-migration/master/docs/images/UI5_logo_wide.png",
							"Size": "123953",
							"Foldername": "",
							"FileMimetype": "image/png",
							"FileType": "image",
							"FileExtension": "PNG",
							"FileTitle": "Whats New - 1/2",
							"FileText": "What's new example"
						}]
					}
				}]
			}
		}
	};
	return {
		getFolders: function () {
			return demoData.FolderSet;
		},
		getFolder: function (name) {
			return {
				data: demoData.FolderSet.data.results.filter(function (folder) {
					return folder.Name === name;
				})[0]
			} || false;
		}

	};
});