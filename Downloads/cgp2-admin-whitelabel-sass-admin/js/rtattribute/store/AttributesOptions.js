Ext.define("CGP.rtattribute.store.AttributesOptions",{
    extend : 'Ext.data.Store',
    requires : ["CGP.rtattribute.model.AttributesOptions"] ,

    model : 'CGP.rtattribute.model.AttributesOptions',
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    sorters : [{
        property : 'sortOrder',
        direction : 'ASC'
    }],
    listeners : {
        update: function(me,record, operation,modifiedFieldNames, eopts){
            me.sort("sortOrder",'ASC');
        }
    }
});
