Ext.define('CGP.manufactureorderitem.model.ManuFactureOrderItemModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'qty',
            type: 'int'
        },
        {
            name: 'material',
            type: 'object'
        },
        {
            name: 'orderLineItem',
            type: 'object'
        },
        {
            name: 'status',
            type: 'object'
        },
        {
            name: 'manufactureOrderId',
            type: 'int'
        }
    ]
})