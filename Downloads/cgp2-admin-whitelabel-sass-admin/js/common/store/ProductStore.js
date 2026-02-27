Ext.Loader.syncRequire(['CGP.common.model.ProductModel']);
Ext.define('CGP.common.store.ProductStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.common.model.ProductModel',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products/list",
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})
