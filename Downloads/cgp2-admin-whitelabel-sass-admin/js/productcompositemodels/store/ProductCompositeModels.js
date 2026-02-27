Ext.define('CGP.productcompositemodels.store.ProductCompositeModels',{
    extend: 'Ext.data.Store',
    model: 'CGP.productcompositemodels.model.ProductCompositeModels',
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/admin/productCompositeModels',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad: true
})