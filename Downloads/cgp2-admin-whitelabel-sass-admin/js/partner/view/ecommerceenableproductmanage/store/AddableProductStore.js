/**
 * Created by nan on 2018/7/23.
 *
 */
Ext.define("CGP.partner.view.ecommerceenableproductmanage.store.AddableProductStore", {
    extend: 'Ext.data.Store',
    pageSize: 25,
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
            type: 'int'
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
            type: 'int'
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
            name: 'isSupportedCMS',
            type: 'string'
        }
    ],
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/salers/{salerId}/productConfigs/canBeAdd',
        reader: {
            type: 'json',
            root: "data.content"
        }
    },
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/salers/' + config.partnerId + '/productConfigs/canBeAdd'
        me.callParent(arguments);
    }
});

