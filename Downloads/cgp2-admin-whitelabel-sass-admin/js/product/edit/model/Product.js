Ext.define('CGP.product.edit.model.Product', {
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
            name: 'multilingualKey',
            type: 'string',
            serialize: function (value, record) {
                var type = record.get('type');
                if (type == 'Configurable') {
                    return 'com.qpp.cgp.domain.product.ConfigurableProduct';
                } else {
                    return 'com.qpp.cgp.domain.product.SkuProduct';
                }
            }

        }, {
            name: 'bindProductId',
            type: 'int',
            useNull: true
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
            type: 'int'
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
        }, {
            name: 'relatedProducts',
            type: 'array'
        }, {
            //最低价格
            name: 'lowestPrice',
            type: 'number',
            useNull: true,
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products",
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})