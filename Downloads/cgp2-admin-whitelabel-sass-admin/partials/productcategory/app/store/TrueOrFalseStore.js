Ext.define('CGP.productcategory.store.TrueOrFalseStore', {
    extend: 'Ext.data.Store',
    fields: ['name', {
        name: 'value',
        type: 'boolean'
    }],
    data: [{
        name: 'true',
        value: true
        }, {
        name: 'false',
        value: false
    }]
})