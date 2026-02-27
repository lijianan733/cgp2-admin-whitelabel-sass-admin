Ext.define('CGP.order.action.address.store.LocationType', {
    extend: 'Ext.data.Store',
    fields: ['code', 'description'],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/locationTypes',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true
})