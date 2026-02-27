Ext.define("CGP.bommaterial.store.CustomerAttribute",{
    extend: 'Ext.data.Store',
    model: 'CGP.bommaterial.model.CustomerAttribute',
    proxy: {
        type: 'memory'
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
})