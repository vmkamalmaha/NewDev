async function formatFiltersForBody(filterQuery, DelPrd_Data) {
    // Define a mapping of old field names to new field names
    const fieldMappings = {
        'MOTVal_Value': 'MotType',
        'DeliveryPeriodVal_Display_period_cd': 'DeliveryPeriod',
        'SectionVal': 'Section',
        'Obligation': 'ObligationNumber',
        'CounterpartyVal_Company_cd': 'CounterParty',
        'DeliveryIncoTermVal_delivery_term_cd': 'DeliveryTerm',
        'VehicleVal_Mot_cd': 'Vehicle',
        'TradeNumber': 'TradeNum',
        'LocationVal_Location_cd': 'Location',
        'DeliveryPeriodVal_Time_period_cd': 'DeliveryPeriod',
        'BuySell': 'BuySell',
        'SapStatus': 'SapStatus',
        'DeliveryReference': 'TheirDelRef',
        'Grade': 'Commodity',
        'Strategy': 'Strategy',
        'CargoReference': 'Ref1',
        'LoadWindow': 'LoadWindow',
        'Trader': 'Trader',
        'DeliveryReference': 'theirDelRef'
    };

    // Function to replace fields and collect values
    function processField(oldField, newField, query) {
        let regex = new RegExp(`(${oldField}) eq '([^']+)'`, 'g');
        let matches = {};
        let match;

        // Collect unique values for the current field
        while ((match = regex.exec(query)) !== null) {
            if (!matches[newField]) {
                matches[newField] = new Set();
            }
            matches[newField].add(match[2]);
        }

        return matches;
    }

    // Create a map to collect combined values for each field
    let allMatches = {};
    for (let oldField in fieldMappings) {
        let newField = fieldMappings[oldField];
        let fieldMatches = processField(oldField, newField, filterQuery);
        for (let field in fieldMatches) {
            if (!allMatches[field]) {
                allMatches[field] = new Set();
            }
            fieldMatches[field].forEach(value => allMatches[field].add(value));
        }
    }

    // Build the transformed query
    let transformedQueryParts = [];
    let sapStatusFilters = '';
    for (let field in allMatches) {
        if (field != 'SapStatus') {
            let combinedValues = [...allMatches[field]].join(',');
            transformedQueryParts.push(`"${field}":"${combinedValues}"`);
        } else {
            sapStatusFilters = [...allMatches[field]].join(',');
        }

    }

    // Join the parts with appropriate logical operators
    let transformedFilterQuery = transformedQueryParts.join(',');
    transformedFilterQuery = JSON.parse(`{${transformedFilterQuery}}`)


    return { transformedFilterQuery, sapStatusFilters };
}

async function sortData(sortQuery, respData) {
    // Parse the response data (it is an array of strings in your case)
    let parsedData = respData.map(item => item);

    // Split the sort query into individual sort instructions
    let sortFields = sortQuery.split(',');

    // Sorting logic based on multiple fields, keeping rows with empty Obligation last
    parsedData.sort((a, b) => {
        // Check if 'Obligation' is empty or undefined and move those rows to the end
        if (!a.Obligation && b.Obligation) return 1; // a has empty 'Obligation', move it down
        if (a.Obligation && !b.Obligation) return -1; // b has empty 'Obligation', move it down
        if (!a.Obligation && !b.Obligation) return 0; // both are empty or undefined, consider them equal

        // Otherwise, apply the normal sorting based on the query
        for (let sortField of sortFields) {
            // Split the field and direction (asc or desc)
            let [field, direction] = sortField.trim().split(' ');

            // If the field is undefined in either object, treat it as the lowest possible value (e.g., move to the end)
            let valueA = a[field] !== undefined ? a[field] : '';
            let valueB = b[field] !== undefined ? b[field] : '';

            // Handle the ascending/descending logic
            if (valueA < valueB) {
                return direction === 'asc' ? -1 : 1;
            } else if (valueA > valueB) {
                return direction === 'asc' ? 1 : -1;
            }
        }
        // If all fields are equal, return 0
        return 0;
    });

    return parsedData;
}

async function getLastThreeMonthsDelPeriods(filterQuery, transformedQuery, periodData, numOfMnthsPast, numOfMnthsFuture) {
    if(!numOfMnthsPast){
        numOfMnthsPast = 3;
    }
    if(!numOfMnthsFuture){
        numOfMnthsFuture = 2;
    }
    const today = new Date();
    const months = [];
    const options = { month: 'short', year: 'numeric' };

    // Iterate to get last 3 months and the current month
    for (let i = numOfMnthsPast; i >= (-1 * numOfMnthsFuture); i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const formatted = date.toLocaleDateString('en-US', options);
        const [month, year] = formatted.split(' ');
        months.push(`${month} ${year}`);
    }
    let periodVals = await periodData.filter(period => months.includes(period.Time_period_cd));

    const concatenatedStrings = periodVals.map(period => {
        const startDate = period.Period_start_dt.slice(0, 8); // Extract YYYYMMDD
        const endDate = period.Period_end_dt.slice(0, 8);     // Extract YYYYMMDD
        return `${startDate}:${endDate}`;
    });

    transformedQuery["DeliveryPeriod"]=concatenatedStrings.join(',');

    return transformedQuery;
}

async function handleLoadWindowFilters(filterQuery, transformedQuery) {
    const match = filterQuery.match(/LoadWindow ge '(\d+)' and LoadWindow le '(\d+)'/);

    if (match) {
        const [_, geValue, leValue] = match;

        // Format values as ObligationStartDate and ObligationEndDate
        const ObligationStartDate = `${geValue}000000`; // Append '000000' to the geValue
        const ObligationEndDate = `${leValue}000000`;   // Append '000000' to the leValue
        transformedQuery["ObligationStartDate"] = ObligationStartDate;
        transformedQuery["ObligationEndDate"] = ObligationEndDate;
    }
    return transformedQuery;

}

module.exports = {
    sortData,
    formatFiltersForBody,
    getLastThreeMonthsDelPeriods,
    handleLoadWindowFilters
};
