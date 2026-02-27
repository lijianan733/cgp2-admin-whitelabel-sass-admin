/**
 * Created by nan on 2021/4/7
 */
Ext.define('CGP.productset.model.ProductSetTreeNodeModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        }, {
            name: 'description',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'id',
            type: 'string',
            convert: function (value, record) {
                return value || record.get('_id');
            }
        }
    ]
})
