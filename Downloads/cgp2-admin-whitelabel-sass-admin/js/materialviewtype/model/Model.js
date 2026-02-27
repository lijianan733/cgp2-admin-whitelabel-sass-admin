Ext.define('CGP.materialviewtype.model.Model', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: domainObj['MaterialViewType']
    }, {
        name: 'name',
        type: 'string',
        useNull: true
    }, {
        name: 'isFixedStructure',
        type: 'boolean'
    }, {
        name: 'designType',
        type: 'object',
        defaultValue: undefined/*,
        convert: function(value,record){
            if(!Ext.isEmpty(value)){
                var stringValue = Ext.JSON.encode(value);
                return stringValue;
            }
        },
        serialize: function(value,record){
            if(!Ext.isEmpty(value)){
                var jsonValue = Ext.JSON.decode(value);
                return Ext.JSON.decode(jsonValue);
            }
        }*/

    }, {
        name: 'predesignObject',
        type: 'object',
        defaultValue: undefined/*,
        convert: function(value,record){
            if(!Ext.isEmpty(value)){
                var stringValue = Ext.JSON.encode(value);
                return stringValue;
            }
        },
        serialize: function(value,record){
            if(!Ext.isEmpty(value)){
                var jsonValue = Ext.JSON.decode(value);
                return Ext.JSON.decode(jsonValue);
            }
        }*/
    }, {
        name: 'sequenceNumber',
        type: 'int',
        useNull: true
    }, {
        name: 'pageContentStrategy',
        type: 'string',
        useNull: true
    }, {
        name: 'config',
        type: 'string',
        useNull: true
    }, {
        name: 'userAssign',
        type: 'string',
        useNull: true
    }, {
        name: 'userAssign',
        type: 'string',
        useNull: true
    }, {
        name: 'pageContentFetchStrategy',
        type: 'string',
        useNull: true
    }, {
        name: 'templateType',
        type: 'string',
        defaultValue: undefined/*,
        convert: function(value,record){
            if(!Ext.isEmpty(value)){
                var stringValue = Ext.JSON.encode(value);
                return stringValue;
            }
        },
        serialize: function(value,record){
            if(!Ext.isEmpty(value)){
                var jsonValue = Ext.JSON.decode(value);
                return Ext.JSON.decode(jsonValue);
            }
        }*/
    }, {
        name: 'pcsPlaceholders',
        type: 'array',
        defaultValue: undefined/*,
        convert: function(value,record){
            if(!Ext.isEmpty(value)){
                var stringValue = Ext.JSON.encode(value);
                return stringValue;
            }
        },
        serialize: function(value,record){
            if(!Ext.isEmpty(value)){
                var jsonValue = Ext.JSON.decode(value);
                return Ext.JSON.decode(jsonValue);
            }
        }*/
    }, {
        name: 'pageContentSchema',
        type: 'object',
        defaultValue: undefined/*,
        convert: function(value,record){
            if(!Ext.isEmpty(value)){
                var stringValue = Ext.JSON.encode(value);
                return stringValue;
            }
        },
        serialize: function(value,record){
            if(!Ext.isEmpty(value)){
                var jsonValue = Ext.JSON.decode(value);
                return Ext.JSON.decode(jsonValue);
            }
        }*/
    }, {
        name: 'pageContentSchemaId',
        type: 'string',
        convert: function (value, record) {
            if (record.get('pageContentSchema')) {
                return record.get('pageContentSchema')._id
            }
        }
    }, {
        name: 'dsDataSource',
        type: 'object',
        defaultValue: undefined/*,
        convert: function(value,record){
            if(!Ext.isEmpty(value)){
                var stringValue = Ext.JSON.encode(value);
                return stringValue;
            }
        },
        serialize: function(value,record){
            if(!Ext.isEmpty(value)){
                var jsonValue = Ext.JSON.decode(value);
                return Ext.JSON.decode(jsonValue);
            }
        }*/
    }, {
        name: 'dsDataSourceId',
        type: 'string',
        convert: function (value, record) {
            if (record.get('dsDataSource')) {
                return record.get('dsDataSource')._id;
            }
        }
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'mainVariableDataSource',
        type: 'object',
        defaultValue: undefined
    }, {
        name: 'mainVariableDataSourceId',
        type: 'string',
        convert: function (value, record) {
            if (record.get('mainVariableDataSource')) {
                return record.get('mainVariableDataSource')._id;
            }
        }
    }, {
        name: 'pageContentIndexExpression',
        type: 'string'
    }, {
        name: 'pageContentRange',
        type: 'object',
        defaultValue: undefined
    }, {
        name: 'pageContentInstanceRange',
        type: 'object',
        defaultValue: undefined
    }, {
        name: 'templateType',
        type: 'string'
    },
        {
            name: 'placeHolderVdCfgs',
            type: 'array'
        },
        {
            name: 'variableDataSourceQtyCfgs',
            type: 'array'
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialViewTypes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
