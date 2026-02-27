/**
 * CategoryProduct
 * @Author: miao
 * @Date: 2021/11/8
 */
Ext.define('CGP.tax.model.CategoryProduct', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'

        }
        ,
        {
            name: 'model',
            type: 'string'

        }
        ,
        {
            name: 'sku',
            type: 'string'

        },
        {
            name: 'type',
            type: 'string'

        }
    ]
});
