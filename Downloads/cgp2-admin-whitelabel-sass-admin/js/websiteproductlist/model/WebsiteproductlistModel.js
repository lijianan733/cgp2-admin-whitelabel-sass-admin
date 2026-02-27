/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.define('CGP.websiteproductlist.model.WebsiteproductlistModel', {
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
            name: 'mode',
            type: 'string'
        },
        {
            name: 'diyName',
            type: 'string',
            convert: function (data, record) {
                var result = record.get('name') + '<' + record.get('id') + '>';
                return result;
            }
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
            type: 'string',
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
        },
        {
            name: 'createdDate',
            type: 'number'
        },{
            name: 'priceRules',
            type: 'array'
        }, {
            name: 'relatedProducts',
            type: 'array'
        }, {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }
        }, {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'productDefaultSettingForStore',
            type: 'object'
        },
        {
            name: 'settingId',
            type: 'boolean',
            convert: function (value, record) {
                var productDefaultSettingForStore = record.get('productDefaultSettingForStore');

                return productDefaultSettingForStore ? productDefaultSettingForStore['_id'] : '';
            }
        },
        {
            name: 'isActived',
            type: 'boolean',
            convert: function (value, record) {
                var productDefaultSettingForStore = record.get('productDefaultSettingForStore');

                return productDefaultSettingForStore ? productDefaultSettingForStore['isActived'] : false;
            }
        },
        {
            name: 'isRelease',
            type: 'boolean',
            convert: function (value, record) {
                var productDefaultSettingForStore = record.get('productDefaultSettingForStore');

                return productDefaultSettingForStore ? productDefaultSettingForStore['isRelease'] : false;
            }
        },
        {
            name: 'version',
            type: 'number',
            convert: function (value, record) {
                var productDefaultSettingForStore = record.get('productDefaultSettingForStore');

                return productDefaultSettingForStore ? productDefaultSettingForStore['version'] : 0;
            }
        },
    ],
})