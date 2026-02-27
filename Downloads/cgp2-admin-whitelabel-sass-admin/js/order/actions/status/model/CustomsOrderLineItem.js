Ext.define('Order.status.model.CustomsOrderLineItem', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'orderLineItemId',
        type: 'int'
    }, {
        name: 'alonePacking',
        type: 'boolean'
    }, {
        name: 'outName',
        type: 'string'
    }, {
        name: 'sizeDesc',
        type: 'string'
    }, {
        name: 'productDTO',
        type: 'object'
    },{
        name: 'qty',
        type: 'int'
    },{
        name: 'unBoxUpCount',
        type: 'int'
    }]
});
