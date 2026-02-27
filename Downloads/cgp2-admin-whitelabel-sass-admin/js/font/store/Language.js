Ext.define("CGP.font.store.Language",{
    extend : 'Ext.data.Store',

    model : 'CGP.font.model.Language',
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
