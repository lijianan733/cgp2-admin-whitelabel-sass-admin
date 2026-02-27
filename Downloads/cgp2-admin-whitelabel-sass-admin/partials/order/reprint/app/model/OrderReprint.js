Ext.define('CGP.orderreprint.model.OrderReprint', {
    extend: 'Ext.data.Model',

    fields: [{
            name: 'id',
            type: 'int'
        }, 'orderNo', 'reprintNo', 'status', 'reason',
        'websiteCode', {
            name: 'lineItems',
            type: 'array'
    }]

})