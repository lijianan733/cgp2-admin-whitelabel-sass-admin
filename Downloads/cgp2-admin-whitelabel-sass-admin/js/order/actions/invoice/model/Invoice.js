Ext.define('CGP.order.actions.invoice.model.Invoice', {
    extend: 'Ext.data.Model',

    fields: [{
        type: 'int',
        name: 'id',
        useNull: true
    }, {
        type: 'int',
        name: 'type'
    }, 'title', 'orderNo', 'content', {
        type: 'int',
        name: 'websiteId'
    }]

})