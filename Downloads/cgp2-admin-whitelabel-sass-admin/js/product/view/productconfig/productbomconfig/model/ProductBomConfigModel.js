Ext.define('CGP.product.view.productconfig.productbomconfig.model.ProductBomConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        }, {
            name: 'type',
            type: 'string'
        }, {
            name: 'configVersion',
            type: 'int'
        }, {
            name: 'configValue',
            type: 'string'
        }, {
            name: 'status',
            type: 'int'
        }, {
            name: 'context',
            type: 'string'
        }, {
            name: 'productConfigId',
            type: 'int'
        }, {
            name: 'schemaVersion',
            type: 'string'
        }, {
            name: 'productMaterialId',
            type: 'string'
        },
        {
            name: 'versionedProductAttributeId',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'materialName',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigBoms',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
