Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.RtAttributeTreeModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        {
            name: 'id',
            type: 'string',
            convert: function (value, record) {
                //处理在不同层级中属性的Id相同的情况
                if (value) {
                    return value + '_' + new Date().getTime();
                } else {
                    return record.get('_id') + '_' + new Date().getTime();
                }
            }
        },
        {
            name: 'name',
            type: 'string'
        }, {
            name: 'code',
            type: 'string'
        }, {
            name: 'required',
            type: 'boolean'
        }, {
            name: 'validationExp',
            type: 'string'
        }, {
            name: 'valueType',
            type: 'string'
        }, {
            name: 'valueDefault',
            type: 'string'
        }, {
            name: 'selectType',
            type: 'string'
        }, {
            name: 'arrayType',
            type: 'string'
        }, {
            name: 'leaf',
            type: 'boolean',
            convert: function (v, record) {
                return record.data.valueType != 'CustomType' && !Ext.isEmpty(record.data.valueType);
            }
        }, {
            name: 'customTypeId',
            type: 'string',
            convert: function (value, record) {
                var customType = record.get('customType');
                if (Ext.isEmpty(value)) {
                    if (!Ext.Object.isEmpty(customType)) {
                        return record.get('customType')['_id']
                    }
                } else {
                    return value
                }

            }
        },
        {
            name: 'customType',
            serialize: function (value, record) {
                return {
                    _id: record.get('customTypeId'),
                    idReference: 'RtType',
                    clazz: domainObj['RtType']
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
            name: 'value',
            type: 'string'
        }, {
            name: 'noUse',
            type: 'boolean'
        }],
    proxy: {
        type: 'treerest',
        url: composingPath + 'api/pageConfigs/rtTypes/{id}/rtAttributeDefs',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
