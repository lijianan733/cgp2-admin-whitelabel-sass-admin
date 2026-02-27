/**
 * Created by nan on 2021/11/10
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.model.PropertySimplifyConfigModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        },
        {
            name: 'propertyValues',
            type: 'array'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'keyValuesDTO',
            type: 'array',
        },
        {
            name: 'onlyNotSku',
            type: 'boolean'
        },
        {
            name: 'productConfigDesignId',
            type: 'string',
        },
        {
            name: 'propertyTypeSchema',
            type: 'object',
        },
        {
            name: 'propertyJsonSchema',
            type: 'string',
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.product.config.property.PropertySimplifyConfig"
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/propertySimplifyConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})