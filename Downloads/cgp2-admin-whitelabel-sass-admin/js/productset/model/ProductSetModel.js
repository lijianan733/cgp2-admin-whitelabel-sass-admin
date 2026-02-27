/**
 * Created by nan on 2021/4/7
 */
Ext.define('CGP.productset.model.ProductSetModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'configurableProductSet',
            type: 'object'
        },//模式，(正式,测试)
        {
            name: 'mode',
            type: 'string'
        },
        {
            name: 'model',
            type: 'string'
        },
        {
            name: 'shortDescription',
            type: 'string'
        },
        'description1',
        'description2',
        'description3',
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
        }, {
            name: 'salePrice',
            type: 'string',
        }, {
            name: 'weight',
            type: 'number'
        }, {
            name: 'medias',
            type: 'array'
        }, {
            name: 'configurableProductId',
            type: 'int',
            useNull: true
        }, {
            name: 'subCategories',
            type: 'array'
        }, {
            name: 'clazz',
            type: 'string'
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productsets',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
