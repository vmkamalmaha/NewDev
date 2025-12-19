
async function getMOT(req, ctrm, headers) {
  try {
    let resultMOT = await ctrm.send({ query: 'GET /v1/ReferenceData/GetMOT', headers: headers });
    let resData = resultMOT.filter(item => item.Value === 'Vessel');
    return resData;
  } catch (e) {
    console.log(e, headers);
    req.reject(500, 'Error in fetching MOT')
  }

}

async function getCommodity(req, ctrm, headers) {
  try {
    // let body = {
    //   "CommodityClassInd": "1"
    // };
    headers['Content-Type'] = "application/json"
    let resultCommodity = await ctrm.send({ query: 'GET /v1/ReferenceData/GetCommodity', headers: headers });
    return resultCommodity;
  } catch (e) {
    console.log(e, headers);
    req.reject(500, 'Error in fetching Commodity')
  }

}

async function getDeliveryTerms(req, ctrm, headers) {
  try {
    let resultDelTerms = await ctrm.send({ query: 'GET /v1/ReferenceData/GetDeliveryTerms', headers: headers });
    return resultDelTerms;
  } catch (e) {
    console.log(e, headers);
    req.reject(500, 'Error in fetching Delivery Terms')
  }

}

async function getLocations(req, ctrm, headers) {
  try {
    // let body = {
    //   "MarketCode": "Oil"
    // };
    let resultLocations = await ctrm.send({ query: 'GET /v1/ReferenceData/GetLocation', headers: headers });
    return resultLocations;
  } catch (e) {
    console.log(e, headers);
    req.reject(500, 'Error in fetching Locations')
  }

}

async function getTraders(req, ctrmtab, headers) {
  try {
    let resultTraders = await ctrmtab.send({ query: 'GET /v1/ReferenceData/GetTrader', headers: headers });
    return resultTraders;
  } catch (e) {
    console.log(e, headers);
    req.reject(500, 'Error in fetching Traders')
  }

}

async function getCounterParties(req, ctrmtab, headers) {
  try {
    let resultCounterParties = await ctrmtab.send({ query: 'GET /v1/ReferenceData/GetRefCompany', headers: headers });
    resultCounterParties.sort((a, b) => a.Company_cd.localeCompare(b.Company_cd));
    return resultCounterParties;
  } catch (e) {
    console.log(e, headers);
    req.reject(500, 'Error in fetching Counter Parties')
  }

}

async function getDeliveryPeriodsData(req, ctrmtab, headers) {
  try{
    let resultDelPeriods = await ctrmtab.send({ query: 'GET /v1/ReferenceData/GetDeliveryPeriods', headers: headers });
    return resultDelPeriods;
  }catch(e){
    console.log(e);
  }
  
}

async function getStrategy(req, ctrm, headers) {
  try {
    // let body = {
    //   "ProcessGroupCd": "Physical Crude"
    // };
    headers['Content-Type'] = "application/json"
    let resultStartegy = await ctrm.send({ query: 'GET /v1/ReferenceData/GetStrategy', headers: headers });
    return resultStartegy;
  } catch (e) {
    console.log(e, headers);
    req.reject(500, 'Error in fetching Strategy')
  }

}

async function getDeliveryPeriods(req, ctrmtab, headers) {
  try {
    const { GlobalValues } = cds.entities;
    const srv = await cds.connect.to("db");
    let glbQuery = SELECT
      .columns(
        "Value"
      )
      .from(GlobalValues)
      .where(`ID = 'MONTHSBACKANDFR'`)

    let resultGlb = await srv.run(glbQuery);
    let backmonth = 0, frmonth = 0;
    if (resultGlb.length > 0) {
      let months = resultGlb[0].Value.split(",");
      backmonth = parseInt(months[0]);
      frmonth = parseInt(months[1]);
    } else {
      backmonth = 7;
      frmonth = 4;
    }

    let resultDelPeriods = await ctrmtab.send({ query: 'GET /v1/ReferenceData/GetDeliveryPeriods', headers: headers });


    // Function to convert date strings to Date objects
    const parseDate = (dateStr) => {
      if (!dateStr || dateStr.length !== 14) {
        console.error(`Invalid date string: ${dateStr}`);
        return null;
      }
      const year = parseInt(dateStr.slice(0, 4), 10);
      const month = parseInt(dateStr.slice(4, 6), 10) - 1; // JavaScript months are 0-based
      const day = parseInt(dateStr.slice(6, 8), 10);
      return new Date(year, month, day);
    };

    // Calculate the date range for the last 7 months and next 4 months
    const now = new Date();
    const sevenMonthsAgo = new Date(now.getFullYear(), now.getMonth() - backmonth, now.getDate());
    const fourMonthsAhead = new Date(now.getFullYear(), now.getMonth() + frmonth, now.getDate());

    // Function to filter records within the specified delivery period
    const filterRecords = (records) => {
      return records.filter(record => {
        const periodStart = parseDate(record.Period_start_dt);
        const periodEnd = parseDate(record.Period_end_dt);

        if (!periodStart || !periodEnd) {
          return false; // Skip records with invalid dates
        }

        return (periodStart >= sevenMonthsAgo && periodEnd <= fourMonthsAhead);
      });
    };

    // Function to sort records by Period_start_dt (ascending order by month)
    const sortRecordsByMonth = (records) => {
      return records.sort((a, b) => {
        const dateA = parseDate(a.Period_start_dt);
        const dateB = parseDate(b.Period_start_dt);

        // Check if either date is invalid
        if (!dateA || !dateB) {
          return 0; // Skip sorting if dates are invalid
        }

        return dateA - dateB; // Sort in ascending order
      });
    };

    // Filter the resultDelPeriods data
    let filteredRecords = await filterRecords(resultDelPeriods);

    // Sort the filtered records by month
    filteredRecords = await sortRecordsByMonth(filteredRecords);
    return filteredRecords;
  } catch (e) {
    console.log(e, headers);
    req.reject(500, 'Error in fetching Delivery Periods')
  }

}

async function getVehicles(req, ctrmtab, headers) {
  try {
    let resultVehicles = await ctrmtab.send({ query: 'GET /v1/ReferenceData/GetVehicles', headers: headers });
    return resultVehicles;
  } catch (e) {
    console.log(e, headers);
    req.reject(500, e)
  }

}

async function getShipToValue(req) {
  try {
    let backend = await cds.connect.to("SCWB");
    let sUrl = `/ShipToVHSet?$filter=` + req._query.$filter;
    let resultShipTo = await backend.get(sUrl);
    return resultShipTo;
  } catch (e) {
    console.log(e);
    req.reject(500, e)
  }

}

async function getS4ValueHelpData(req) {
  try {
    let backend = await cds.connect.to("SCWB_MARINE");
    let sEntity = req.entity.split(".")[1];

    //let sUrl = `/` + sEntity;
    // if (req._query.$filter !== "" && req._query.$filter !== undefined && req._query.$filter !== null)
    //   sUrl += `?$filter=` + req._query.$filter;
    let sUrl = decodeURI(req.req.url)
    sUrl = sUrl.replaceAll('contains', 'substringof')
    sUrl = sUrl.replaceAll('&%24count=true', '')
    sUrl = sUrl.replaceAll('&%24count=false', '')
    sUrl = sUrl.replace(/%24search=/, 'search=');
    let headers = { "x-sap-spnego": "disabled" } ;
      //  let sUrl = `${baseUrl}$filter=${formattedFilter}`;
    //let resultVhData = await backend.send({ query: `GET ${sUrl}`, headers: headers });
    let resultVhData = await backend.get(sUrl, { headers } );
    //resultVhData[0].$count = resultVhData.length;
    return resultVhData;
  } catch (e) {
    console.log(e);
    req.reject(500, e)
  }

}

async function getLoginToken(req, ctrmlogin) {
  try {

    const desser = await cds.connect.to("SAP_CLOUD_DESTINATION_SERVICE");

    const desserresponse = await desser.get('DUMMY_CTRM_DEST')

    // let requestData = {
    //   "UserID": "CTRMWRITE",
    //   "Password": "8%OhlMWb6jL8",
    //   "Server": "QUT"
    // }
    let requestData = {
      "ID": 0,
      "UserID": desserresponse.destinationConfiguration.User, //"CTRMREAD",
      "Password": desserresponse.destinationConfiguration.Password, 
      "Server": desserresponse.destinationConfiguration.server //
    }
    let resultLogin = await ctrmlogin.post('/v1/Account/Login', requestData);
    return resultLogin.token;
  } catch (e) {
    console.log('Error in destination');
    console.log(e);
    // req.reject(500, 'Cannnot retrive token');
  }
}

module.exports = {
  getMOT,
  getCommodity,
  getDeliveryTerms,
  getLocations,
  getCounterParties,
  getStrategy,
  getDeliveryPeriods,
  getVehicles,
  getLoginToken,
  getShipToValue,
  getS4ValueHelpData,
  getDeliveryPeriodsData,
  getTraders
};