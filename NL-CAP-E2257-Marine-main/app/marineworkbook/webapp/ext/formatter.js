sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
    "use strict";

    return {

        previousVolVisible: function (qty) {
            return qty !== null && qty !== undefined;
        },
        getErrorIconVisible: function (items) {
            return items ? items.length > 0 : false;
        },

        getErrorIconText: function (items) {
            return items ? items.length : 0;
        },

        getErrorHighlightColor: function (code) {
            if (code) {
                switch (code) {
                    case "E":
                        return "Error";
                    case "W":
                        return "Indication03";
                    case "S":
                        return "Success";
                    case "I":
                        return "Information";
                    default:
                        return "None";
                }
            } else {
                return "None";
            }
        },
        isOpen: function (sStatus) {
            return !(sStatus === "Open");
        },

        enableTicketVol: function (sStatus, znom) {
            if ((sStatus === "Nominated" || sStatus === "Ticketed") && (znom !== undefined && znom !== null && znom !== ""))
                return true;
            else
            return false;
        }
    };
});
