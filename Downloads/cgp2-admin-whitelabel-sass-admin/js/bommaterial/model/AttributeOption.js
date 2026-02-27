Ext.define("CGP.bommaterial.model.AttributeOption",{
    extend : 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },{
            name: 'name',
            type: 'string'
        },{
            name: 'sortOrder',
            type: 'int'
        },{
            name: 'value',
            type: 'string'
        }
    ]
});
