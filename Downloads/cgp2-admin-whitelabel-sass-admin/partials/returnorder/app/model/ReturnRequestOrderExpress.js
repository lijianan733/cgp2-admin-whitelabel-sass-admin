/**
 * StateInstance
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.model.ReturnRequestOrderExpress', {
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
            name:'returnRequestOrder',
            type:'object'
        },
        {
            name: 'provider',
            type: 'string'
        },
        {
            name: 'number',
            type: 'string'
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
