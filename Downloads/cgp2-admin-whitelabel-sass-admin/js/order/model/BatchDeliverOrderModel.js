/**
 * Created by nan on 2018/5/17.
 */
Ext.define('CGP.order.model.BatchDeliverOrderModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        'orderNumber',
        'orderType',
        {
            name: 'bindOrders',
            type: 'object'
        },
        {
            name: 'isTest',
            type: 'boolean'
        },
        /*   {
               name: 'datePurchased',
               type: 'date',
               convert: function (value) {
                   if (Ext.isEmpty(value)) {
                       return null;
                   } else {
                       return new Date(value)
                   }
               },
               serialize: function (value) {
                   var time = value.getTime();
                   return time;
               }
           },
           {
               name: 'shipmentBoxes',
               type: 'object'
           },
           {
               name: 'confirmedDate',
               type: 'date',
               convert: function (value) {
                   if (Ext.isEmpty(value)) {
                       return null;
                   } else {
                       return new Date(value)
                   }
               },
               serialize: function (value) {
                   var time = value.getTime();
                   return time;
               }
           },*/
        'customerEmail',
        'deliveryName',
        'deliveryMobile',
        'shippingModuleCode',
        {
            name: 'deliveryAddress',
            type: 'string',
            convert: function (value, record) {
                var address = record.get('deliveryCountry') + ' ' + record.get('deliveryState') + ' ' + record.get('deliveryCity') + ' ' + record.get('deliverySuburb') + ' ' +
                    record.get('deliveryStreetAddress1') + ' ' + record.get('deliveryMobile') + ' ' + record.get('deliveryName');
                return address;
            }
        },
        'billingName',
        'billingAddress',
        'status',
        'currencySymbol',
        'totalPrice'
        ,
        'website',
        'websiteCode',
        'deliveryCountry',
        'deliveryState',
        'deliveryCity',
        'deliverySuburb',
        'deliveryStreetAddress1',
        'deliveryStreetAddress2'
        ,
        'deliveryCompany',
        'deliveryLocationType',
        'deliveryPostcode',
        'deliveryTelephone',
        'deliveryEmail',
        'billingCountry',
        'billingState',
        'billingCity',
        'billingSuburb',
        'billingStreetAddress1',
        'billingStreetAddress2'
        ,
        'billingCompany',
        'billingLocationType',
        'billingPostcode',
        'billingTelephone',
        'billingEmail',
        'totalRefunded',
        'shippingCode',
        'shippingMethod',
        'paymentMethod',
        {
            name: 'totalCount',
            type: 'int'
        },
        {
            name: 'totalQty',
            type: 'int'
        },
        {
            type: 'boolean',
            name: 'invoice'
        },
        {
            name: 'statusId',
            type: 'int'
        },
        'reprintNo',
        'redoNo',
        {
            name: 'reprintId',
            type: 'int'
        },
        {
            name: 'redoId',
            type: 'int'
        },
        {
            name: 'websiteId',
            type: 'int',
            convert: function (value, record) {
                var websiteId = record.get('website').id;
                return websiteId;
            }
        },
        {
            name: 'partnerId',
            type: 'int'
        },
        {
            name: 'partnerName',
            type: 'string'
        },
        {
            name: 'bindOrderNumbers',
            type: 'string'
        },
        'builderPreviewUrl',
        'builderEditUrl',
        {
            name: 'partner',
            type: 'object'
        },
        {
            name: 'extraParams',
            type: 'object'
        },
        {
            name: 'producePartner',
            type: 'object'
        },
        {
            name: 'isRedo',
            type: 'boolean'
        },
        {
            name: 'suspectedSanction',
            type: 'boolean'
        },
        {
            name: 'isMultiAddressDelivery',
            type: 'boolean'
        },
        {
            name: 'shipmentInfo',
            type: 'object',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return {};
                } else {
                    return value;
                }
            },
        },
        {
            name: 'isComplete',
            type: 'boolean',
            convert: function (value, record) {
                var shipmentInfo = record.get('shipmentInfo');
               
                if (shipmentInfo) {
                    if (Ext.isEmpty(shipmentInfo.weight) || Ext.isEmpty(shipmentInfo.deliveryNo) || Ext.isEmpty(shipmentInfo.orderNumber) || Ext.isEmpty(shipmentInfo.cost) || Ext.isEmpty(shipmentInfo.shippingMethodName)) {
                        return false;
                    }
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]
})
