Ext.define('CGP.product.view.productconfig.productmappingconfig.model.ProductMappingCfgModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        }, {
            name: 'bomType',
            type: 'string'
        }, {
            name: 'configVersion',
            type: 'string'
        }, {
            name: 'configValue',
            type: 'string'
        }, {
            name: 'status',
            type: 'int'
        }, {
            name: 'bomCompatibilities',
            type: 'array',
            serialize: function (value) {
                if (Ext.isEmpty(value)) {
                    return [];
                }
                return value;
            }

        }, {
            name: 'productConfigId',
            type: 'int'
        }, {
            name: 'mappingVersion',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigMappings',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})