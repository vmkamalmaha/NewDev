const { retrieveJwt } = require("@sap-cloud-sdk/core");
const { executeHttpRequest } = require('@sap-cloud-sdk/core');
const filterHandler = require('./filters.js');
const res = require("express/lib/response.js");
const cds = require("@sap/cds");
async function getTableData(req, filterQuery, sapStatusFilters, ctrmtab, headers) {
    const srv = await cds.connect.to("db");
    // await filterHandler.clearLockedValues(srv);
    if (!headers.token) {
        let ctrm = await cds.connect.to("CTRM_FILTER");
        let token = await filterHandler.getLoginToken(req, ctrm);
        var headers = {
            token: token
        }
    }


    let queryUrl = `POST v1/Search/GetSearchDeliveryDetailsForMarine`;

    console.log(filterQuery)
    let resultObligations = await ctrmtab.send({ query: queryUrl, headers: headers, data: filterQuery });


    let res = [], tradeSAPDetailSetArr = [], finalresultMarine = [];
    let reqBody = {};
    for (let itr = 0; itr < resultObligations.ObligationList.length; itr++) {
        let tradeSAPDetailSetObj = {};
        tradeSAPDetailSetObj.CargoReference = resultObligations.ObligationList[itr].Ref1;
        tradeSAPDetailSetObj.LoadLocation = resultObligations.ObligationList[itr].LoadLocation;
        tradeSAPDetailSetObj.MOTVal_Value = resultObligations.ObligationList[itr].MOT;
        //obgTmp.MOTId = tradeSAPDetailSetObj.MOTId = resultObligations.ObligationList[itr].MOT;
        tradeSAPDetailSetObj.Grade = resultObligations.ObligationList[itr].Commodity;
        tradeSAPDetailSetObj.CounterParty = resultObligations.ObligationList[itr].Counterpart;
        tradeSAPDetailSetObj.Incoterms = resultObligations.ObligationList[itr].DeliveryTerm;
        //obgTmp.DeliveryWindow = resultObligations.ObligationList[itr].DeliveryPeriod;
        tradeSAPDetailSetObj.TradeNumber = resultObligations.ObligationList[itr].TradeNumber;
        tradeSAPDetailSetObj.SectionVal = resultObligations.ObligationList[itr].Section.split("-")[1];
        //obgTmp.BuySell = resultObligations.ObligationList[itr].BuyOrSell;
        tradeSAPDetailSetObj.Strategy = resultObligations.ObligationList[itr].Strategy;
        tradeSAPDetailSetObj.TPTLocation = resultObligations.ObligationList[itr].Location;
        tradeSAPDetailSetObj.Unit = resultObligations.ObligationList[itr].ObligationQtyUOM;
        tradeSAPDetailSetObj.ContractVolume = resultObligations.ObligationList[itr].ObligationQty;
        tradeSAPDetailSetObj.Obligation = resultObligations.ObligationList[itr].ObligationNumber;
        tradeSAPDetailSetObj.Unit = resultObligations.ObligationList[itr].ObligationQtyUOM;
        tradeSAPDetailSetObj.SapStatus = sapStatusFilters;
        tradeSAPDetailSetObj.ToleranceMin = '0.00' ; tradeSAPDetailSetObj.ToleranceMax = '0.00' ;
        if (resultObligations.ObligationList[itr].ToleranceMin1Pct != null) {

            tradeSAPDetailSetObj.ToleranceMin = resultObligations.ObligationList[itr].ToleranceMin1Pct = '' ? '0.00' : resultObligations.ObligationList[itr].ToleranceMin1Pct;
            tradeSAPDetailSetObj.ToleranceMax = resultObligations.ObligationList[itr].ToleranceMax1Pct = '' ? '0.00' : resultObligations.ObligationList[itr].ToleranceMax1Pct;
        } else if(resultObligations.ObligationList[itr].ToleranceMin1Qty != null){
            tradeSAPDetailSetObj.ToleranceMin = resultObligations.ObligationList[itr].ToleranceMin1Qty = '' ? '0.00' : resultObligations.ObligationList[itr].ToleranceMin1Qty ;
            tradeSAPDetailSetObj.ToleranceMax = resultObligations.ObligationList[itr].ToleranceMax1Qty = '' ? '0.00' : resultObligations.ObligationList[itr].ToleranceMax1Qty ;
            tradeSAPDetailSetObj.ToleranceMin =  resultObligations.ObligationList[itr].ObligationQty > 0 ? ( (Math.abs(resultObligations.ObligationList[itr].ObligationQty - tradeSAPDetailSetObj.ToleranceMin)) * 100 / resultObligations.ObligationList[itr].ObligationQty ).toFixed(2) : '0.00' ;
            tradeSAPDetailSetObj.ToleranceMax =  resultObligations.ObligationList[itr].ObligationQty > 0 ? ( (Math.abs(tradeSAPDetailSetObj.ToleranceMax - resultObligations.ObligationList[itr].ObligationQty)) * 100 / resultObligations.ObligationList[itr].ObligationQty ).toFixed(2) : '0.00' ;
        }
        tradeSAPDetailSetObj.LoadWindow = formatLoadWindow(resultObligations.ObligationList[itr].ObligationStartDate, resultObligations.ObligationList[itr].ObligationEndDate);

        //loop for quanitities
        let invoiceQuantity = 0.000;
        tradeSAPDetailSetObj.NominalQuantity = 0.000, tradeSAPDetailSetObj.ZeroOutVolume = 0.000;
        resultObligations.ObligationList[itr].NominationList.forEach(function (element, index) {

            tradeSAPDetailSetObj.DeliveryReference = element.TheirDeliveryRef; //delivery
            tradeSAPDetailSetObj.NominalQuantity = parseFloat(tradeSAPDetailSetObj.NominalQuantity) + parseFloat(element.NominalQty);
            if (element.InvoiceQty == '')
                element.InvoiceQty = 0.000;
            invoiceQuantity = parseFloat(invoiceQuantity) + parseFloat(element.InvoiceQty);
            resultObligations.ObligationList[itr].NominationList[index].ActualizationList.forEach(function (elementTicket, indexTicket) {

                tradeSAPDetailSetObj.NominalQuantity = parseFloat(tradeSAPDetailSetObj.NominalQuantity) + parseFloat(elementTicket.NominalQty);
                if (elementTicket.InvoiceQty == '')
                    elementTicket.InvoiceQty = 0.000;
                invoiceQuantity = parseFloat(invoiceQuantity) + parseFloat(elementTicket.InvoiceQty);

            });
        });
        //tradeSAPDetailSetObj.ZeroOutVolume = (tradeSAPDetailSetObj.NominalQuantity - invoiceQuantity).toFixed(2);
        tradeSAPDetailSetObj.NominalQuantity = parseFloat(Math.abs(tradeSAPDetailSetObj.NominalQuantity)).toFixed(2);
        tradeSAPDetailSetObj.InvoiceQuantity = parseFloat(Math.abs(invoiceQuantity)).toFixed(2);
        tradeSAPDetailSetObj.ZeroOutVolume = (tradeSAPDetailSetObj.NominalQuantity - tradeSAPDetailSetObj.InvoiceQuantity).toFixed(2);

        tradeSAPDetailSetObj.ErrorDetailSet = [];
        tradeSAPDetailSetArr.push(tradeSAPDetailSetObj);
    }
    if (tradeSAPDetailSetArr.length > 0) {

        reqBody = {
            "Identifier": "G",
            "MarinesObligationDetailSet": tradeSAPDetailSetArr
        };
        let sUrl = `/sap/opu/odata/sap/ZP2C_MARINES_WORKBOOK_API_SRV/MarinesObligationHdrSet`
        let resultSAPDet = await customPost(reqBody, sUrl, req);
        console.log("--------- Data Respone---------");
        console.log(resultSAPDet.data.d.MarinesObligationDetailSet.results.length);
        console.log("--------- Data Respone End---------");
        let finalresultMarineSAP = resultSAPDet.data.d.MarinesObligationDetailSet.results;
        finalresultMarine = finalresultMarine.concat(finalresultMarineSAP);
        // Function to remove __metadata recursively
        function removeMetadata(obj) {
            if (Array.isArray(obj)) {
                obj.forEach(item => removeMetadata(item)); // Process each item in the array
            } else if (typeof obj === 'object' && obj !== null) {
                delete obj.__metadata; // Delete the __metadata property if present
                // Recursively process all properties
                Object.keys(obj).forEach(key => removeMetadata(obj[key]));
            }
        }

        removeMetadata(finalresultMarine);

        finalresultMarine.forEach((element) => {
            element.PrevTicketVolume = null;
            element.PrevNomVolume = null;
            element.YNomItm = element.YNomItm.replace(/^0+/, '');
            element.ZNomItm = element.ZNomItm.replace(/^0+/, '');
            element.ErrorDetailSet = element.ErrorDetailSet.results;
            //logic for quantity not matching
            if (element.SapStatus === 'Ticketed' && element.ErrorCode != 'E' && element.TicketVolume != element.InvoiceQuantity && element.IsTptTicketUpdated === true) {
                element.ErrorDetailSet.push({
                    Id: cds.utils.uuid(),
                    Type: 'W',
                    Message: 'TPT Invoiced Quantity does not match SAP Actualized quantity.' + ' TPT = ' + element.InvoiceQuantity + ';SAP = ' + element.TicketVolume
                })

                element.ErrorCode = element.ErrorCode === 'E' ? 'E' : 'W';
            }
            if (element.SapStatus === 'Nominated' && element.ZNomHdr != '' && element.NominalQuantity != element.NomVolume) {
                element.ErrorDetailSet.push({
                    Id: cds.utils.uuid(),
                    Type: 'W',
                    Message: 'TPT Nominal Quantity does not match SAP Schedule quantity.' + ' TPT = ' + element.NominalQuantity + ';SAP = ' + element.NomVolume
                })

                element.ErrorCode = element.ErrorCode === 'E' ? 'E' : 'W';
            }
            
        });

        finalresultMarine = finalresultMarine.map(entry => {
            return {
                ...entry,
                BLDate: convertSAPDateTime(entry.BLDate), // Convert ScheduledDate
                TitleTransferDate: convertSAPDateTime(entry.TitleTransferDate), // Convert ScheduledDate

            };
        });
        return finalresultMarine;
    } else
    return [];
    
};

function formatLoadWindow(startDate, endDate) {
    // Extract year, month, and day from the start and end dates
    const startYear = startDate.slice(0, 4);
    const startMonth = parseInt(startDate.slice(4, 6), 10); // Convert to integer for month lookup
    const startDay = parseInt(startDate.slice(6, 8), 10);

    const endYear = endDate.slice(0, 4);
    const endMonth = parseInt(endDate.slice(4, 6), 10);
    const endDay = parseInt(endDate.slice(6, 8), 10);

    // Map for month names
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Format LoadWindow
    const startMonthName = monthNames[startMonth - 1];
    const endMonthName = monthNames[endMonth - 1];

    if (startYear === endYear && startMonth === endMonth) {
        return `${startMonthName} ${startDay}-${endDay}, ${startYear}`;
    } else if (startYear === endYear) {
        return `${startMonthName} ${startDay} - ${endMonthName} ${endDay}, ${startYear}`;
    } else {
        return `${startMonthName} ${startDay}, ${startYear} - ${endMonthName} ${endDay}, ${endYear}`;
    }
};

function convertSAPDateTime(sapDateString) {
    // Check if sapDateString is valid
    if (!sapDateString || typeof sapDateString !== 'string') {
        return null; // Return null or an appropriate default value
    }

    // Extract the timestamp from the SAP format '/Date(1591056000000)/'
    const timestamp = parseInt(sapDateString.match(/\d+/)[0], 10);

    // Convert the timestamp to a Date object and format as local date and time string
    return new Date(timestamp).toLocaleDateString(); // returns "MM/DD/YYYY" format based on locale

}


async function getTransfersRegradesData(req, filterQuery) {
    try {
        const service = await cds.connect.to('SCWB')
        let sUrl = `/TransferRegradesDetailSet?$expand=ErrorDetailSet`;
        if (filterQuery)
            sUrl += `&$filter=` + req._query.$filter;

        if (req._query.$orderby) {
            if (filterQuery)
                sUrl += `&$orderby=` + req._query.$orderby;
            else
                sUrl += `&$orderby=` + req._query.$orderby;
        }


        // sUrl= `/TransferRegradesDetailSet?$expand=ErrorDetailSet&?$filter=ScheduledDate ge datetime'2017-04-15T00:00:00' and ScheduledDate le datetime'2017-04-28T00:00:00'`;
        sUrl = sUrl.replace(
            /ScheduledDate (ge|le) (\d{4}-\d{2}-\d{2})/g,
            (match, operator, date) => `ScheduledDate ${operator} datetime'${date}T00:00:00'`
        );

        // Construct the final URL
        let headers = { "x-sap-spnego": "disabled" };
        //  let sUrl = `${baseUrl}$filter=${formattedFilter}`;
        //let resultSAPDet = await service.get(sUrl,headers);
        let resultSAPDet = await service.send('GET', sUrl, headers);
        let convertedResultSAPDet = resultSAPDet.map(entry => {
            return {
                ...entry,
                ScheduledDate: convertSAPDateTime(entry.ScheduledDate) // Convert ScheduledDate
            };
        });
        //console.log(resultSAPDet.data.d);


        let unitWiseTotals = {};

        // Iterate over the final result to calculate totals based on Unit
        convertedResultSAPDet.forEach(function (item) {
            const UnitOfMeasure = item.UnitOfMeasure;
            // const tradeUnit = item.Unit;

            // Initialize an entry in the unitWiseTotals object if not already present
            if (!unitWiseTotals[UnitOfMeasure]) {
                unitWiseTotals[UnitOfMeasure] = {
                    Quantity: 0,
                    UnitOfMeasure: UnitOfMeasure
                };
            }

            // Safeguard against null or undefined values 
            let Quantity = parseFloat(item.Quantity) || 0;

            unitWiseTotals[UnitOfMeasure].Quantity += Quantity;
        });


        for (let unit in unitWiseTotals) {
            // Ensure quantities are correctly formatted before pushing to finalresult
            convertedResultSAPDet.push({
                Quantity: `${unitWiseTotals[unit].Quantity.toFixed(3)}`,
                UnitOfMeasure: `${unitWiseTotals[unit].UnitOfMeasure}`,
                ID: cds.utils.uuid(),
                NomHdr: "",
                NomItem: ""
            });
        }

        return convertedResultSAPDet;
    } catch (error) {
        console.error('Error during Get operation:', error);
        return req.error(500, 'Failed to Fetch Data.');
    }
};

async function deleteTransferRegrades(req) {
    const service = await cds.connect.to('SCWB');
    try {

        const { ID, NomHdr, NomItem } = req._params[0];

        // Construct the dynamic path with the required keys

        const sPath = `/sap/opu/odata/sap/ZP2C_WORKBOOK_API_SRV/TransferRegradesDetailSet(ID=guid'${ID}',NomHdr='${NomHdr}',NomItem='${NomItem}')`;

        // Send DELETE request to S/4HANA OData service (SCWB)
        // await service.delete(sPath);
        let resultSAPObl = await customDelete(sPath, req);
        return resultSAPObl;
        // Return success message
        //  return { message: 'Entity deleted successfully from S/4HANA OData service.' };

    } catch (error) {
        console.error('Error during delete operation:', error);
        if (error.response && error.response.data && error.response.data.error) {
            const oobject = {
                "code": '400',
                "message": 'An exception was raised',
                "innererror": error.response.data.error.innererror,
                "status": "418"
            };
            req.reject(oobject);
        } else {
            console.log(error);
            var errorMessage = '';
            if (error.target) {
                errorMessage = error.target;
            } else if (error.slack) {
                errorMessage = error.slack;
            } else if (error.message) {
                errorMessage = error.message;
            } else {
                errorMessage = 'Technical Error Occured';
            }
            req.reject(400, errorMessage);
        }
        //return req.error(500, 'Failed to delete the entity in the external service.');
    }
}

function convertCAPDateFormatToODataV2(dateString) {
    let timestamp = new Date(dateString).getTime();
    let formattedDate = `/Date(${timestamp})/`;
    return formattedDate;
}
function convertCAPDateFormatToSAPPostFormat(dateString) {
    let timestamp = new Date(dateString).getTime();
    let formattedDate = `/Date(${timestamp})/`;
    return formattedDate;
}


async function postNominationData(nomData, req, headers, ctrmtab) {
    try {
        if (nomData.Identifier === 'Z') {
            let zeroOutOblg = [], zeroOutNom = [];
            for (let i = 0; i < nomData.MarinesObligationDetailSet.length; i++) {
                let zeroOutOblgObj = {}, zeroOutNomObj = {};
                if (nomData.MarinesObligationDetailSet[i].SapStatus === 'Open') {
                    zeroOutOblgObj.TradeNumber = nomData.MarinesObligationDetailSet[i].TradeNumber;
                    zeroOutOblgObj.ObligationNumber = nomData.MarinesObligationDetailSet[i].Obligation;
                    zeroOutOblg.push(zeroOutOblgObj);

                } else if (nomData.MarinesObligationDetailSet[i].SapStatus === 'Nominated' || nomData.MarinesObligationDetailSet[i].SapStatus === 'Ticketed') {
                    zeroOutNomObj.ObligationNumber = nomData.MarinesObligationDetailSet[i].Obligation;
                    if (nomData.MarinesObligationDetailSet[i].ZNomHdr) {
                        zeroOutNomObj.TheirDelRef = nomData.MarinesObligationDetailSet[i].ZNomHdr + '-' + nomData.MarinesObligationDetailSet[i].ZNomItm;
                    } else {
                        zeroOutNomObj.TheirDelRef = nomData.MarinesObligationDetailSet[i].YNomHdr + '-' + nomData.MarinesObligationDetailSet[i].YNomItm;
                    }

                    zeroOutNom.push(zeroOutNomObj);
                }
            }
            if (zeroOutOblg.length > 0) {
                console.log(zeroOutOblg)
                let queryUrl = `POST v1/ZeroOut/ZeroOutObligations`

                let resultZeroOut = await ctrmtab.send({ query: queryUrl, headers: headers, data: zeroOutOblg });
                console.log('zero out obligation succesfull', resultZeroOut);
            }
            if (zeroOutNom.length > 0) {
                console.log(zeroOutOblg)
                let queryUrl = `POST v1/ZeroOut/ZeroOutNominations`

                let resultZeroOut = await ctrmtab.send({ query: queryUrl, headers: headers, data: zeroOutNom });
                console.log('zero out nomination succesfull', resultZeroOut);
            }
        } else {
            if ((nomData.MarinesObligationDetailSet && nomData.MarinesObligationDetailSet.length > 0) || (nomData.ObligationTrsgRegDetailSet && nomData.ObligationTrsgRegDetailSet.length > 0)) {
                if (nomData.MarinesObligationDetailSet) {
                    // Loop through the array and convert ScheduledDate for each entry
                    nomData.MarinesObligationDetailSet.forEach((item) => {
                        item.BLDate = convertCAPDateFormatToSAPPostFormat(item.BLDate);
                        item.TitleTransferDate = convertCAPDateFormatToSAPPostFormat(item.TitleTransferDate);
                    });
                }
                let sUrl = `/sap/opu/odata/sap/ZP2C_MARINES_WORKBOOK_API_SRV/MarinesObligationHdrSet`;
                let resultSAPObl = await customPost(nomData, sUrl, req);

                return resultSAPObl;
            }
        }
    } catch (e) {
        req.reject(e);
    }
}

const getShipToValue = async (request, ShipToData) => {
    const service = await cds.connect.to('SCWB')
    request.query.SELECT.count = false;
    const search_param = request._queryOptions.$search;
    if (search_param) {
        let query_search_param = search_param.replace(/"/g, '');
        const top = request._queryOptions.$top;
        const querytop = +top;
        const skip = request._queryOptions.$skip;
        const queryskip = +skip;
        ShipToData = await service.get(`/ShipToVHSet?$filter=SapContract eq '${req.data.SapContract} and BuySell eq '${req.data.BuySell}' &$select=Conpat,Contract_Relevant,CompName,ompAddress,taxjurcode&$skip=${queryskip}&$top=${querytop}&$orderby=Conpat`);
        return ShipToData;
    }
    else {
        return service.tx(request).run(request.query);
    }


}

async function customPost(requestData, sUrl, req) {
    var jwt = getJWT(req);
    console.log(`Testing '${jwt}'`)
    console.log('Custom Post Triggered)');
    try {
        const result = await executeHttpRequest(
            {
                destinationName: 'S4HD',
                jwt: jwt
            },
            {
                method: 'post',
                url: sUrl,
                data: requestData
            },
            {
                fetchCsrfToken: true
            }
        );

        return result;
    } catch (error) {
        debugger;
    }
};

async function customDelete(sUrl, req) {
    var jwt = getJWT(req);
    console.log(`Testing '${jwt}'`)
    console.log('Custom delete Triggered)');
    const result = await executeHttpRequest(
        {
            destinationName: 'S4HD',
            jwt: jwt
        },
        {
            method: 'DELETE',
            url: sUrl
        },
        {
            fetchCsrfToken: true
        }
    );

    return result;

};

function getJWT(req) {
    if (typeof req._ !== "undefined") {
        return retrieveJwt(req._.req);
    } else {
        return "";
    }
}
module.exports = {
    getTableData,
    postNominationData,
    getShipToValue,
    getTransfersRegradesData,
    deleteTransferRegrades,
    customDelete
};