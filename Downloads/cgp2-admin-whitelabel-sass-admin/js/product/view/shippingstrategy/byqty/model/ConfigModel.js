Ext.define("CGP.product.view.shippingstrategy.byqty.model.ConfigModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        'clazz', {
            name: 'defaultConfig',
            type: 'boolean'
        },
        {
            name: 'areaShippingConfigGroup',
            type: 'object'
        },
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'attributePredicate',
            type: 'object'
        },
        {
            name: 'attributePredicateDto',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productAreaShippingConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
