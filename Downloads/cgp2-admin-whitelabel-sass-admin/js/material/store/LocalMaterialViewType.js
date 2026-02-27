Ext.define("CGP.material.store.LocalMaterialViewType",{
    extend : 'Ext.data.Store',
    model: 'CGP.material.model.MaterialViewType',
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