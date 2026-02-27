Ext.define("CGP.material.store.Constraint",{
    extend : 'Ext.data.Store',
    model: 'CGP.material.model.Constraint',
    autoSync : true,
    proxy : {
        type : 'memory'
    }
});