/**
 * Created by nan on 2021/4/7
 */
Ext.define('CGP.productset.model.ProductSetItemModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'qty',
            type: 'number'
        }, {
            name: 'skuProduct',
            type: 'object'

        }, {
            name: 'qtyRange',
            type: 'object'

        }, {
            name: 'itemRange',
            type: 'object'

        },
        {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'productSet',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productsetitems',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
