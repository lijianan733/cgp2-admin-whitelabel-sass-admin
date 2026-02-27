Ext.define("CGP.rttypes.store.RtAttributeDef",{

    extend : 'Ext.data.Store',
    requires : ['CGP.rttypes.model.RtAttributeDef'],

    model : 'CGP.rttypes.model.RtAttributeDef',
    groupField: 'belongsToParent',
    proxy: {
        type: 'memory'
    },
    sorters : [
        {
            property : 'depth',
            direction : 'ASC'
        }/*,{
            property : 'sortOrder',
            direction : 'ASC'
        }*/],
    listeners : {
        update: function(me,record, operation,modifiedFieldNames, eopts){
            me.sort('depth','ASC');
            //me.sort("sortOrder",'ASC');
        }
    }
});