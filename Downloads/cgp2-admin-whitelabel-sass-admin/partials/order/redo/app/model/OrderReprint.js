Ext.define('CGP.orderreprint.model.OrderReprint', {
    extend: 'Ext.data.Model',

    fields: [{
            name: 'id',
            type: 'int'
        }, 'orderNo', 'redoNo', 'status', 'reason',
        'websiteCode', {
            name: 'lineItems',
            type: 'array'
    }]

})