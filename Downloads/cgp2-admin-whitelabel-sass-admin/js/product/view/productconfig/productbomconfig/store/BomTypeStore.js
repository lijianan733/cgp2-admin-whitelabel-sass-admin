Ext.define('CGP.product.view.productconfig.productbomconfig.store.BomTypeStore',{
    extend: 'Ext.data.Store',
    fields: ['code'],
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigs/bomTypes',
        reader: {
            type: 'stringreader',
            root: 'data'
        }
    },
    autoLoad: true
})