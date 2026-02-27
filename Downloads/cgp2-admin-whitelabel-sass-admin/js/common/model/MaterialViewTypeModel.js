
Ext.define('CGP.common.model.MaterialViewTypeModel',{
    extend : 'Ext.data.Model',
    idProperty : '_id',
    fields : [{
        name: '_id',
        type: 'string',
        useNull: true
    },{
        name: 'clazz',
        type: 'string',
        defaultValue: domainObj['MaterialViewType']
    },{
        name: 'name',
        type: 'string',
        useNull: true
    },{
        name: 'displayName',
        type: 'string',
        convert: function(value,record){
            if(Ext.isEmpty(record.get('name'))){
                return record.getId();
            }else{
                return record.get('name')+'('+record.getId()+')'
            }
        }
    },{
        name: 'designType',
        type: 'object',
        defaultValue: undefined

    },{
        name: 'predesignObject',
        type: 'object',
        defaultValue: undefined
    },{
        name: 'sequenceNumber',
        type: 'int',
        useNull: true
    },{
        name: 'pageContentStrategy',
        type: 'string',
        useNull: true
    },{
        name: 'config',
        type: 'string',
        useNull: true
    },{
        name: 'userAssign',
        type: 'string',
        useNull: true
    },{
        name: 'userAssign',
        type: 'string',
        useNull: true
    },{
        name: 'pageContentFetchStrategy',
        type: 'string',
        useNull: true
    },{
        name: 'templateType',
        type: 'object',
        defaultValue: undefined
    },{
        name: 'pcsPlaceholders',
        type: 'array',
        defaultValue: undefined
    },{
        name: 'pageContentSchema',
        type: 'object',
        defaultValue: undefined
    },{
        name: 'dsDataSource',
        type: 'object',
        defaultValue: undefined
    },{
        name: 'description',
        type: 'string'
    },{
        name: 'mainVariableDataSource',
        type: 'object',
        defaultValue: undefined
    },{
        name: 'pageContentIndexExpression',
        type: 'string'
    },{
        name: 'pageContentRange',
        type: 'object',
        defaultValue: undefined
    },{
        name: 'pageContentInstanceRange',
        type: 'object',
        defaultValue: undefined
    }],
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/materialViewTypes',
        reader:{
            type:'json',
            root:'data'
        }
    }
});