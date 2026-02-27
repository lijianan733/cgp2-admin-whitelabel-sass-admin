Ext.define('CGP.deliveryorder.store.BoxSizeUnit', {
    extend: 'Ext.data.Store',
    fields: ['title', 'value'],
    data: [{
        title: 'CM',
        value: 'CM'
    }, {
        title: 'INCH',
        value: 'INCH'
    }, {
        title: 'MM',
        value: 'MM'
    }],

    proxy: {
        type: 'memory'
    }
})