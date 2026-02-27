/**
 * TaxProductCategory
 * @Author: miao
 * @Date: 2021/11/8
 */
Ext.define('CGP.tax.model.TaxProductCategory', {
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
            name: 'tax',
            type: 'object'
        },
        {
            name: 'existsAreaCategoryTax',
            type: 'boolean'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/tax/productcategorys',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
