/**
 * Created by nan on 2018/3/28.
 */
Ext.define('CGP.order.model.EnableSupplierModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'contactor',
            type: 'string'
        },
        {
            name: 'cooperationBusinesses',
            type: 'object'
        },
        {
            name: 'cooperationType',
            type: 'object'
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'logoUrl',
            type: 'string'
        },
        {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }
        },
        {
            name: 'name',
            type: 'string'
        }
        ,
        {
            name: 'telephone',
            type: 'string'
        },
        {
            name: 'website',
            type: 'object'
        }
    ]
})