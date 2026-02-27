Ext.define("CGP.material.store.BomItem",{
    extend : 'Ext.data.Store',
    model: 'CGP.material.model.BomItem',
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    sorters : [{
        property : 'id',
        direction : 'ASC'
    }],
    listeners : {
        update: function(me,record, operation,modifiedFieldNames, eopts){
            me.sort("id",'ASC');
        }
    }
});