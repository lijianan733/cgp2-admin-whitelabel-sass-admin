Ext.define("CGP.product.view.productconfig.productdesignconfig.store.MaterialViewType",{

    extend : 'Ext.data.Store',
    model : 'CGP.product.view.productconfig.productdesignconfig.model.MaterialViewType',
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/materialViewTypes',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true
});