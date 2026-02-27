Ext.define('CGP.orderdetails.store.Country', {
    extend: 'Ext.data.Store',

    pageSize: 200,

    fields: [{
        name: 'id',
        type: 'int'
    }, 'isoCode2', 'name'],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/countries',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})