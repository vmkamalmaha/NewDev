const cds = require('@sap/cds');
const proxy = require('@sap/cds-odata-v2-adapter-proxy');

// Add OData V2 Proxy to the CDS Server
cds.on('bootstrap', (app) => {
    app.use(proxy());
});

// Start the CDS Server
module.exports = cds.server;
