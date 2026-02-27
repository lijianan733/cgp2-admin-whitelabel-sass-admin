Ext.define('CGP.product.view.productconfig.productviewconfig.model.ProductViewCfgModel', {
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
            type: 'number'
        }, {
            name: 'type',
            type: 'string'
        }, {
            name: 'configValue',
            type: 'string'
        }, {
            name: 'path',
            type: 'string'
        }, {
            name: 'status',
            type: 'int'
        }, {
            name: 'builderViewVersion',
            type: 'string'
        }, {
            name: 'context',
            type: 'string'
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
            name: 'viewCompatibilities',
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
            name: 'builderConfig',
            type: 'object'
        },
        {
            name: 'builderViewVersion',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigViews',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
