Ext.define('CGP.product.view.multiattributeonewaypropertyvalueconfig.store.ConfigStore',{
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.multiattributeonewaypropertyvalueconfig.model.ConfigModel',
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/admin/productCompositeModels',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad: true
});