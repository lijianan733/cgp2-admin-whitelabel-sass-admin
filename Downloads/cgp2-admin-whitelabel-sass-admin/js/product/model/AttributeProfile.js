/**
 * Created by admin on 2019/12/12.
 */
Ext.define("CGP.product.model.AttributeProfile", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        'name', 'clazz',
        {
            name: 'sort',
            type: 'int'
        },
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'groups',
            type: 'array'
        }
    ]
});
