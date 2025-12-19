"use strict";

const cds = require("@sap/cds");
const filterHandler = require('./handlers/filters.js');
const tableHandler = require('./handlers/maintable.js');
const filterHelper = require('./helpers/filterHelper.js');

let DelPrd_Data;


class SchedulerMarineService extends cds.ApplicationService {
    async init() {
        const {
            TokenData, MOT, Strategy, Commodity, Location, Vehicle, Counterparty, MarineScheduler, ShipToVHSet, ShipperVHSet, Obligations, Traders, ZCDSV_P2C_E2257_TRANSPORT_VH, ZCDSV_P2C_E2257_FC_CHARTER_VH, ZCDSV_P2C_E2257_CARRIER_VH } = this.entities;
        let ctrm = await cds.connect.to("CTRM_FILTER");
        let ctrmtab = await cds.connect.to("CTRM_TABLE");
        let ctrmlogin = await cds.connect.to("CTRM_LOGIN");

        // await filterHandler.clearLockedValues(db);
        let token = await filterHandler.getLoginToken('', ctrmlogin);
        var headers = {
            token: token
        }
        let delPrdData = await filterHandler.getDeliveryPeriodsData('', ctrmtab, headers);
        console.log(token);
        this.on('READ', MOT, async (request, next) => {
            return await filterHandler.getMOT(request, ctrm, headers);
        });

        this.on('READ', ShipToVHSet, async (request) => {
            let userDetData = await filterHandler.getS4ValueHelpData(request);
            return userDetData;
        });

        this.on('READ', ZCDSV_P2C_E2257_TRANSPORT_VH, async (request) => {
            let userDetData = await filterHandler.getS4ValueHelpData(request);
            return userDetData;
        });

        this.on('READ', ZCDSV_P2C_E2257_FC_CHARTER_VH, async (request) => {
            let userDetData = await filterHandler.getS4ValueHelpData(request);
            return userDetData;
        });

        this.on('READ', ZCDSV_P2C_E2257_CARRIER_VH, async (request) => {
            let userDetData = await filterHandler.getS4ValueHelpData(request);
            return userDetData;
        });


        this.on('READ', ShipperVHSet, async (request) => {
            let userDetData = await filterHandler.getS4ValueHelpData(request);
            return userDetData;
        });

        this.on('READ', MarineScheduler, async (request, next) => {
            let res = [];
            const ID = cds.utils.uuid();
            // let filterQuery = { transformedFilterQuery: "", sapStatusFilters:"" };
            if (request._queryOptions.$filter === undefined) {
                request.reject(400, "Filters are required to fetch data.");
                return;
            }
            //DelPrd_Data = await filterHandler.getDeliveryPeriods(request, ctrmtab, headers);

            let filterQueryBody = await filterHelper.formatFiltersForBody(request._queryOptions.$filter, DelPrd_Data);
            console.log(process.env.NUM_OF_MNTHS_PAST + ',' + process.env.NUM_OF_MNTHS_FUTURE);
            let filterWithDelWindowTPT = await filterHelper.getLastThreeMonthsDelPeriods(request._queryOptions.$filter, filterQueryBody.transformedFilterQuery, delPrdData, process.env.NUM_OF_MNTHS_PAST, process.env.NUM_OF_MNTHS_FUTURE);
            filterWithDelWindowTPT = await filterHelper.handleLoadWindowFilters(request._queryOptions.$filter, filterWithDelWindowTPT);

            try {
                let tableData = await tableHandler.getTableData(request, filterWithDelWindowTPT, filterQueryBody.sapStatusFilters, ctrmtab, headers);
                // res = tableData;


                if (tableData && tableData.length > 0) {
                    // Sorting logic: CargoReference > RecordType > TradeNumber > LoadWindow (start date)
                    tableData.sort((a, b) => {
                        // Utility function to handle null, undefined, or empty values
                        const normalizeString = (val) => (val == null ? '' : val.toString());
                        const extractStartDate = (val) => (val ? new Date(val.split(' ')[0]) : new Date(0)); // Defaults to epoch if invalid or empty

                        // Sort by CargoReference
                        const cargoA = normalizeString(a.CargoReference);
                        const cargoB = normalizeString(b.CargoReference);
                        if (cargoA > cargoB) return 1;
                        if (cargoA < cargoB) return -1;

                        // Sort by CargoReference
                        const rctypeA = normalizeString(a.RecordType);
                        const rctypeB = normalizeString(b.RecordType);
                        if (rctypeA > rctypeB) return 1;
                        if (rctypeA < rctypeB) return -1;

                        // Sort by TradeNumber
                        const tradeA = normalizeString(a.TradeNumber);
                        const tradeB = normalizeString(b.TradeNumber);
                        if (tradeA > tradeB) return 1;
                        if (tradeA < tradeB) return -1;

                        // Sort by LoadWindow start date
                        const loadA = extractStartDate(a.LoadWindow);
                        const loadB = extractStartDate(b.LoadWindow);
                        return loadA - loadB;
                    });
                }

                res = await sortTableData(tableData, request._queryOptions.$orderby);
                res.$count = res.length;
            } catch (error) {
                console.log(error);
            }
            res.$count = res.length;

            return res;
        });

        async function sortTableData(tableData, orderby) {
            if (!orderby) return tableData; // No sorting if orderby is empty

            // Extract field and order
            const [field, order] = orderby.trim().split(" ");

            // Sort the table data
            return tableData.sort((a, b) => {
                if (!a.hasOwnProperty(field) || !b.hasOwnProperty(field)) return 0; // Skip if field doesn't exist

                if (order.toLowerCase() === "desc") {
                    return a[field] > b[field] ? -1 : a[field] < b[field] ? 1 : 0;
                } else {
                    return a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
                }
            });
        }

        this.on('READ', Strategy, async (request) => {
            let dat = await filterHandler.getStrategy(request, ctrm, headers);
            return dat;
        });

        this.on('READ', Commodity, async (request) => {
            return await filterHandler.getCommodity(request, ctrm, headers);
        });

        this.on('READ', Location, async (request) => {
            return await filterHandler.getLocations(request, ctrm, headers);
        });

        this.on('READ', Traders, async (request) => {
            return await filterHandler.getTraders(request, ctrmtab, headers);
        });

        this.on('READ', Vehicle, async (request) => {
            return await filterHandler.getVehicles(request, ctrmtab, headers);
        });

        this.on('READ', Counterparty, async (request) => {
            return await filterHandler.getCounterParties(request, ctrmtab, headers);
        });

        this.on('POST', Obligations, async (request, next) => {
            let nomData = await tableHandler.postNominationData(request.data, request, headers, ctrmtab);
            if (nomData && nomData.hasOwnProperty('headers')) {
                const sapMessage = nomData.headers['sap-message'];
                if (sapMessage) {
                    const parsedMessage = JSON.parse(sapMessage); // 'sap-message' is usually in JSON format
                    request.res.setHeader('sap-message', JSON.stringify(sapMessage));
                }
            }
        });


        this.on('READ', TokenData, async (request, next) => {
            token = await filterHandler.getLoginToken('', ctrmlogin);
            headers = {
                token: token
            };
            return { "Token": token };
        });

        return super.init();
    }

}

module.exports = { SchedulerMarineService }
