Ext.define('CGP.product.view.productconfig.store.ProductContexts',{
    extend: 'Ext.data.Store',
    fields: ['code'],
    proxy: {
        type: 'uxrest',
        url: adminPath+ 'api/productConfigs/contexts',
        reader: {
            type: 'stringreader',
            root: 'data'
        }
    },
    autoLoad: true
})