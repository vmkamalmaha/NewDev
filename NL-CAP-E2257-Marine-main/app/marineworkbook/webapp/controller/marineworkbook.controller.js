//** welcome kamalakannan **//

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet",
    "marineworkbook/ext/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    //'sap/m/Link',
    'sap/m/MessageItem',
    'sap/m/MessageView',
    'sap/m/Button',
    'sap/ui/core/IconPool',
    'sap/m/Bar',
    'sap/m/Title'
], (Controller, Dialog, Fragment, Spreadsheet, formatter, Filter, FilterOperator, JSONModel, MessageItem, MessageView, Button, IconPool, Bar, Title) => {
    "use strict";

    return Controller.extend("marineworkbook.controller.marineworkbook", {
        formatter: formatter,
        onInit: function () {
            var oModel = this.getOwnerComponent().getModel();
            oModel.setSizeLimit("100000");
            this.getView().setModel(oModel);
            this.focusInPressed = false;
            this.focusLoc = "";
            this._txtAreaCargo = this.byId("txtareacargo");
            this._txtAreaTradeNum = this.byId("txtarea");
            this._initMessageViewDialog();
            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorBtnVis", false);
            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/TodaysDate", new Date());
            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/NoOfRowsToFreeze", 0);
        },

        _initMessageViewDialog: function () {
            var that = this;

            // Template for MessageItem
            var oMessageTemplate = new MessageItem({
                type: '{type}',
                title: '{title}',
                description: '{title}',
                subtitle: '{subtitle}',
                counter: '{counter}',
                markupDescription: '{markupDescription}'
            });

            // Create MessageView
            this.oMessageView = new MessageView({
                showDetailsPageHeader: false,
                itemSelect: function () {
                    oBackButton.setVisible(true);
                },
                items: {
                    path: "/",
                    template: oMessageTemplate
                }
            });

            // Back button for navigation
            var oBackButton = new Button({
                icon: IconPool.getIconURI("nav-back"),
                visible: false,
                press: function () {
                    that.oMessageView.navigateBack();
                    this.setVisible(false);
                }
            });

            // Create and set Dialog
            this.oDialog = new Dialog({
                resizable: true,
                content: this.oMessageView,
                state: 'Error',
                beginButton: new Button({
                    press: function () {
                        this.getParent().close();
                    },
                    text: "Close"
                }),
                customHeader: new Bar({
                    contentLeft: [oBackButton],
                    contentMiddle: [
                        new Title({
                            text: "Error Details"
                            // level: TitleLevel.H1
                        })
                    ]
                }),
                contentHeight: "50%",
                contentWidth: "50%",
                verticalScrolling: false
            });
        },

        handleMessageViewPress: function (oEvent) {
            this.oMessageView.navigateBack();
            this.handleDialogPress(undefined, this.getOwnerComponent().getModel("viewSettingsModel").getProperty("/ErrorData"));
            // this.oDialog.open();
        },

        // onShipToFieldChange: function (oEvent) {
        //     // Get ODataModel
        //     var oModel = this.getView().getModel(); // Get the default OData model 
        //     var oSource = oEvent.getSource();
        //     var oBindingContext = oSource.getBindingContext();

        //     // Read data from OData to fetch the text
        //     oModel.read("/ShipToVHSet", {
        //         urlParameters: {
        //             "$filter": "Conpat eq '" + oEvent.getSource().getValue() + "'"
        //         },
        //         success: function (oData) {
        //             debugger;
        //             if (oData.results.length > 0)
        //                 oBindingContext.getModel().setProperty(oBindingContext.getPath() + "/ShipToLocation", oData.results[0].City)
        //         },
        //         error: function (oError) {
        //             debugger;
        //             console.error("Error fetching Value Help text:", oError);
        //         }
        //     });
        //     this.onFieldChange(oEvent);

        // },

        onPressExport: function () {
            var oTable = this.byId("marineSmartTableInner");
            var aRows = oTable.getBinding("rows").getContexts();
            var aExportData = [];

            // Direct mapping of fields based on table configuration in XML view
            var aColumns = [
                { label: "SAP Status", property: "SapStatus" },
                { label: "Cargo Reference", property: "CargoReference" },
                { label: "Nomination Number", property: "NominationKey" },
                { label: "Trade Number", property: "TradeNumber" },
                { label: "Contract", property: "SAPContract" },
                { label: "YNom", property: "YNomHdr" },
                { label: "ZNom", property: "ZNomHdr" },
                { label: "Grade", property: "Grade" },
                { label: "Scheduled Material", property: "ScheduledMaterialDesc" },
                { label: "Demand Material", property: "DemandMaterialDesc" },
                { label: "Counterparty", property: "CounterParty" },
                { label: "Buy/Sell", property: "BuySell" },
                { label: "Incoterms", property: "Incoterms" },
                { label: "Vessel", property: "Vessel" },
                { label: "Shipper", property: "Shipper" },
                { label: "FC Charter Doc", property: "FCCharterDoc" },
                { label: "Load Location", property: "LoadLocation" },
                { label: "Load Window", property: "LoadWindow" },
                { label: "Ship To", property: "ShipTo" },
                { label: "Ship To Location", property: "ShipToLocation" },
                { label: "Transfer Point Location", property: "TPTLocation" },
                { label: "Cargo Destination", property: "CargoDestination" },
                { label: "Contract Volume", property: "ContractVolume" },
                { label: "Zero Out Volume", property: "ZeroOutVolume" },
                { label: "Nom Volume", property: "NomVolume" },
                { label: "Tolerance", property: "ToleranceMin" },
                { label: "BL Date", property: "BLDate" },
                { label: "Title Transfer Date", property: "TitleTransferDate" },
                { label: "Ticket Volume", property: "TicketVolume" }
            ];

            // Extract row data for the columns
            aRows.forEach(function (oContext) {
                var oRowData = oContext.getObject();
                var oExportRow = {};

                aColumns.forEach(function (oColumn) {
                    if (oColumn.property === "YNomHdr" || oColumn.property === "ZNomHdr") {
                        const cleanedHdr = oRowData[oColumn.property] ? oRowData[oColumn.property].replace(/^0+/, '') : '';
                        const cleanedItm = oRowData[oColumn.property.replace("Hdr", "Itm")] ? oRowData[oColumn.property.replace("Hdr", "Itm")].replace(/^0+/, '') : '';
                        oExportRow[oColumn.label] = cleanedHdr + "-" + cleanedItm;
                    }
                    else if (oColumn.property === "TradeNumber") {
                        const cleanedHdr = oRowData[oColumn.property];
                        const cleanedItm = oRowData['SectionVal'];
                        oExportRow[oColumn.label] = cleanedHdr + "-" + cleanedItm;
                    }
                    else if (oColumn.property === "ToleranceMin") {
                        const cleanedHdr = oRowData[oColumn.property];
                        const cleanedItm = oRowData['ToleranceMax'];
                        oExportRow[oColumn.label] = cleanedHdr + "-" + cleanedItm;
                    }
                    else {
                        oExportRow[oColumn.label] = oRowData[oColumn.property];
                    }
                });

                aExportData.push(oExportRow);
            });

            // Define export settings
            var oSettings = {
                workbook: {
                    columns: aColumns.map(function (oColumn) {
                        return { label: oColumn.label, property: oColumn.label };
                    })
                },
                dataSource: aExportData,
                fileName: "TradeData.xlsx"
            };

            // Create and build the spreadsheet
            var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
            oSpreadsheet.build()
                .then(function () {
                    sap.m.MessageToast.show("Export successful");
                })
                .catch(function (oError) {
                    sap.m.MessageToast.show("Export failed: " + oError.message);
                });
        },

        onAfterRendering: function () {
            var oInput = this.byId("cargoDest");
            oInput.attachBrowserEvent("focusin", this.handleInputFocus.bind(this));
            var oBlDate = this.byId("blDateSF");
            oBlDate.attachEvent("innerControlsCreated", this.handleInputFocusDate.bind(this));
            var oTTDate = this.byId("ttDateSF");
            oTTDate.attachEvent("innerControlsCreated", this.handleInputFocusDate.bind(this));

            var oSmartFilterBar = this.byId("marineSmartFilterBar");

            var oField = oSmartFilterBar.getControlByKey("Vessel"); // Replace with your field key
            if (oField) {
                oField.setEnabled(false); // Disable the field to make it non-editable
                oField.setEditable(false);
            }

        },
        // handleInputFocusDate: function (oEvent) {
        //     oEvent.getSource().getInnerControls()[0].setMaxDate(new Date());
        // },

        handleInputFocus: function (oEvent) {
            this.focusLoc = oEvent.target;
            var txtAreaVal = oEvent.target.value;
            if (this.focusInPressed) {
                this.focusInPressed = false;
                this.focusLoc = "";
            }
            // Load the Dialog fragment
            else {
                this.focusInPressed = true;
                if (!this._oDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "marineworkbook.view.fragment.cargoDestinationPopover",
                        controller: this
                    }).then(function (oDialog) {
                        this._oDialog = oDialog;
                        this.getView().addDependent(this._oDialog);
                        this.byId("textArea").setValue(txtAreaVal);
                        this._oDialog.open();
                    }.bind(this));
                } else {
                    this._oDialog.open();
                }
            }
        },

        onDialogOkPress: function (oEvent) {
            var textAreaVal = this.byId("textArea").getValue();
            this.focusLoc.value = textAreaVal;
            this.byId("textArea").setValue("");
            this._oDialog.close();
        },
        onDialogOkCancel: function (oEvent) {
            this.byId("textArea").setValue("");
            this._oDialog.close();
        },

        onNomVolChange: function (oEvent) {
            var oSource = oEvent.getSource();
            var oBindingContext = oSource.getBindingContext();
            var oModel = oBindingContext.getModel();

            // Retrieve the current row data
            var oCurrentRowData = oBindingContext.getObject();
            // Copy current NomVolume to PrevNomVolume
            if (oCurrentRowData.NomVolume !== undefined)
                oModel.setProperty(oBindingContext.getPath() + "/PrevNomVolume", oEvent.getSource().getProperty("value"));

            if (oCurrentRowData.BuySell === "Buy" && oSource.getValue() !== '0.00') {
                // Validate CargoReference and NomVolume
                if (!oCurrentRowData.CargoReference || oCurrentRowData.NomVolume === undefined) {
                    sap.m.MessageBox.error("Invalid CargoReference or NomVolume.");
                    return;
                }

                var sCargoReference = oCurrentRowData.CargoReference;
                var sCurrentRowPath = oBindingContext.getPath(); // Path of the current row

                // Find the table by its ID
                var oTable = this.byId("marineSmartTableInner");
                var oBinding = oTable.getBinding("rows");
                if (!oBinding) {
                    sap.m.MessageBox.error("Table is not bound to a model!");
                    return;
                }

                // Get all row contexts bound to the table
                var aContexts = oBinding.getContexts();
                if (aContexts.length === 0) {
                    sap.m.MessageBox.error("No data found in the table.");
                    return;
                }

                // Step 1: Calculate the sum of NomVolume for rows matching the condition
                var iSumNomVolume = 0;
                aContexts.forEach(function (oRowContext) {
                    var oRowData = oRowContext.getObject();
                    if (oRowData.CargoReference === sCargoReference &&
                        oRowData.BuySell === "Buy" &&
                        oRowData.InterCompanyDeal === true) {
                        iSumNomVolume += parseFloat(oRowData.NomVolume || 0);
                    }
                });

                // Step 2: Copy the calculated sum to rows matching the other condition
                aContexts.forEach(function (oRowContext) {
                    var oRowData = oRowContext.getObject();
                    var sPath = oRowContext.getPath();

                    // Skip the current row
                    if (sPath !== sCurrentRowPath &&
                        oRowData.CargoReference === sCargoReference &&
                        oRowData.BuySell === "Buy" &&
                        oRowData.InterCompanyDeal === true) {
                        oModel.setProperty(`${sPath}/NomVolume`, iSumNomVolume);
                    }
                });
            }
            // Step 3: Optionally trigger additional logic (if needed)
            this.onFieldChange(oEvent);
        },



        onBLDateChange: function (oEvent) {
            this.updateFieldForCargoReference(oEvent, "BLDate");
            this.onFieldChange(oEvent);
        },

        onTTLDateChange: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            if (oContext.getObject().BuySell !== "Sell") {
                this.updateFieldForCargoReference(oEvent, "TitleTransferDate");
            }
            this.onFieldChange(oEvent);
        },

        onVesselChange: function (oEvent) {
            this.updateFieldForCargoReference(oEvent, "Vessel");
            this.onFieldChange(oEvent);
        },

        onFCDocChange: function (oEvent) {
            this.updateFieldForCargoReference(oEvent, "FCCharterDoc");
            this.onFieldChange(oEvent);
        },

        onShipperChange: function (oEvent) {
            this.updateFieldForCargoReference(oEvent, "Shipper");
            this.onFieldChange(oEvent);
        },

        onTransportChange: function (oEvent) {
            this.updateFieldForCargoReference(oEvent, "TransportSystem");
            this.onFieldChange(oEvent);
        },

        onCarrierChange: function (oEvent) {
            this.updateFieldForCargoReference(oEvent, "Carrier");
            this.onFieldChange(oEvent);
        },

        onTicketVolChange: function (oEvent) {
            var oSource = oEvent.getSource();
            var oBindingContext = oSource.getBindingContext();
            var oModel = oBindingContext.getModel();

            // Retrieve the current data context
            var oData = oBindingContext.getObject();

            // Copy the value from SAPSchedulerQuantity to SAPSchedulerQuantityPrev
            if (oData.TicketVolume !== undefined) {
                oModel.setProperty(oBindingContext.getPath() + "/PrevTicketVolume", oEvent.getSource().getProperty("value"));
            }
            this.onFieldChange(oEvent);

        },

        onUndoNomVolPress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oBindingContext = oSource.getBindingContext();

            // Retrieve the current data context
            var oData = oBindingContext.getObject();

            if (oData.PrevNomVolume !== undefined && oData.PrevNomVolume !== null) {
                oBindingContext.getModel().setProperty(oBindingContext.getPath() + "/NomVolume", oData.PrevNomVolume);
                oBindingContext.getModel().setProperty(oBindingContext.getPath() + "/PrevNomVolume", null);
            }
        },

        onUndoTicketVolPress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oBindingContext = oSource.getBindingContext();

            // Retrieve the current data context
            var oData = oBindingContext.getObject();

            if (oData.PrevTicketVolume !== undefined && oData.PrevTicketVolume !== null) {
                oBindingContext.getModel().setProperty(oBindingContext.getPath() + "/TicketVolume", oData.PrevTicketVolume);
                oBindingContext.getModel().setProperty(oBindingContext.getPath() + "/PrevTicketVolume", null);
            }


        },

        onFieldChange: function (oEvent) {
            var oSource = oEvent.getSource();
            var oBindingContext = oSource.getBindingContext();
            var oTable = this.byId("marineSmartTableInner");
            var oBinding = oTable.getBinding("rows");
            var aContexts = oBinding.getContexts(0, this.getOwnerComponent().getModel("viewSettingsModel").getProperty("/TotalItems"));
            var aSelectedIndices = oTable.getSelectedIndices(); // Get currently selected indices

            var iRowIndex = aContexts.findIndex(function (oContext) {
                return oContext.getPath() === oBindingContext.getPath();
            });

            if (iRowIndex !== -1) {
                // Check if the row is already selected
                if (!aSelectedIndices.includes(iRowIndex)) {
                    aSelectedIndices.push(iRowIndex); // Add new index to selected indices
                }
                oTable.clearSelection(); // Clear previous selection
                aSelectedIndices.forEach(function (iIndex) {
                    oTable.addSelectionInterval(iIndex, iIndex); // Re-select indices including the newly selected one
                });
            }
        },

        onPopoverOkPress: function () {
            // Logic for OK button
            var oPopoverInput = this.byId("popoverInput");
            var sValue = oPopoverInput.getValue();
            sap.m.MessageToast.show("Value entered: " + sValue);

            // Close the Popover
            this._oPopover.close();
        },

        onSearchFilterbar: function (oEvent) {
            var oComponent = this.getOwnerComponent();
            var oViewSettingsModel = oComponent.getModel("viewSettingsModel");
            //  oViewSettingsModel.setProperty("/ErrorBtnVis", false);
            // Get the SmartFilterBar instance
            var oSmartFilterBar = this.byId("marineSmartFilterBar"); // Replace with your SmartFilterBar ID

            // Check if any filters are applied
            var aFilters = oSmartFilterBar.getFilters();
            if (aFilters.length === 0) {
                // No filters applied; show a message to the user
                sap.m.MessageBox.information("Apply a filter to display data in the table.", {
                    title: "No Filters Applied",
                });
                oEvent.preventDefault();
                return; // Exit the function to prevent further execution
            }
        },

        onLiveChangePreventNewline: function (oEvent) {
            let sValue = oEvent.getParameter("value");
            sValue = sValue.replace(/\n/g, " "); // Replace newline with space
            sValue = sValue.replace(/\t/g, " "); // Replace newline with space
            oEvent.getSource().setValue(sValue);
        },

        updateFieldForCargoReference: function (oEvent, fieldName) {
            // Find the table by its ID (assuming table ID is fixed and known)
            var oTable = this.byId("marineSmartTableInner");

            // Get the binding of the table's rows
            var oBinding = oTable.getBinding("rows");
            if (!oBinding) {
                sap.m.MessageBox.error("Table is not bound to a model!");
                return;
            }

            // Get all rows bound to the table
            var aContexts = oBinding.getContexts();
            if (aContexts.length === 0) {
                sap.m.MessageBox.error("No data found in the table.");
                return;
            }

            // Get the triggering event source to extract the current value and CargoReference
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            if (!oContext) {
                sap.m.MessageBox.error("Unable to determine the current context.");
                return;
            }

            var oModel = oContext.getModel();
            var oCurrentRowData = oContext.getObject();
            var sCurrentCargoReference = oCurrentRowData.CargoReference;
            var sCurrentValue = oCurrentRowData[fieldName];

            if (!sCurrentCargoReference || sCurrentValue === undefined) {
                sap.m.MessageBox.error("Invalid CargoReference or value.");
                return;
            }

            // Iterate through rows and update the specified field for matching CargoReferences
            var bStartUpdating = false;
            var bUpdated = false;

            for (var i = 0; i < aContexts.length; i++) {
                var oRowContext = aContexts[i];
                var oRowData = oRowContext.getObject();

                // Check if the current row matches the desired CargoReference
                if (oRowData.CargoReference === sCurrentCargoReference) {
                    bStartUpdating = true; // Start updating from this row onwards
                }

                // If the desired CargoReference has not been reached, skip the row
                if (!bStartUpdating) {
                    continue;
                }

                // If the CargoReference changes, stop further processing
                if (oRowData.CargoReference !== sCurrentCargoReference) {
                    break;
                }
                if (fieldName === "TitleTransferDate" && oRowData.SapStatus === "Open" && (oRowData.BuySell === "Buy" || oRowData.BuySell === "" || oRowData.BuySell === undefined || oRowData.BuySell === null)) {
                    // Update TitleTransferDate only if BuySell = 'B'
                    if (oRowData.BuySell === "Buy") {
                        var sPath = oRowContext.getPath();
                        oModel.setProperty(`${sPath}/${fieldName}`, sCurrentValue);
                        bUpdated = true;
                    }
                }
                // Conditional update logic
                else if ((fieldName === "BLDate" || fieldName === "TransportSystem" || fieldName === "Carrier" || fieldName === "Shipper" || fieldName === "Vessel" || fieldName === "FCCharterDoc") && oRowData.SapStatus === "Open") {
                    // Always update BLDate for matching CargoReferences
                    var sPath = oRowContext.getPath();
                    oModel.setProperty(`${sPath}/${fieldName}`, sCurrentValue);
                    bUpdated = true;
                }
            }
        },

        checkAllOpenCaroRefItemsSelected: function (oEvent) {
            var oTable = this.byId("marineSmartTableInner");
            var aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length === 0) {
                return { success: false, message: "Please select at least one item." };
            }

            var oModel = this.getOwnerComponent().getModel();
            var aSelectedCargoReferences = [];
            var oSelectedCargoCounts = {};

            aSelectedIndices.forEach(iIndex => {
                var sPath = oTable.getContextByIndex(iIndex).getPath();
                var oData = oModel.getProperty(sPath);

                if (oData.SapStatus === "Open") {
                    aSelectedCargoReferences.push(oData.CargoReference);
                    oSelectedCargoCounts[oData.CargoReference] = (oSelectedCargoCounts[oData.CargoReference] || 0) + 1;
                }
            });

            // if (aSelectedCargoReferences.length === 0) {
            //     return { success: false, message: "No CargoReference with 'Open' status found in the selected items." };
            // }

            var aAllRows = oTable.getBinding("rows").getContexts();
            var oAllCargoCounts = {};

            aAllRows.forEach(oContext => {
                var oRowData = oContext.getObject();
                if (oRowData.SapStatus === "Open") {
                    oAllCargoCounts[oRowData.CargoReference] = (oAllCargoCounts[oRowData.CargoReference] || 0) + 1;
                }
            });

            for (var sCargoRef in oSelectedCargoCounts) {
                if (oSelectedCargoCounts[sCargoRef] !== oAllCargoCounts[sCargoRef]) {
                    return { success: false, message: "Not all 'Open' deals are selected for Cargo Reference '" + sCargoRef + "'." };
                }
            }

            return { success: true, message: "" };
        },

        onPressCreateUpdateNom: function (oEvent) {
            var oTable = this.byId("marineSmartTableInner");
            var aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length === 0) {
                sap.m.MessageBox.error("Please select at least one item.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var aSelectedData = [];
            var bHasTicketed = false;

            for (var i = 0; i < aSelectedIndices.length; i++) {
                var iIndex = aSelectedIndices[i];
                var sPath = oTable.getContextByIndex(iIndex).getPath();
                var oData = oModel.getProperty(sPath);

                // Perform a deep copy of oData to avoid two-way binding issues
                var oDataCopy = JSON.parse(JSON.stringify(oData));

                // Mandatory check for required fields
                if ((oDataCopy.SAPContract !== null && oDataCopy.SAPContract !== "" && oDataCopy.SAPContract !== undefined) && (!oDataCopy.TransportSystem || !oDataCopy.ShipTo || !oDataCopy.NomVolume || !oDataCopy.BLDate || !oDataCopy.TitleTransferDate || !oDataCopy.Shipper)) {
                    sap.m.MessageBox.error(
                        `Mandatory fields are missing in one or more selected items.\n\nPlease ensure the following fields are filled:\n- TransportSystem\n- ShipTo\n- NomVolume\n- BLDate\n- TitleTransferDate\n- Shipper.`
                    );
                    return;
                }

                // Transform the NomDetailSet
                if (oDataCopy.NomDetailSet && oDataCopy.NomDetailSet.__list) {
                    oDataCopy.NomDetailSet = oDataCopy.NomDetailSet.__list.map(detail => {
                        var match = detail.match(/NomHdr='(.+?)',NomItem='(.+?)'/);
                        return {
                            NomHdr: match[1],
                            NomItem: match[2]
                        };
                    });
                }

                // Remove the ErrorDetailSet if it exists
                if (oDataCopy.ErrorDetailSet && oDataCopy.ErrorDetailSet.__list) {
                    delete oDataCopy.ErrorDetailSet;
                }

                // Remove unnecessary properties
                delete oDataCopy.PrevNomVolume;
                delete oDataCopy.PrevTicketVolume;

                if (oDataCopy.SapStatus === "Ticketed") {
                    bHasTicketed = true;
                } else {
                    delete oDataCopy.__metadata;
                    delete oDataCopy.ErrorDetailSet;
                    aSelectedData.push(oDataCopy);
                }
            }

            var bCountsMatch = this.checkAllOpenCaroRefItemsSelected(oEvent);

            var msg = bCountsMatch.message + " Create/update nomination(s)? Any items with no changes to quantity will be ignored.";
            if (bHasTicketed) {
                msg = "You have selected ticketed records, those will be ignored. Create/update nomination(s)? Any items with no changes to quantity will be ignored.";
            }

            msg = bCountsMatch.message + " Confirm you want to create/update nomination(s)?";
            // if (bCountsMatch) {
            // Show a confirmation box to proceed with non-ticketed records
            sap.m.MessageBox.confirm(msg, {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        let payload = {
                            "Identifier": "S",
                            "MarinesObligationDetailSet": aSelectedData
                        };

                        function removeRefValues(obj) {
                            for (var prop in obj) {
                                if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                                    if (obj[prop].hasOwnProperty("__ref")) {
                                        delete obj[prop]["__ref"];
                                    } else {
                                        removeRefValues(obj[prop]);
                                    }
                                }
                            }
                        }

                        // Apply the function to the payload
                        removeRefValues(payload);

                        // Define the success and error handlers
                        let successHandler = function (oData, response) {
                            sap.ui.core.BusyIndicator.hide();
                            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorData", JSON.parse(JSON.parse(response['headers']['sap-message'])));
                            if (JSON.parse(response['headers']['sap-message'])) {
                                this.handleDialogPress(undefined, JSON.parse(JSON.parse(response['headers']['sap-message'])));
                            }
                            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorBtnVis", true);
                            const sapMessage = JSON.parse(JSON.parse(response['headers']['sap-message']));

                            // Initialize the error flag
                            let hasError = false;

                            // Check if details array exists and has entries
                            if (sapMessage.details && Array.isArray(sapMessage.details)) {
                                hasError = sapMessage.details.some(detail => detail.severity === "error");
                            }
                            if (!hasError)
                                this.getView().byId("marineSmartTable").rebindTable(true);
                            console.log("POST successful:", oData);
                        };

                        let errorHandler = function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            let resp = { "details": JSON.parse(oError.responseText).error.innererror.errordetails };
                            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorBtnVis", true);
                            this.handleDialogPress(undefined, resp);
                            console.log("Error occurred:", oError);
                        };

                        // Perform the POST request
                        sap.ui.core.BusyIndicator.show();
                        oModel.create("/Obligations", payload, {
                            success: successHandler.bind(this),
                            error: errorHandler.bind(this)
                        });
                    } else {
                        console.log("Action cancelled by the user.");
                    }
                }.bind(this)
            });

        },

        onPressCreateCorrectTicket: function (oEvent) {
            var oTable = this.byId("marineSmartTableInner");
            var aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length === 0) {
                sap.m.MessageBox.error("Please select at least one item.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var aSelectedData = [], emptyQuantityRecords = [];
            var bHasOpen = false;

            for (var i = 0; i < aSelectedIndices.length; i++) {
                var iIndex = aSelectedIndices[i];
                var sPath = oTable.getContextByIndex(iIndex).getPath();
                var oData = oModel.getProperty(sPath);

                var oDataCopy = JSON.parse(JSON.stringify(oData));
                if ((oDataCopy.SAPContract !== null && oDataCopy.SAPContract !== "" && oDataCopy.SAPContract !== undefined) && (!oDataCopy.TransportSystem || !oDataCopy.ShipTo || !oDataCopy.NomVolume || !oDataCopy.BLDate || !oDataCopy.TitleTransferDate || !oDataCopy.Shipper)) {
                    sap.m.MessageBox.error(
                        `Mandatory fields are missing in one or more selected items.\n\nPlease ensure the following fields are filled:\n- TransportSystem\n- ShipTo\n- NomVolume\n- BLDate\n- TitleTransferDate\n- Shipper.`
                    );
                    return;
                }

                // Transform the NomDetailSet
                if (oDataCopy.NomDetailSet && oDataCopy.NomDetailSet.__list) {
                    oDataCopy.NomDetailSet = oDataCopy.NomDetailSet.__list.map(detail => {
                        var match = detail.match(/NomHdr='(.+?)',NomItem='(.+?)'/);
                        return {
                            NomHdr: match[1],
                            NomItem: match[2]
                        };
                    });
                }

                // Remove ErrorDetailSet if it exists
                if (oDataCopy.ErrorDetailSet && oDataCopy.ErrorDetailSet.__list) {
                    delete oDataCopy.ErrorDetailSet;
                }

                // Remove unnecessary properties
                // Remove unnecessary properties
                delete oDataCopy.PrevNomVolume;
                delete oDataCopy.PrevTicketVolume;

                // Check if the status is "Open"
                if (oData.SapStatus === "Open") {
                    bHasOpen = true;
                } else {
                    if (oData.TicketVolume !== null && oData.TicketVolume !== undefined && oData.TicketVolume !== "" && oData.TicketVolume !== " ")
                        aSelectedData.push(oDataCopy);
                    else
                        emptyQuantityRecords.push(oData.TradeNumber);
                }
            }

            var bCountsMatch = this.checkAllOpenCaroRefItemsSelected(oEvent);

            // if (bCountsMatch) {

            var msg = "Create/correct ticket(s)? Any items with no changes to quantity will be ignored.";
            if (bHasOpen) {
                msg = "You have selected Open records, those will be ignored. Create/correct ticket(s)? Any items with no changes to quantity will be ignored.";

            }
            msg = bCountsMatch.message + " Confirm you want to create/correct ticket(s)? You may need to refresh the screen to see the updated status.";

            if (emptyQuantityRecords.length > 0) {
                msg += "The following trade(s) did not have a quantity and will not be ticketed: " + emptyQuantityRecords.join(", ");
            }
            // If there are "Open" records, show confirmation dialog
            // if (bHasOpen) {
            sap.m.MessageBox.confirm(
                msg, {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        // Proceed with the OData call if the user confirms
                        let payload = {
                            "Identifier": "T",
                            "MarinesObligationDetailSet": aSelectedData
                        };

                        function removeRefValues(obj) {
                            for (var prop in obj) {
                                if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                                    if (obj[prop].hasOwnProperty("__ref")) {
                                        delete obj[prop]["__ref"];
                                    } else {
                                        removeRefValues(obj[prop]);
                                    }
                                }
                            }
                        }

                        // Clean the payload
                        removeRefValues(payload);

                        // Define success and error handlers
                        let successHandler = function (oData, response) {
                            sap.ui.core.BusyIndicator.hide();
                            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorBtnVis", true);
                            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorData", JSON.parse(JSON.parse(response['headers']['sap-message'])));
                            if (JSON.parse(response['headers']['sap-message'])) {
                                this.handleDialogPress(undefined, JSON.parse(JSON.parse(response['headers']['sap-message'])));
                            }
                            const sapMessage = JSON.parse(JSON.parse(response['headers']['sap-message']));

                            // Initialize the error flag
                            let hasError = false;

                            // Check if details array exists and has entries
                            if (sapMessage.details && Array.isArray(sapMessage.details)) {
                                hasError = sapMessage.details.some(detail => detail.severity === "error");
                            }
                            if (!hasError) {
                                if (this.getOwnerComponent().getModel().hasPendingChanges())
                                    this.getOwnerComponent().getModel().resetChanges()
                                this.getView().byId("marineSmartTable").rebindTable(true);
                            }
                            console.log("POST successful:", oData);
                        };

                        let errorHandler = function (oError) {
                            let resp = { "details": JSON.parse(oError.responseText).error.innererror.errordetails };
                            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorBtnVis", true);
                            this.handleDialogPress(undefined, resp);
                            sap.ui.core.BusyIndicator.hide();
                            console.error("Error occurred:", oError);
                        };

                        // Perform the POST request
                        if (payload.MarinesObligationDetailSet.length > 0) {
                            sap.ui.core.BusyIndicator.show();
                            oModel.create("/Obligations", payload, {
                                success: successHandler.bind(this),
                                error: errorHandler.bind(this)
                            });
                        }
                    } else {
                        // If the user cancels, do nothing
                        console.log("Action cancelled by the user.");
                    }
                }.bind(this) // Ensure correct context
            }
            );

        },

        handleDialogPress: function (oEvent, response) {
            var aMessages;
            if (oEvent) {
                var sPath = oEvent.getSource().getBindingContext().sPath;

                // Get the error list from the model based on the selected context path
                var aErrorList = this.getOwnerComponent().getModel().getProperty(sPath).ErrorDetailSet.__list || [];

                // Map the error details into a new JSONModel
                aMessages = aErrorList.map(function (sErrorPath) {
                    var oErrorDetail = this.getOwnerComponent().getModel().getProperty("/" + sErrorPath);
                    return {
                        type: this._mapErrorType(oErrorDetail.Type),
                        title: oErrorDetail.Message,
                        description: "ID: " + oErrorDetail.Id,
                        subtitle: "",
                        counter: 1
                    };
                }.bind(this));
            } else {
                aMessages = response.details.map(function (oErrorDetail) {
                    return ({
                        type: this._mapErrorType(oErrorDetail.severity),  // Assuming this returns a string like "Error" or "Warning"
                        title: typeof (oErrorDetail.message) === 'object' ? oErrorDetail.message.value : oErrorDetail.message,  // The actual error message as a string
                        description: "Code: " + oErrorDetail.code + " | ContentID: " + oErrorDetail.ContentID,  // Combined string for description
                        subtitle: "",  // Empty string for subtitle
                        counter: 1  // Integer value for counter
                    })
                }.bind(this));
            }

            // Set the new model to the MessageView
            var oMessageModel = new JSONModel(aMessages);
            this.oMessageView.setModel(oMessageModel);

            // Reset navigation state and open the dialog
            this.oMessageView.navigateBack();
            this.oDialog.open();
        },

        // Helper function to map error types to sap.ui.core.MessageType
        _mapErrorType: function (sType) {
            switch (sType) {
                case "E":
                    return sap.ui.core.MessageType.Error;
                case "W":
                    return sap.ui.core.MessageType.Warning;
                case "S":
                    return sap.ui.core.MessageType.Success;
                case "I":
                    return sap.ui.core.MessageType.Information;
                case "error":
                    return sap.ui.core.MessageType.Error;
                case "warning":
                    return sap.ui.core.MessageType.Warning;
                case "success":
                    return sap.ui.core.MessageType.Success;
                case "information":
                    return sap.ui.core.MessageType.Information;
                default:
                    return sap.ui.core.MessageType.None;
            }
        },

        onPressZeroOut: function (oEvent) {
            var oTable = this.byId("marineSmartTableInner");
            var aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length === 0) {
                sap.m.MessageBox.error("Please select at least one item.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var aSelectedData = [];

            for (var i = 0; i < aSelectedIndices.length; i++) {
                var iIndex = aSelectedIndices[i];
                var sPath = oTable.getContextByIndex(iIndex).getPath();
                var oData = oModel.getProperty(sPath);

                // Perform a deep copy of oData to avoid two-way binding issues
                var oDataCopy = JSON.parse(JSON.stringify(oData));
                if ((oDataCopy.SAPContract !== null && oDataCopy.SAPContract !== "" && oDataCopy.SAPContract !== undefined) && (!oDataCopy.TransportSystem || !oDataCopy.ShipTo || !oDataCopy.NomVolume || !oDataCopy.BLDate || !oDataCopy.TitleTransferDate || !oDataCopy.Shipper)) {
                    sap.m.MessageBox.error(
                        `Mandatory fields are missing in one or more selected items.\n\nPlease ensure the following fields are filled:\n- TransportSystem\n- ShipTo\n- NomVolume\n- BLDate\n- TitleTransferDate\n- Shipper.`
                    );
                    return;
                }
                // Transform the NomDetailSet
                if (oDataCopy.NomDetailSet && oDataCopy.NomDetailSet.__list) {
                    oDataCopy.NomDetailSet = oDataCopy.NomDetailSet.__list.map(detail => {
                        var match = detail.match(/NomHdr='(.+?)',NomItem='(.+?)'/);
                        return {
                            NomHdr: match[1],
                            NomItem: match[2]
                        };
                    });
                }

                // Remove the ErrorDetailSet if it exists
                if (oDataCopy.ErrorDetailSet && oDataCopy.ErrorDetailSet.__list) {
                    delete oDataCopy.ErrorDetailSet;
                }

                // Remove unnecessary properties
                delete oDataCopy.PrevNomVolume;
                delete oDataCopy.PrevTicketVolume;

                aSelectedData.push(oDataCopy);

            }

            var msg = "Confirm you want to zero out Obligations/Nominations?"

            // Show a confirmation box to proceed with non-ticketed records
            sap.m.MessageBox.confirm(
                msg, {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        // Proceed with the OData call after user confirmation
                        let payload = {
                            "Identifier": "Z",
                            "MarinesObligationDetailSet": aSelectedData
                        };

                        function removeRefValues(obj) {
                            for (var prop in obj) {
                                if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                                    if (obj[prop].hasOwnProperty("__ref")) {
                                        delete obj[prop]["__ref"];
                                    } else {
                                        removeRefValues(obj[prop]);
                                    }
                                }
                            }
                        }

                        // Apply the function to the payload
                        removeRefValues(payload);

                        // Define the success and error handlers
                        let successHandler = function (oData, response) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageBox.success("Zero out Successful!");
                            // this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorData", JSON.parse(JSON.parse(response['headers']['sap-message'])));
                            // if (JSON.parse(response['headers']['sap-message'])) {
                            // 	this.handleDialogPress(undefined, JSON.parse(JSON.parse(response['headers']['sap-message'])));
                            // }
                            //this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorBtnVis", true);
                            this.getView().byId("marineSmartTable").rebindTable(true);
                            console.log("POST successful:", oData);
                        };

                        let errorHandler = function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            let resp = { "details": JSON.parse(oError.responseText).error.innererror.errordetails };
                            this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/ErrorBtnVis", true);
                            this.handleDialogPress(undefined, resp);
                            console.log("Error occurred:", oError);
                        };

                        // Perform the POST request
                        sap.ui.core.BusyIndicator.show();
                        oModel.create("/Obligations", payload, {
                            success: successHandler.bind(this),
                            error: errorHandler.bind(this)
                        });
                    } else {
                        // If user selects CANCEL, just close the message box and do nothing
                        console.log("Action cancelled by the user.");
                    }
                }.bind(this) // Binding 'this' for correct context
            }
            );
        },


        onBeforeRebindTable: function (oEvent) {
            var oSmartFilterBar = this.byId("marineSmartFilterBar"); // Replace with your SmartFilterBar ID
            var aFilters = oSmartFilterBar.getFilters();

            // Check if filters are empty
            if (aFilters.length === 0) {
                // Stop binding
                oEvent.preventDefault();
            }

            var oComponent = this.getOwnerComponent();
            var oViewSettingsModel = oComponent.getModel("viewSettingsModel");
            var oModel = this.getOwnerComponent().getModel();

            var oSmartTable = this.byId("marineSmartTable");
            // oSmartTable.getTable().getColumns()[3].setShowFilterMenuEntry(false);
            // oSmartTable.getTable().getColumns()[8].setShowFilterMenuEntry(false);
            // oSmartTable.getTable().getColumns()[7].setShowFilterMenuEntry(false);


            if (oModel.hasPendingChanges())
                oModel.resetChanges()

            // Set properties and parameters
            var mBindingParams = oEvent.getParameter("bindingParams");
            // mBindingParams.parameters["expand"] = "NomDetailSet,ErrorDetailSet";
            // mBindingParams.parameters["select"] = "SAPSchedulerQuantityPrev";

            // Add filters
            if (this._txtAreaTradeNum.getValue()) {
                mBindingParams.filters.push(
                    new Filter("TradeNumber", FilterOperator.EQ, this._txtAreaTradeNum.getValue())
                );
            }
            if (this._txtAreaCargo.getValue()) {
                mBindingParams.filters.push(
                    new Filter("CargoReference", FilterOperator.EQ, this._txtAreaCargo.getValue())
                );
            }

            mBindingParams.events = {
                dataReceived: function (oEvent) {
                    // Avoid doing anything if the data is empty or undefined
                    var oData = oEvent.getParameter("data");
                    if (!oData || !oData.results) return;

                    // Create an array with the sPath and corresponding SAPUnit for items where Obligation is empty
                    // var aMappedData = oData.results
                    //     .filter(function (row) {
                    //         return row.Obligation === ""; // Check if Obligation is empty
                    //     })
                    //     .map(function (row) {
                    //         // Construct the sPath using the format provided
                    //         var sPath = "/SchedulerHeader(TradeNumber='" + row.TradeNumber + "',SectionVal='" + row.SectionVal + "',Obligation='" + row.Obligation + "')";

                    //         return {
                    //             sPath: sPath,
                    //             SAPUnit: row.SAPUnit // Map the SAPUnit field to the sPath
                    //         };
                    //     });

                    // Get the length of the mapped data
                    // var iMappedDataLength = aMappedData.length;

                    // this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/MappedDataForQty", aMappedData);
                    this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/TotalItems", oData.results.length);
                    // Ensure table binding is updated
                    var oTable = this.byId("marineSmartTableInner");
                    oTable.invalidate();
                    // oTable.getRowMode().setFixedBottomRowCount(iMappedDataLength);
                    // this.getOwnerComponent().getModel("viewSettingsModel").setProperty("/NoOfRowsToFreeze", iMappedDataLength);
                    var aColumns = oTable.getColumns();
                    for (var i = aColumns.length - 1; i >= 0; i--) {
                        oTable.autoResizeColumn(i);
                    }

                }.bind(this) // Ensure 'this' refers to the controller
            };
        },

        // onRowsUpdated: function(oEvent){ 
        //     debugger;
        // }
    });
});
