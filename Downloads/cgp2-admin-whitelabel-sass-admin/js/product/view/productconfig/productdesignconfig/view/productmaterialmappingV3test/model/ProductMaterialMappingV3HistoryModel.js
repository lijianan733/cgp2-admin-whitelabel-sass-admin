/**
 * Created by nan on 2020/5/20.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.model.ProductMaterialMappingV3HistoryModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'runResult',
            type: 'boolean'
        },
        {
            name: 'operationTime',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'operator',
            type: 'object'
        }, {
            name: 'productDesignId',
            type: 'string'
        },
        {
            name: 'productAttributes',
            type: 'object'
        }, {
            name: 'material',
            type: 'object'
        }, {
            name: 'executeExpect',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'materialPath',
            type: 'string'
        }, {
            name: 'errorDetail',
            type: 'object'
        }, {
            name: 'mappingId',
            type: 'string'
        }, {
            name: 'attributePath',
            type: 'string'
        }, {
            name: 'lackAttributePaths',
            type: 'array'
        }, {
            name: 'lackConfigBomItemId',
            type: 'string'
        }, {
            name: 'bomItemId',
            type: 'string'
        }, {
            name: 'bomItemName',
            type: 'string'
        }, {
            name: 'bomItemType',
            type: 'string'
        }, {
            name: 'errorType',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialMappingConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
