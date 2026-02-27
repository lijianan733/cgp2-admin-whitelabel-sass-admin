Ext.define("CGP.rttypes.store.Attribute",{
    extend: 'Ext.data.Store',
    fields: [{
        name: 'rtAttributeDef',
        type: 'object'
    },{
        name: 'sortOrder',
        type: 'int'
    },{
        name: 'belongsToParent',
        type: 'boolean',
        useNull: true
    },{
        name: 'depth',
        type: 'int'
    }],
    groupField: 'belongsToParent',
    proxy: {
        type: 'memory'
    },
    sorters : [
        {
            property : 'depth',
            direction : 'ASC'
        },{
        property : 'sortOrder',
        direction : 'ASC'
    }],
    listeners : {
        update: function(me,record, operation,modifiedFieldNames, eopts){
            me.sort('depth','ASC');
            me.sort("sortOrder",'ASC');
        }
    }
})