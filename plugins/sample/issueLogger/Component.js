sap.ui.define([
    "sap/ui/core/Component",
    "sap/ushell/ui/shell/ShellHeadItem",
], function (Component, ShellHeadItem) {
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
    **/
   IssueLogger.prototype.init = function () {
        let renderExtension = $.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");

        renderExtension.addHeaderEndItem(
            new ShellHeadItem({
                icon: "sap-icon://warning",
                //press: this.onButtonPress.bind(this),
                visible: true
            }), 
            "home", 
            "app"
        );

    };

    return IssueLogger;
});