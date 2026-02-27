new Ext.data.Store({
    storeId: 'dcountryStore',
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
});

Ext.define('CGP.order.actions.address.store.Country')