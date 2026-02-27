/**
 * Created by nan on 2018/8/17.
 */
Ext.define('CGP.customer.model.AccessControl', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'catalogId',
            type: 'string'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'principleType',
            type: 'string'
        },
        {
            name: 'acpDTOs',
            type: 'array'
        }
    ],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/security/principle',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
