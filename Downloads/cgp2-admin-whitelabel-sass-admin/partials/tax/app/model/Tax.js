/**
 * Tax
 * @Author: C-1316
 * @Date: 2021/11/2
 */
Ext.define('CGP.tax.model.Tax', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'area',
            type: 'object'
        },
        {
            name: 'base',
            type: 'string'
        },
        {
            name: 'addToProductPrice',
            type: 'boolean'
        },
        {
            name:'rootAreaTax',
            type:'object'
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/tax',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
