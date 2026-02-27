Ext.define('CGP.ordersign.model.SalesOrderItemModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'number'
        },
        {
            name: 'price',
            type: 'number'
        },
        {
            name: 'qty',
            type: 'number'
        },
        {
            name: 'amount',
            type: 'number'
        },
        {
            name: 'price',
            type: 'string'
        },
        {
            name: 'amount',
            type: 'string'
        },
        {
            name: 'priceStr',
            type: 'string'
        },
        {
            name: 'amountStr',
            type: 'string'
        },
        {
            name: 'seqNo',
            type: 'number'
        },
        {
            name: 'product',
            type: 'object'
        },
        {
            name:'thumbnailInfo',
            type: 'object'
        }
    ]
})