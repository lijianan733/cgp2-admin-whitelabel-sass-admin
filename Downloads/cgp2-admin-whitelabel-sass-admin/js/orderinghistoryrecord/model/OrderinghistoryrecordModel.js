/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.define('CGP.orderinghistoryrecord.model.OrderinghistoryrecordModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'partner',
            type: 'object'
        },
        {
            name: 'partnerCode',
            type: 'string',
            convert: function (value, record) {
                var partner = record.get('partner'),
                    result = null;
                if (partner) {
                    result = partner['code'];
                }
                return result
            },
        },
        {
            name: 'submitTime',
            type: 'string',
        },
        {
            name: 'bulkOrderType',
            type: 'string',
        },
        {
            name: 'operatorEmail',
            type: 'string'
        },
        {
            name: 'orders',
            type: 'array',
        },
        {
            name: 'failureInfo',
            type: 'object'
        },
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/bulkOrderSubmitRecord',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})