Ext.define('CGP.model.Order', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
            name: 'id',
            type: 'int',
            useNull: true
 }, 'orderNumber', 'orderType', {
            name: 'datePurchased',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
 }, {
            name: 'createdDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
 }, 'customerEmail', 'deliveryName', 'deliveryAddress', 'billingName', 'billingAddress', 'status', 'currencySymbol', 'totalPrice'
, 'website', 'websiteCode', 'deliveryCountry', 'deliveryState', 'deliveryCity', 'deliverySuburb', 'deliveryStreetAddress1', 'deliveryStreetAddress2'
, 'deliveryCompany', 'deliveryLocationType', 'deliveryPostcode', 'deliveryTelephone', 'deliveryEmail', 'billingCountry', 'billingState', 'billingCity', 'billingSuburb', 'billingStreetAddress1', 'billingStreetAddress2'
, 'billingCompany', 'billingLocationType', 'billingPostcode', 'billingTelephone', 'billingEmail', 'totalRefunded', 'shippingCode', 'shippingMethod', 'paymentMethod', 'redoNo', 'reason',
        {
            name: 'suspectedSanction',
            type: 'boolean'
        },
        {
            name: 'isMultiAddressDelivery',
            type: 'boolean'
        },
        {
            name: 'totalCount',
            type: 'int'
 }, {
            name: 'totalQty',
            type: 'int'
 }, {
            type: 'boolean',
            name: 'invoice'
 }, {
            name: 'statusId',
            type: 'int'
 }, {
            name: 'lineItems',
            type: 'array'
        }
 ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})