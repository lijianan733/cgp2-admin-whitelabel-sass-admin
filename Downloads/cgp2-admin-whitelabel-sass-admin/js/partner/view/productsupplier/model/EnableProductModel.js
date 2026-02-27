/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.define('partner.productSupplier.model.EnableProductModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        }, 'model', 'name', 'sku',
        'shortDescription', 'description1',
        'description2', 'description3', 'type',
        {
            name: 'mainProductCategory',
            type: 'object'
        },
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
            type: 'int'
        }, {
            name: 'skuAttributes',
            type: 'object'
        }, {
            name: 'mainCategory',
            type: 'object',
            convert: function (value,record) {
                var mainProductCategory = record.get('mainProductCategory');
                return mainProductCategory && mainProductCategory['name'] + '(' + mainProductCategory['id'] + ')';
            }
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
            name: 'builderType',
            type: 'string'
        }, {
            name: 'priceRules',
            type: 'array'
        }, {
            name: 'isSupportedCMS',
            type: 'string'
        }],
});
