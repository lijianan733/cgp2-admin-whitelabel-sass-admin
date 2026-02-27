Ext.define("CGP.finishedproductitem.store.FinishedProductItem",{
    extend : 'Ext.data.Store',
    requires : ["CGP.finishedproductitem.model.FinishedProductItem"],
    model : "CGP.finishedproductitem.model.FinishedProductItem",
    pageSize:20,
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/finishedProductItems',
        reader:{
            type:'json',
            root:'data.content'
        }
    },

    autoLoad:true
});
