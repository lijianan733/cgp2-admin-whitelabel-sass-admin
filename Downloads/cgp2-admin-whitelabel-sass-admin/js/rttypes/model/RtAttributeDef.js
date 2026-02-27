
Ext.define('CGP.rttypes.model.RtAttributeDef',{
    extend : 'Ext.data.Model',
    idProperty : '_id',
    fields : [{
        name : '_id',
        type : 'string'
    },{
        name : 'name',
        type : 'string'
    },{
        name : 'code',
        type : 'string'
    },{
        name : 'required',
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
        name: 'belongsToParent',
        type: 'boolean'
    },{
        name: 'depth',
        type: 'int'
    },{
        name: 'sortOrder',
        type: 'int'
    },{
        name: 'selectType',
        type: 'string'
    },{
        name: 'arrayType',
        type: 'string'
    },{
        name: 'customType',
        type: 'object',
        convert: function(value){
            if(!Ext.Object.isEmpty(value)){
                return value['_id']
            }

        },
        serialize: function(value){
            return {
                _id: value,
                idReference: 'RtType'
            }
        }
    },{
        name: 'options',
        type: 'array',
        serialize: function (value) {
            if(Ext.isEmpty(value)){
                return [];
            }
            return value;
        }
    },{
        name: 'clazz',
        type: 'string',
        defaultValue: domainObj['RtAttributeDef']
    }]
});