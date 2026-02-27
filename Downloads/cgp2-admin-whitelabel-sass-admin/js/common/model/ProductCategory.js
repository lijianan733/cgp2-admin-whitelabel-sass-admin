/**
 * Created by nan on 2019/4/18.
 */
Ext.define('CGP.common.model.ProductCategory', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'productsInfo',
        type: 'object'
    }, {
        name: 'displayName',
        type: 'string',
        convert: function (value, record) {
            return record.raw.name + '(' + record.raw.id + ')';

        }
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
