Ext.define('CGP.order.actions.address.model.Order', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, 'orderNumber', 'shippingMethod', {
        name: 'websiteId',
        type: 'int'
    }]
})