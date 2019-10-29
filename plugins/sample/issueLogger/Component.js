sap.ui.define([
    "sap/ui/core/Component",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ui/core/Fragment"
], function (Component, ShellHeadItem, Fragment) {
    "use strict";

    /**
    * @name be.FiddleWookie.IssueLogger.Component
    * @alias be.FiddleWookie.IssueLogger.Component
    * @author Tom Van Doorslaer
    * @license Infrabel Private
    * @constructor
    * @public
    * @extends sap.ui.core.Component
    * @class
    * <p>The startedworkorder plugin lives in the header of the launchpad, and indicates whether there is a workorder htat has already been started.</p>
    * <p>If the user presses the button, he will automatically navigate to the workorder app and open the started workorder.</p>
    **/
    var IssueLogger = Component.extend("be.FiddleWookie.IssueLogger.Component", {
        metadata: {
            manifest: "json"
        },

        /**
        * <p>constructs the plugin. Nothing special here.</p>
        *
        * @constructs be.FiddleWookie.IssueLogger.Component
        * @public
        * @memberof be.FiddleWookie.IssueLogger.Component
        * @author Tom Van Doorslaer
        **/
        constructor: function(){
            Component.prototype.constructor.apply(this,arguments);
        },

        /**
        * <p>destroy the plugin. Nothing special here.</p>
        *
        * @method destroy
        * @public
        * @memberof be.FiddleWookie.IssueLogger.Component
        * @author Tom Van Doorslaer
        **/
        destroy: function(){
            Component.prototype.destroy.apply(this,arguments);
        }
    });

    /**
    *
    * @method init
    * @public
    * @instance
    * @memberof be.FiddleWookie.IssueLogger.Component
    * @author Tom Van Doorslaer
    * @todo the header item should be a draggable source, that triggers an event on a drop target.
    **/
    IssueLogger.prototype.init = function () {
        let renderExtension = $.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");

        renderExtension.addHeaderEndItem(
            new ShellHeadItem({
                icon: "sap-icon://warning",
                press: this.openIssueLogger.bind(this),
                visible: true,
                text: this.getModel("i18n").getResourceBundle().getText("issuelogger.title")
            }), 
            "home", 
            "app"
        );

    };

    /**
    * open up a popover from the issuelogger, showing the default information panel with the quick help for the issue logger
    * @method openIssueLogger
    * @public
    * @instance
    * @memberof be.FiddleWookie.IssueLogger.Component
    * @author Tom Van Doorslaer
    **/
    IssueLogger.prototype.openIssueLogger = function(event){
        const source = event.getSource();

        Fragment.load({
            name:"be.FiddleWookie.IssueLogger.fragments.Help", 
            controller:this
        }).then(function( popover ){
            this._help = popover;
            popover.openBy(source); //I seem to recall there being a setting to prevent the dialog from being registered on the core.
            popover.setModel(this.getModel("i18n"), "i18n");

            //self destruct
            popover.attachEvent("afterClose", {}, 
                function(){ 
                    this._help.destroy();
                    this._help = null;
                }, this );
        }.bind(this));
    };

    IssueLogger.prototype.closeHelp = function(event ){
        if (this._help) this._help.close();
    }

    return IssueLogger;
});