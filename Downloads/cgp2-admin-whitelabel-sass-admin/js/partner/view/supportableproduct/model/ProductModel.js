/**
 * Created by nan on 2018/4/28.
 */
Ext.define('CGP.partner.view.supportableproduct.model.ProductModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        'model',
        'name',
        'sku',
        'shortDescription',
        'description1',
        'description2',
        'description3',
        'type',
        {
            name: 'status',
            type: 'int'
        },
        {
            name: 'dateAvailable',
            type: 'date',
            dateWriteFormat: 'Uu',
            convert: function (value) {
                return new Date(value);
            }
        },
        {
            name: 'salePrice',
            type: 'float'
        },
        {
            name: 'weight',
            type: 'float'
        },
        {
            name: 'moq',
            type: 'int'
        },
        {
            name: 'invisible',
            type: 'boolean'
        },
        {
            name: 'template',
            type: 'object'
        },
        {
            name: 'medias',
            type: 'array'
        },
        {
            name: 'attributeValues',
            type: 'array'
        },
        {
            name: 'configurableProductId',
            type: 'int',
            useNull: true
        },
        {
            name: 'skuAttributes',
            type: 'object'
        },
        {
            name: 'mainCategory',
            type: 'object'
        },
        {
            name: 'subCategories',
            type: 'array'
        },
        {
            name: 'customAttributes',
            type: 'array'
        },
        {
            name: 'paibanTypeId',
            type: 'int',
            useNull: true
        },
        {
            name: 'compositeId',
            type: 'string'
        },
        {
            name: 'builderType',
            type: 'string'
        },
        {
            name: 'priceRules',
            type: 'array'
        },
        {
            name: 'relatedProducts',
            type: 'array'
        },
        {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }
        }
    ]
})