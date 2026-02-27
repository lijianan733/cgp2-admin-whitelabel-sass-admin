Ext.define("CGP.dsdatasource.store.Selector",{
    extend : 'Ext.data.Store',
    requires : ["CGP.dsdatasource.model.Selector"] ,

    model : 'CGP.dsdatasource.model.Selector',
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    autoLoad:true

});
