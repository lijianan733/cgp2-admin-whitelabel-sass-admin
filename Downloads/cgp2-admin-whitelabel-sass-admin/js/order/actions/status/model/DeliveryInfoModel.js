/**
 * Created by nan on 2018/5/23.
 */
Ext.define('CGP.order.actions.status.model.DeliveryInfoModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'cost',
            type: 'string'
        },
        {
            name: 'deliveryDate',
            type : 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'deliveryNo',
            type: 'string'
        },
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }
        },
        {
            name: 'orderNumber',
            type: 'string'
        },
        {
            name: 'shippingMethodCode',
            type: 'string'
        },
        {
            name: 'shippingMethodName',
            type: 'string'
        },
        {
            name: 'weight',
            type: 'int'
        }
    ]
})