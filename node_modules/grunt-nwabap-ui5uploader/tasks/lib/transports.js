/*
 * grunt-nwabap-ui5uploader
 * https://github.com/pfefferf/grunt-nwabap-ui5uploader
 *
 * Copyright (c) 2018 Florian Pfeffer
 * Licensed under the Apache-2.0 license.
 */

'use strict';

var util = require('util');
var fsutil = require('./filestoreutil');
var unirest = require('unirest');
var CTS_BASE_URL = '/sap/bc/adt/cts/transports';
var AdtClient = require('./adt_client');
var XMLDocument = require('xmldoc').XmlDocument;

/**
 * creates and releases transport requests
 * @param {object}  oOptions
 * @param {object}  oOptions.conn               connection info
 * @param {string}  oOptions.conn.server        server url
 * @param {string}  oOptions.conn.client        sap client id
 * @param {boolean} oOptions.conn.useStrictSSL  force encrypted connection
 * @param {string}  oOptions.conn.proxy         set connection proxy
 * @param {string}  oOptions.auth.user          username
 * @param {string}  oOptions.auth.pwd           password
 * @param {Logger} oLogger
 * @constructor
 */
function Transports(oOptions, oLogger) {
    this.client = new AdtClient(oOptions.conn, oOptions.auth, undefined, oLogger);
}

Transports.prototype.createTransport = function (sPackageName, sRequestText, fnCallback) {
    var sPayload = this.getCreateTransportPayload(sPackageName, sRequestText);

    var sUrl = this.client.buildUrl(CTS_BASE_URL);
    this.client._determineCSRFToken(function (x) {
        var oRequest = unirest('POST', sUrl, {}, sPayload);
        oRequest.header('accept', '*/*');
        this.client.sendRequest(oRequest, function (oResponse) {
            if (oResponse.status === fsutil.HTTPSTAT.ok) {
                fnCallback(null, oResponse.body.split('/').pop());
                return;
            }
            fnCallback(new Error(fsutil.createResponseError(oResponse)));
        });
    }.bind(this));
};

/**
 * Determines if a transport with the given texdt already exists. If true the callback returns the transport no
 * otherwise the cb returns null
 * @param {String} transportText
 * @param {Function} fnCallback
 */
Transports.prototype.determineExistingTransport = function (transportText, fnCallback) {
    var sUrl = this.client.buildUrl(CTS_BASE_URL + '?_action=FIND&trfunction=K');
    var oRequest = unirest('GET', sUrl, {});
    oRequest.header('accept', '*/*');
    this.client.sendRequest(oRequest, function (oResponse) {
        if (oResponse.status === fsutil.HTTPSTAT.ok) {
            if (!oResponse.body) {
                return fnCallback(null, null);
            }
            var oParsed = new XMLDocument(oResponse.body);
            var transportNo = oParsed.valueWithPath('asx:values.DATA.CTS_REQ_HEADER.TRKORR');
            return fnCallback(null, transportNo);
        }
        fnCallback(new Error(fsutil.createResponseError(oResponse)));
    });
};

Transports.prototype.getCreateTransportPayload = function (sPackageName, sRequestText) {
    var sTemplate = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">' +
        '<asx:values>' +
        '<DATA>' +
        '<OPERATION>I</OPERATION>' +
        '<DEVCLASS>%s</DEVCLASS>' +
        '<REQUEST_TEXT>%s</REQUEST_TEXT>' +
        '</DATA>' +
        '</asx:values>' +
        '</asx:abap>';

    return util.format(sTemplate, sPackageName, sRequestText);
};

module.exports = Transports;
