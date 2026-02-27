/**
 * AreaTax
 * @Author: miao
 * @Date: 2021/11/4
 */
Ext.define('CGP.tax.model.AreaTax', {
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
            name: 'description',
            type: 'string'
        },
        {
            name: 'area',
            type: 'object'
        },
        {
            name: 'sourceArea',
            type: 'object'
        },
        {
            name: 'rate',
            type: 'number',
            defaultValue: null
        },
        {
            name: 'additionalAmount',
            type: 'number',
            defaultValue: null
        },
        {
            name: 'amountThreshold',
            type: 'number'
        },
        {
            name: 'tax',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/areatax',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
