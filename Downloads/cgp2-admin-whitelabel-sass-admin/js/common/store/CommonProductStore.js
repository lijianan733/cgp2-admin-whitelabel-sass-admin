Ext.define("CGP.common.store.CommonProductStore",{
    model: 'CGP.common.model.ProductModel',
    extend : 'Ext.data.Store',
    storeId: 'productStore',
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

});
