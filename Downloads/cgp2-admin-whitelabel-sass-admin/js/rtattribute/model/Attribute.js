Ext.define('CGP.rtattribute.model.Attribute', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'code',
        type: 'string'
    }, {
        name: 'required',
        type: 'boolean',
        convert: function (){
            return true;
        }
    }, {
        name: 'validationExp',
        type: 'string'
    }, {
        name: 'valueType',
        type: 'string',
        defaultValue: 'String'
    }, {
        name: 'valueDefault',
        type: 'string'
    }, {
        name: 'selectType',
        type: 'string',
        defaultValue: 'NON'
    }, {
        name: 'arrayType',
        type: 'string',
        defaultValue: 'NON'
    }, {
        name: 'customTypeId',
        type: 'string',
        persist: false,
        convert: function (value, record) {
            if (Ext.isEmpty(value)) {
                if (Ext.isEmpty(record.get('customType'))) {
                    return null;
                } else {
                    return record.get('customType')['_id'];
                }
                //return record.get('customType')['_id']
            } else {
                return value
            }

        }
    },
        {
            name: 'customType',
            type: 'object',
            serialize: function (value, record) {
                if (!Ext.isEmpty(record.get('customTypeId'))) {
                    return {
                        _id: record.get('customTypeId'),
                        idReference: 'RtType',
                        clazz: domainObj['RtType']
                    }
                } else {
                    return undefined;
                }
            }
        }, {
            name: 'options',
            type: 'array',
            serialize: function (value) {
                if (Ext.isEmpty(value)) {
                    return [];
                }
                return value;
            }
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: domainObj['RtAttributeDef']
        }, {
            name: 'belongsToParent',
            type: 'boolean'
        }, {
            name: 'sortOrder',
            type: 'string'
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/rtAttributeDefs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
