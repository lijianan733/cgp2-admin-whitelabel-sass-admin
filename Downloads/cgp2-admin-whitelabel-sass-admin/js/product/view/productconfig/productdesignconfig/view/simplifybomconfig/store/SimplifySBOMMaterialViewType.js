Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.store.SimplifySBOMMaterialViewType',{
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.model.SimplifySBOMMaterialViewType',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/simplifyMaterialViewType',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    pageSize: 25,
    params : null,
    autoLoad: true
});