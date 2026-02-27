Ext.define("CGP.bommaterial.store.LocalAttributeOption",{
    extend : 'Ext.data.Store',
    model: 'CGP.bommaterial.model.AttributeOption',
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
