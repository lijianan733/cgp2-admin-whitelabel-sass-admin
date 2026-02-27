Ext.define('CGP.product.view.productconfig.productviewconfig.store.ViewTypeStore',{
    extend: 'Ext.data.Store',
    fields: ['code'],
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigs/viewTypes',
        reader: {
            type: 'stringreader',
            root: 'data'
        }
    },
    autoLoad: true
})