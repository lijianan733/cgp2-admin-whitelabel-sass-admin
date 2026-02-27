Ext.define('CGP.model.Product', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'bindProductId',
        type: 'int',
        useNull: true
    }, 'model', 'name', 'sku',
        'shortDescription', 'description1',
        'description2', 'description3', 'type',
        {
            name: 'status',
            type: 'int'
        }, {
            name: 'dateAvailable',
            type: 'date',
            dateWriteFormat: 'Uu',
            convert: function (value) {
                return new Date(value);
            }
        }, {
            name: 'salePrice',
            type: 'string'
        }, {
            name: 'weight',
            type: 'float'
        }, {
            name: 'moq',
            type: 'int'
        }, {
            name: 'invisible',
            type: 'boolean'
        }, {
            name: 'template',
            type: 'object'
        }, {
            name: 'medias',
            type: 'array'
        }, {
            name: 'attributeValues',
            type: 'array'
        }, {
            name: 'configurableProductId',
            type: 'int',
            useNull: true
        }, {
            name: 'skuAttributes',
            type: 'object'
        }, {
            name: 'mainCategory',
            type: 'object'
        }, {
            name: 'subCategories',
            type: 'array'
        }, {
            name: 'customAttributes',
            type: 'array'
        }, {
            name: 'paibanTypeId',
            type: 'int',
            useNull: true
        }, {
            name: 'compositeId',
            type: 'string'
        }, {
            name: 'builderType',
            type: 'string'
        }, {
            name: 'priceRules',
            type: 'array'
        }, {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }
        }, {
            name: 'mode',
            type: 'string'
        },
        {
            name:'websiteName',
            type: 'string'
        },{
            //最低价格
            name: 'lowestPrice',
            type: 'number',
            useNull: true,
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products",
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})

Ext.define('CGP.model.ProductCateogry', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: adminPath + 'api/productCategories',
        extraParams: {
            access_token: Ext.util.Cookies.get('token'),
            website: 11,
            isMain: true
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
})
Ext.define('CGP.product.model.compositeModelTreeModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'code',
        type: 'string'
    }]
});
