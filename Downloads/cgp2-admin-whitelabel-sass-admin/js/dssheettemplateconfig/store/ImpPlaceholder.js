Ext.define("CGP.dssheettemplateconfig.store.ImpPlaceholder",{
    extend : 'Ext.data.Store',
    requires : ["CGP.dssheettemplateconfig.model.ImpPlaceholder"] ,

    model : 'CGP.dssheettemplateconfig.model.ImpPlaceholder',
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    autoLoad:true

});
