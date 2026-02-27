Ext.define('CGP.test.recombinemodel.Model',{
    extend: 'Ext.data.Model',
    fields : [{
        name : '_id',
        type : 'string',
        useNull: true
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
        name: 'selectType',
        type: 'string'
    },{
        name: 'arrayType',
        type: 'string'
    },{
        name: 'customType',
        type: 'object',
        convert: function(value){
            return value['_id']
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
    }],
    proxy : {
        type: 'memory'
    }
});