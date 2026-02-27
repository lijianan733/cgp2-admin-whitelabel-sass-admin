Ext.define("CGP.bommaterial.model.CustomerAttribute",{
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
            name: 'required',
            type: 'boolean'
        },{
            name: 'validationExp',
            type: 'string'
        },{
            name: 'valueType',
            type: 'string'
        },{
            name: 'valueDefault',
            type: 'string'
        },{
            name: 'readonly',
            type: 'boolean'
        },{
            name: 'selectType',
            type: 'string'
        },{
            name: 'description',
            type: 'string'
        },{
            name: 'sortOrder',
            type: 'int'
        },{
            name: 'options',
            type: 'array',
            serialize: function (value) {
                if(Ext.isEmpty(value)){
                    return [];
                }
                return value;
            }
        }]
});
