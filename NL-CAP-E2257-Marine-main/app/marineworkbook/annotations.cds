using SchedulerMarineService as service from '../../srv/cat-service';

annotate service.MarineScheduler with {
    Shipper           @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'ShipperVHSet',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: Shipper,
                ValueListProperty: 'Shipper',
                @title           : 'Shipper',
                @description     : 'Shipper'
            }, ],
            Label         : 'Shipper',
        },
        Common.ValueListWithFixedValues: true
    );
    TransportSystem   @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'ZCDSV_P2C_E2257_TRANSPORT_VH',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: TransportSystem,
                    ValueListProperty: 'Tsyst',
                    @title           : 'Transport System',
                    @description     : 'Transport System'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Tsnam',
                    @title           : 'Transport System Name',
                    @description     : 'Transport System Name'
                }
            ],
            Label         : 'Transport System',
        },
        Common.ValueListWithFixedValues: true,
        Common.Text                    : {
            $value                : 'Tsnam',
            ![@UI.TextArrangement]: #TextLast,
        }
    );
    FCCharterDoc      @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'ZCDSV_P2C_E2257_FC_CHARTER_VH',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: FCCharterDoc,
                    ValueListProperty: 'Fccharterdoc',
                    @title           : 'FC Charter Doc',
                    @description     : 'FC Charter Doc'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Fccharterdesc',
                    @title           : 'FC Charter Desc',
                    @description     : 'FC Charter Desc'
                }
            ],
            Label         : 'FC Charter Doc',
        },
        Common.ValueListWithFixedValues: true,
        Common.Text                    : {
            $value                : 'Fccharterdesc',
            ![@UI.TextArrangement]: #TextLast,
        }
    );
        Carrier      @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'ZCDSV_P2C_E2257_CARRIER_VH',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Carrier,
                    ValueListProperty: 'Carrier',
                    @title           : 'Carrier',
                    @description     : 'Carrier'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Vehicle'
                },
                {
                    $Type            : 'Common.ValueListParameterOut',
                    ValueListProperty: 'Vehicle',
                    LocalDataProperty: CarrierVehicle
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'VehicleText',
                    @title           : 'Vehcile Text',
                    @description     : 'Vehcile Text'
                }
            ],
            Label         : 'Carrier',
        },
        Common.ValueListWithFixedValues: false,
        // Common.Text                    : {
        //     $value                : 'VehicleText',
        //     ![@UI.TextArrangement]: #TextLast,
        // }
    );
    MOTVal_Value      @title: 'MOT'  @Common.FilterDefaultValue: 'Vessel';
    // MOT              @title: 'MOT'                       @Common.FilterDefaultValue: 'Vessel';
    ShipTo            @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'ShipToVHSet',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    ValueListProperty: 'Conpat',
                    LocalDataProperty: ShipTo,
                    @title           : 'Ship To',
                    @description     : 'Ship To'
                },
                {
                    $Type            : 'Common.ValueListParameterOut',
                    ValueListProperty: 'City',
                    LocalDataProperty: ShipToLocation,
                    @title           : 'Ship To',
                    @description     : 'Ship To'
                },
                {
                    $Type            : 'Common.ValueListParameterIn',
                    ValueListProperty: 'SAPContract',
                    LocalDataProperty: SAPContract, // Ensure this is mapped correctly
                    @title           : 'SAP Contract',
                    @description     : 'SAP Contract'
                },
                {
                    $Type            : 'Common.ValueListParameterIn',
                    ValueListProperty: 'BuySell',
                    LocalDataProperty: BuySell, // Ensure this is mapped correctly
                    @title           : 'Buy Sell',
                    @description     : 'Buy Sell'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Contract_Relevant'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Name1'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'CompAddress'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Taxjurcode'
                },
            ],
            Label         : 'Status',
        },
        Common.ValueListWithFixedValues: false
    );
    SapStatus         @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Status',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: SapStatus,
                ValueListProperty: 'Code',
                @title           : 'Code',
                @description     : 'Code'
            }, ],
            Label         : 'Status',
        },
        Common.ValueListWithFixedValues: true
    );
    // Strategy        @(
    //     Common.ValueList               : {
    //         $Type         : 'Common.ValueListType',
    //         CollectionPath: 'Commodity',
    //         Parameters    : [{
    //             $Type            : 'Common.ValueListParameterInOut',
    //             LocalDataProperty: CommodityVal_cmdty_cd,
    //             ValueListProperty: 'cmdty_cd',
    //             @title           : 'Commodity',
    //             @description     : 'Commodity'
    //         }, ],
    //         Label         : 'Commodity',
    //     },
    //     Common.ValueListWithFixedValues: true
    // );
    MOTVal_Value      @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'MOT',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: MOTVal_Value,
                    ValueListProperty: 'Value',
                    @title           : 'MOT',
                    @description     : 'MOT'
                },
                {
                    $Type            : 'Common.ValueListParameterOut',
                    LocalDataProperty: MOT,
                    ValueListProperty: 'ID',
                    @title           : 'MOT',
                    @description     : 'MOT'
                }
            ],
            Label         : 'MOT',
        },
        Common.ValueListWithFixedValues: true
    );
    CounterParty      @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Counterparty',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: CounterParty,
                ValueListProperty: 'Company_cd',
                @title           : 'Counterparty',
                @description     : 'Counterparty'
            }, ],
            Label         : 'Counterparty',
        },
        Common.ValueListWithFixedValues: true
    );
    Strategy          @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Strategy',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: Strategy,
                ValueListProperty: 'strategy_name',
                @title           : 'Strategy',
                @description     : 'Strategy'
            }, ],
            Label         : 'Strategy',
        },
        Common.ValueListWithFixedValues: true
    );
    Grade             @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Commodity',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: Grade,
                ValueListProperty: 'cmdty_cd',
                @title           : 'Grade',
                @description     : 'Grade'
            }, ],
            Label         : 'Grade',
        },
        Common.ValueListWithFixedValues: true
    );
    Trader            @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Traders',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: Trader,
                ValueListProperty: 'full_name',
                @title           : 'Trader',
                @description     : 'Trader'
            }, ],
            Label         : 'Trader',
        },
        Common.ValueListWithFixedValues: true
    );
    LoadLocation      @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Location',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: LoadLocation,
                ValueListProperty: 'Location_cd',
                @title           : 'Location',
                @description     : 'Location'
            }, ],
            Label         : 'Location',
        },
        Common.ValueListWithFixedValues: true
    );
// DeliveryIncoTermVal @(
//     Common.ValueList               : {
//         $Type         : 'Common.ValueListType',
//         CollectionPath: 'DeliveryTerm',
//         Parameters    : [{
//             $Type            : 'Common.ValueListParameterInOut',
//             LocalDataProperty: DeliveryIncoTermVal_delivery_term_cd,
//             ValueListProperty: 'delivery_term_cd',
//             @title           : 'Delivery Term',
//             @description     : 'Delivery Term'
//         }, ],
//         Label         : 'Delivery Term',
//     },
//     Common.ValueListWithFixedValues: true
// );
// DeliveryPeriodVal  @(
//     Common.ValueList               : {
//         $Type         : 'Common.ValueListType',
//         CollectionPath: 'DeliveryPeriod',
//         Parameters    : [{
//             $Type            : 'Common.ValueListParameterInOut',
//             LocalDataProperty: DeliveryPeriodVal_Time_period_cd,
//             ValueListProperty: 'Time_period_cd',
//             @title           : 'Delivery Period',
//             @description     : 'Delivery Period'
//         }, ],
//         Label         : 'Delivery Period',
//     },
//     Common.ValueListWithFixedValues: true
// );
// Vessel          @(
//     Common.ValueList               : {
//         $Type         : 'Common.ValueListType',
//         CollectionPath: 'Vehicle',
//         Parameters    : [
//             {
//                 $Type            : 'Common.ValueListParameterInOut',
//                 LocalDataProperty: VehicleVal_Mot_cd,
//                 ValueListProperty: 'Mot_cd',
//                 @title           : 'Vehicle',
//                 @description     : 'Vehicle'
//             },
//             {
//                 $Type            : 'Common.ValueListParameterIn',
//                 LocalDataProperty: MOTId,
//                 ValueListProperty: 'motTypeID',
//                 @title           : 'Vehicle',
//                 @description     : 'Vehicle'
//             }
//         ],
//         Label         : 'Vehicle',
//     },
//     Common.ValueListWithFixedValues: true
// );


};

// annotate service.MarineScheduler with
//     @UI.LineItem: [
//         {
//             $Type: 'UI.DataField',
//             Value: SAPStatus,
//             Label: 'SAP Status',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: CargoReference,
//             Label: 'Cargo Reference',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: NominationNumber,
//             Label: 'Nomination Number',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: TradeNumber,
//             Label: 'Trade Number',
//             @UI.Importance: #High,
//             SemanticObject: 'numeric'
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: Contract,
//             Label: 'Contract',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: YNom,
//             Label: 'YNom',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: ZNom,
//             Label: 'ZNom',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: Grade,
//             Label: 'Grade',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: ScheduledMaterial,
//             Label: 'Scheduled Material',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: DemandMaterial,
//             Label: 'Demand Material',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: Counterparty,
//             Label: 'Counterparty',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: BuySell,
//             Label: 'Buy/Sell',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: Incoterms,
//             Label: 'Incoterms',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: Vessel,
//             Label: 'Vessel',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: Shipper,
//             Label: 'Shipper',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: FCCharterDoc,
//             Label: 'FC Charter Doc',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: LoadLocation,
//             Label: 'Load Location',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: LoadWindow,
//             Label: 'Load Window',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: DeliveryWindow,
//             Label: 'Delivery Window',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: ShipTo,
//             Label: 'Ship To',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: ShipToLocation,
//             Label: 'Ship To Location',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: TPTLocation,
//             Label: 'Transfer Point Location',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: CargoDestination,
//             Label: 'Cargo Destination',
//             @UI.Importance: #High
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: ContractVolume,
//             Label: 'Contract Volume (BBL)',
//             @UI.Importance: #High,

//         },
//         {
//             $Type: 'UI.DataField',
//             Value: ZeroOutVolume,
//             Label: 'Zero-out Volume',
//             @UI.Importance: #High,

//         },
//         {
//             $Type: 'UI.DataField',
//             Value: NomVolume,
//             Label: 'Nominal Volume',
//             @UI.Importance: #High,

//         },
//         {
//             $Type: 'UI.DataField',
//             Value: Tolerance,
//             Label: 'Tolerance (%)',
//             @UI.Importance: #High,

//         },
//         {
//             $Type: 'UI.DataField',
//             Value: BLDate,
//             Label: 'Bill of Lading Date',
//             @UI.Importance: #High,
//             hAlign: 'Center'
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: TTDate,
//             Label: 'Title Transfer Date',
//             @UI.Importance: #High,
//             hAlign: 'Center'
//         },
//         {
//             $Type: 'UI.DataField',
//             Value: TicketVolume,
//             Label: 'Ticket Volume',
//             @UI.Importance: #High,

//         }
//     ]{};

annotate service.MarineScheduler with @(Capabilities: {FilterRestrictions: {FilterExpressionRestrictions: [{
    Property          : 'DeliveryReference',
    AllowedExpressions: 'SingleValue'
}]}});

annotate service.ZCDSV_P2C_E2257_TRANSPORT_VH with @(Tsyst: {Common: {
    Text           : Tsnam,
    TextArrangement: #TextOnly
}});

annotate service.ZCDSV_P2C_E2257_FC_CHARTER_VH with @(FCCharterDoc: {Common: {
    Text           : Fccharterdesc,
    TextArrangement: #TextOnly
}});
