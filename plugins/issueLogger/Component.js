sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/Fragment",
    "sap/ui/core/dnd/DragDropInfo"
], function (Component, Fragment,DragDropInfo) {
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
        this._headerItem = sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem(
            "sap.ushell.ui.shell.ShellHeadItem", 
            {
                icon: "sap-icon://warning",
                press: function(event){ 
                    this.openIssueLogger(event.getSource()); 
                }.bind(this),
                visible: true,
                text: this.getModel("i18n").getResourceBundle().getText("issuelogger.title")
            }, 
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
    IssueLogger.prototype.openIssueLogger = function(source){

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

    IssueLogger.prototype.onDrag = function(event){

    };

    IssueLogger.prototype.onDrop = function(event){
        let browserEvent = event.getParameter("browserEvent");        
        let target = document.elementFromPoint(browserEvent.clientX, browserEvent.clientY );
        //debugger;
        if (!target.id) {
            //can't get any info on this element
        } else {
            let control = sap.ui.getCore().byId(target.id);
            this.closeHelp();
            setTimeout( function(){ this.openIssueLogger(control) }.bind(this),200);
        }

    };

    return IssueLogger;
});