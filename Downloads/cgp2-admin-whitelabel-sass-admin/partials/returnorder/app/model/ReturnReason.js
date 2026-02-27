/**
 * StateInstance
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.model.ReturnReason', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
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
            name: 'sort',
            type: 'number'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partner/returnRequests/reasons',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
