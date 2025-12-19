using z.zmscwb as sp from '../db/schema';
using {SCWB_MARINE as external} from './external/SCWB_MARINE.csn';

service SchedulerMarineService {
    @open
    entity MarineScheduler          as projection on sp.MarineScheduler;

    entity TokenData                as projection on sp.TokenData;
    entity MOT                      as projection on sp.MOT;
    entity Strategy                 as projection on sp.Strategy;
    entity Commodity                as projection on sp.Commodity;
    entity Location                 as projection on sp.Location;
    entity Counterparty             as projection on sp.Counterparty;
    entity Vehicle                  as projection on sp.Vehicle;
    entity Status                   as projection on sp.Status;
    entity ErrorDetailSet           as projection on sp.ErrorDetailSet;
    entity Obligations              as projection on sp.Obligations;
    entity Traders                  as projection on sp.Traders;

    @readonly
    entity ShipToVHSet              as projection on external.ShipToVHSet;

    @readonly
    entity ShipperVHSet             as projection on external.ShipperVHSet;

    @readonly
    entity ZCDSV_P2C_E2257_TRANSPORT_VH          as projection on external.ZCDSV_P2C_E2257_TRANSPORT_VH;

    @readonly
    entity ZCDSV_P2C_E2257_FC_CHARTER_VH as projection on external.ZCDSV_P2C_E2257_FC_CHARTER_VH;

    @readonly
    entity ZCDSV_P2C_E2257_CARRIER_VH as projection on external.ZCDSV_P2C_E2257_CARRIER_VH

    entity MarinesObligationHdrSet  as projection on external.MarinesObligationHdrSet;
    entity MarinesObligationItemSet as projection on external.MarinesObligationItemSet;


}

// ------------------------ New ------------------------//
annotate SchedulerMarineService.MarineScheduler with @(
    UI                     : {SelectionFields: [
        SapStatus,
        CargoReference,
        TradeNumber,
        Grade,
        LoadLocation,
        Strategy,
        MOTVal_Value,
        Trader,
        LoadWindow,
        DeliveryReference
    ]},
    Capabilities.Insertable: true
);
