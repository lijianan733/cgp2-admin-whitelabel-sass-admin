
Ext.define('CGP.material.model.RtAttribute',{
    extend : 'Ext.data.Model',
//	idProperty : 'id',
    fields : [{
        name : 'id',
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
        useNull: true
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
        type: 'uxrest',
        url :  adminPath + 'api/admin/runtimeType/attributes',
        reader : {
            type : 'json',
            root : 'data'
        }
    }
});