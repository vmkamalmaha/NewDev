sap.ui.define([
    "sap/ui/core/UIComponent",
    "marineworkbook/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("marineworkbook.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            // Read Token Data
            this.getModel().read("/TokenData", {
                success: function (oData) {
                    console.log("TokenData fetched successfully:", oData);
                },
                error: function (oError) {
                    console.error("Error fetching TokenData:", oError);
                }
            });
        }
    });
});