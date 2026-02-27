
Ext.define('CGP.common.model.RtAttributeDef',{
    extend : 'Ext.data.Model',
	idProperty : '_id',
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
        name: 'customTypeId',
        type: 'string',
        persist: false,
        convert: function(value,record){
            if(Ext.isEmpty(value)){
                if(Ext.isEmpty(record.get('customType'))){
                    return null;
                }else{
                    return record.get('customType')['_id'];
                }
                //return record.get('customType')['_id']
            }else{
                return value
            }

        }
    },
        {
        name: 'customType',
        serialize: function(value,record){
            return {
                _id: record.get('customTypeId'),
                idReference: 'RtType',
                clazz: domainObj['RtType']
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
        name: 'description',
        type: 'string'
    },{
        name: 'clazz',
        type: 'string',
        defaultValue: domainObj['RtAttributeDef']
    }],
    proxy : {
        type: 'uxrest',
        url :  adminPath + 'api/rtAttributeDefs',
        reader : {
            type : 'json',
            root : 'data'
        }
    }
});