/**
 * Created by nan on 2020/2/19.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.PreProcessConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'runWhenInit',
            type: 'boolean'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'targetMaterialViewType',
            type: 'object'
        },
        {
            name: 'sourceMaterialViewTypes',
            type: 'array'
        }, {
            name: 'conditionMappingConfigs',
            type: 'array'
        }, {
            name: 'designId',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialViewTypePrecessConfigController',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
