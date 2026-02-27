Ext.define("CGP.pagecontentschema.store.PriceArea",{
    extend : 'Ext.data.Store',

    model : 'CGP.pagecontentschema.model.PriceArea',
    autoSync : true,
    proxy : {
        type : 'memory'
    }
});