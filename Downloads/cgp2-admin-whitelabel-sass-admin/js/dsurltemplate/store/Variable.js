Ext.define("CGP.dsurltemplate.store.Variable",{
    extend : 'Ext.data.Store',
    requires : ["CGP.dsurltemplate.model.Variable"] ,

    model : 'CGP.dsurltemplate.model.Variable',
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    autoLoad:true

});
