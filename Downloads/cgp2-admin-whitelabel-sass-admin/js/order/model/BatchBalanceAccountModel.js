/**
 * Created by nan on 2018/3/1.
 */
Ext.define('CGP.order.model.BatchBalanceAccountModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'isTest',
            type: 'boolean'
        },
        {
            name: 'orderNumber',
            type: 'string'
        },
        {
            name: 'partner',
            type: 'object'
        },
        {
            name: 'status',
            type: 'object'
        },
        {
            name: 'extraParam',
            type: 'object'
        },
        {
            name: 'deliveryNo',
            type: 'string'
        },
        {
            name: 'bindOrderNumbers',
            type: 'array'
        },
        {
            name: 'producePartner',
            type: 'object',
            defaultValue:undefined
        },
        {
            name: 'datePurchased',
            type: 'date',
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
            name: 'deliveryDate',
            type: 'date',
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
            name: 'receivedDate',
            type: 'date',
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
            name: 'settlementDate',
            type: 'date',
            convert: function (value,record) {
                value= record.get('receivedDate');
                if (Ext.isEmpty(value)) {
                    return null;
                } else {
                    var beforeDate=new Date(value);
                    var afterDate= Date.parse(beforeDate)+(24 * 60 * 60 * 1000 * 8);//可结算日期加8
                    return new Date(afterDate)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        }

    ]
})