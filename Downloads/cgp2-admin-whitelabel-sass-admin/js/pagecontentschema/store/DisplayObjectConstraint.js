Ext.define("CGP.pagecontentschema.store.DisplayObjectConstraint",{
    extend : 'Ext.data.Store',

    model : 'CGP.pagecontentschema.model.DisplayObjectConstraint',
    proxy : {
        type : 'memory'
    },
    autoSync : true
});
