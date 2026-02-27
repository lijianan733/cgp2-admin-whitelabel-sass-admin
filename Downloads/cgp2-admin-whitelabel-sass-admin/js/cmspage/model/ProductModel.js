Ext.define('CGP.cmspage.model.ProductModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
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
            type: 'float'
        }, {
            name: 'weight',
            type: 'float'
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
            type: 'int'
        }, {
            name: 'compositeId',
            type: 'string'
        },{
            name:'builderType',
            type: 'string'
        }, {
            name: 'priceRules',
            type: 'array'
        },{
            name: 'isSupportedCMS',
            type: 'string'
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
            website: 9,
            isMain: true
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})