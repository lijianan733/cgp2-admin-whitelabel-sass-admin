/**
 * Created by nan on 2021/4/7
 */
Ext.define('CGP.productset.model.ProductScopeModel', {
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
            name: 'setItem',
            type: 'object'
        }, {
            name: 'products',
            type: 'array'
        }, {
            name: 'mainCategory',
            type: 'object'
        }, {
            name: 'clazz',
            type: 'string'
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productscopes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
