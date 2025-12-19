namespace z.zmscwb;

using {
    managed,
    cuid,
    User,
    Currency
} from '@sap/cds/common';

// File: srv/scheduler.cds

// ------- Final Entity ----------//

@cds.persistence.skip: true
entity MarineScheduler {
        @UI.HiddenFilter
    key ID                      : UUID; // Unique identifier for each entry

        @UI.HiddenFilter
        Obligation              : String(30); //Obligation

        @UI.HiddenFilter
        DeliveryPeriodSAPformat : String(8);

        // Filterable fields
        @title: 'SAP Status'                  @label: 'SAP Status'
        SapStatus               : String(50); // SAP Status

        @title: 'Cargo Ref'                   @label: 'Cargo Ref'
        CargoReference          : String(100); // Cargo Reference

        @title: 'Trade Number'                @label: 'Trade Number'
        TradeNumber             : String(30); // Trade Number

        @UI.HiddenFilter
        SectionVal              : String(30);

        @title: 'Grade'                       @label: 'Grade'
        Grade                   : String(50); // Grade

        @title: 'Strategy'                    @label: 'Strategy'
        Strategy                : String(50); // Strategy

        @title: 'Mode of Transport'           @label: 'Mode of Transport'
        MOTId                   : String(2)                          @UI.HiddenFilter;

        @title: 'MOT'                         @label: 'MOT'
        MOTVal_Value            : String(50);

        @title: 'Trader'                      @label: 'Trader'
        Trader                  : String(150); // Trader

        @title: 'Load Location'               @label: 'Load Location'
        LoadLocation            : String(50); // Load Location

        @title: 'Title Transfer Date'         @label: 'Title Transfer Date'    @UI.HiddenFilter
        TitleTransferDate       : Date; // Title Transfer Date

        //@title: 'Nomination Key'       @label: 'Nomination Key'
        //NominationKey           : String(50); // Nomination Key or Delivery Reference

        @title: 'Load Window'                 @label: 'Load Window'
        LoadWindow              : String(100); // Load Window (Newly Added)

        @title: 'Delivery Window'             @label: 'Delivery Window'        @UI.HiddenFilter
        DeliveryWindow          : String(30); // Delivery Window

        // Trade Details
        @title: 'Nomination Number'           @label: 'Nomination Number'      @UI.HiddenFilter
        NominationNumber        : String(50); // Nomination Number

        @title: 'Contract'                    @label: 'Contract'               @UI.HiddenFilter
        SAPContract             : String(10); // Contract details

        @UI.HiddenFilter
        SAPContractItem         : String(6); // Contract Item


        @title: 'Y Nom'                       @label: 'Y Nom'                  @UI.HiddenFilter
        NomNumber               : String(50); // Y Nom details

        @title: 'Y Nom Hdr'                   @label: 'Y Nom Hdr'              @UI.HiddenFilter
        YNomHdr                 : String(50); // Y Nom details

        @title: 'Y Nom Item'                  @label: 'Y Nom Item'             @UI.HiddenFilter
        YNomItm                 : String(50); // Y Nom details

        @title: 'Z Nom Hdr'                   @label: 'Z Nom Hdr'              @UI.HiddenFilter
        ZNomHdr                 : String(50); // Y Nom details

        @title: 'Z Nom Item'                  @label: 'Z Nom Item'             @UI.HiddenFilter
        ZNomItm                 : String(50); // Y Nom details


        @title: 'Scheduled Material'          @label: 'Scheduled Material'     @UI.HiddenFilter
        ScheduledMaterial       : String(40); // Scheduled Material

        @UI.HiddenFilter
        ScheduledMaterialDesc   : String(40); // Scheduled Material Description

        @title: 'Demand Material'             @label: 'Demand Material'        @UI.HiddenFilter
        DemandMaterial          : String(40); // Demand Material

        @UI.HiddenFilter
        DemandMaterialDesc      : String(40); // Demand Material Description

        @title: 'Counterparty'                @label: 'Counterparty'           @UI.HiddenFilter
        CounterParty            : String(50); // Counterparty ID

        @title: 'Buy/Sell'                    @label: 'Buy/Sell'               @UI.HiddenFilter
        BuySell                 : String(10); // Buy or Sell

        @title: 'Incoterms'                   @label: 'Incoterms'              @UI.HiddenFilter
        Incoterms               : String(50); // Incoterms

        @title: 'Vessel'                      @label: 'Vessel'                 @UI.HiddenFilter
        Vessel                  : String(50); // Vessel details

        @UI.HiddenFilter
        Vehicleid               : String(10);

        @title: 'Shipper'                     @label: 'Shipper'                @UI.HiddenFilter
        Shipper                 : String(50); // Shipper ID

        @title: 'FC Charter Document'         @label: 'FC Charter Document'    @UI.HiddenFilter
        FCCharterDoc            : String(100); // Charter Document

        @title: 'Ship To'                     @label: 'Ship To'                @UI.HiddenFilter
        ShipTo                  : String(100); // Ship To location

        @title: 'Ship-To Location'            @label: 'Ship-To Location'       @UI.HiddenFilter
        ShipToLocation          : String(100); // Specific Ship-To Location

        @title: 'TPT Location'                @label: 'TPT Location'           @UI.HiddenFilter
        TPTLocation             : String(100); // Transfer Point Location

        @UI.HiddenFilter
        TPTLocationId           : String(100); // Transfer Point Location

        @UI.HiddenFilter
        SAPLocation             : String(10);


        @title: 'Cargo Destination'           @label: 'Cargo Destination'      @UI.HiddenFilter
        CargoDestination        : String(200); // Cargo Destination

        // Volume Details
        @title: 'Contract Volume'             @label: 'Contract Volume (BBL)'  @UI.HiddenFilter
        ContractVolume          : Decimal(15, 2); // Contract volume (BBL)

        @title: 'Zero-Out Volume'             @label: 'Zero-Out Volume'        @UI.HiddenFilter
        ZeroOutVolume           : Decimal(15, 2); // Zero-out volume

        @title: 'Nominal Volume'              @label: 'Nominal Volume'         @UI.HiddenFilter
        NomVolume               : Decimal(15, 2); // Nominal volume

        @UI.HiddenFilter
        PrevNomVolume           : Decimal(15, 2);

        @title: 'Tolerance'                   @label: 'Tolerance (%)'          @UI.HiddenFilter
        ToleranceMin            : Decimal(5, 2); // Tolerance in %

        @UI.HiddenFilter
        ToleranceMax            : Decimal(5, 2); // Tolerance in %          @UI.HiddenFilter

        @title: 'B/L Date'                    @label: 'BL Date'                @UI.HiddenFilter
        BLDate                  : Date; // Bill of Lading Date

        @title: 'Ticket Volume'               @label: 'Ticket Volume'          @UI.HiddenFilter
        TicketVolume            : Decimal(15, 2); // Ticket volume

        @UI.HiddenFilter
        PrevTicketVolume        : Decimal(15, 2); // Ticket volume


        @title: 'Transport System'            @label: 'Transport System'       @UI.HiddenFilter
        TransportSystem         : String(100);

        @UI.HiddenFilter
        Unit                    : String(15);

        @UI.HiddenFilter
        SAPUnit                 : String(3);

        @UI.HiddenFilter
        ContractUrl             : String(400);

        @UI.HiddenFilter
        YNomUrl                 : String(400);

        @UI.HiddenFilter
        ZNomUrl                 : String(400);

        @UI.HiddenFilter
        Plant                   : String(4);

        @UI.HiddenFilter
        CompanyCode             : String(4);

        @UI.HiddenFilter
        ErrorCode               : String(1);

        @UI.HiddenFilter
        InterCompanyDeal        : Boolean;
        ErrorDetailSet          : Association to many ErrorDetailSet @UI.HiddenFilter;

        @title: 'Nom Key/Delivery Reference'  @label: 'Nom Key/Delivery Reference'
        DeliveryReference       : String(30);

        @UI.HiddenFilter
        IsTptTicketUpdated      : Boolean;

        @UI.HiddenFilter
        InvoiceQuantity         : Decimal(15, 2);

        @UI.HiddenFilter
        NominalQuantity         : Decimal(15, 2);

        @UI.HiddenFilter
        Matkl                   : String(9);

        @UI.HiddenFilter
        Carrier                 : String(10);

        @UI.HiddenFilter
        RecordType              : String(1);

        @UI.HiddenFilter
        CarrierVehicle          : String(10);
}

@cds.persistence.skip: true
entity ErrorDetailSet {
    key Id      : UUID        @UI.HiddenFilter;
        Type    : String(10)  @UI.HiddenFilter;
        Message : String(500) @UI.HiddenFilter;
}

@cds.persistence.skip: true
entity TokenData {
    key Token : String(100)
}

@cds.persistence.skip: true
entity MOT                 @readonly {
    key Value : String(50) @UI.HiddenFilter;
        ID    : String(10) @UI.HiddenFilter;
}

@cds.persistence.skip: true
entity Strategy @readonly {
    key strategy_name : String(50);
}

@cds.persistence.skip: true
entity Traders @readonly {
    key full_name : String(150);
}

@cds.persistence.skip: true
entity Commodity              @readonly {
    key cmdty_cd : String(50) @UI.HiddenFilter;
}

@cds.persistence.skip: true
entity Location                  @readonly {
    key Location_cd : String(50) @UI.HiddenFilter;
}

@cds.persistence.skip: true
entity Vehicle                 @readonly {
    key Mot_cd    : String(50) @UI.HiddenFilter;
        motTypeID : Int16      @UI.HiddenFilter;
}

entity Status                  @readonly {
    key Code      : String(50) @UI.HiddenFilter;
        StatusVal : String(20) @UI.HiddenFilter;
}

@cds.persistence.skip: true
entity Counterparty             @readonly {
    key Company_cd : String(80) @UI.HiddenFilter;
}

@cds.persistence.skip: true
entity Obligations {
    MarinesObligationDetailSet : Association to many MarineScheduler;
    Identifier                 : String(1);
}

// ------- Final Entity Ends ----------//
