Ext.define("CGP.materialviewtype.store.PcsPlaceholder",{
    extend : 'Ext.data.Store',
    model : 'CGP.materialviewtype.model.PcsPlaceholder',
    autoSync : true,
    proxy : {
        type : 'memory'
    }
});
