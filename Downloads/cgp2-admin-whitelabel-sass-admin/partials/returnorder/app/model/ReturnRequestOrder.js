/**
 * ReturnRequestOrder
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.model.ReturnRequestOrder', {
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
            name: 'orderItem',
            type: 'object'
        },
        {
            name: 'returnRequestOrderNo',
            type: 'string'
        },
        {
            name: 'reason',
            type: 'object'
        },
        {
            name: 'qty',
            type: 'number'
        },
        {
            name: 'applyDate',
            type: 'number',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return null;
                } else {
                    return new Date(value)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name:'currentState',
            type:'object'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'photos',
            type: 'array'
        },
        {
            name: 'orderNo',
            type: 'string'
        },
        {
            name: 'thumbnail',
            type: 'string'
        },
        {
            name: 'lineItemQty',
            type: 'number'
        },
        {
            name: 'sku',
            type: 'string'
        },
        {
            name: 'productName',
            type: 'string'
        },
        {
            name: 'user',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/returnRequestOrders',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
