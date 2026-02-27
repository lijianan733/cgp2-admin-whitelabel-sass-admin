/**
 * @author nan
 * @date 2026/1/26
 * @description TODO
 */
Ext.define('CGP.partner_bill.model.PartnerBillModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        {
            name: '_id',
            type: 'clazz',
            useNull: true
        },
        //账单金额
        {
            name: 'billAmount',
            type: 'string'
        },
        //账单金额(带货币信息) ,
        {
            name: 'billAmountStr',
            type: 'string',
        },
        //账单创建时间
        {
            name: 'billCreatedDate',
            type: 'string'
        },
        //账单货币
        {
            name: 'billCurrencyCode',
            type: 'string'
        },
        //下单日期
        {
            name: 'datePurchased',
            type: 'string'
        },
        //还款最晚期限
        {
            name: 'dueDate',
            type: 'string'
        },
        //还款宽限期
        {
            name: 'gracePeriodDays',
            type: 'string'
        },
        // 最晚宽限时间
        {
            name: 'gracePeriodEndDate',
            type: 'string'
        },


        // 订单金额
        {
            name: 'orderAmount',
            type: 'string'
        },
        // 订单金额
        {
            name: 'orderAmountStr',
            type: 'string'
        },
        //订单金额货币
        {
            name: 'orderCurrencyCode',
            type: 'string'
        },
        // 订单号
        {
            name: 'orderNumber',
            type: 'string'
        },
        // 是否逾期
        {
            name: 'overdue',
            type: 'boolean'
        },
        // 是否已经付款
        {
            name: 'paid',
            type: 'boolean'
        },
        // 实际已支付金额
        {
            name: 'paidAmount',
            type: 'string'
        },
        // 付款时间
        {
            name: 'paymentTermDays',
            type: 'string'
        },
        // 是否已经出账
        {
            name: 'posted',
            type: 'boolean'
        },
        //签收日期
        {
            name: 'signDate',
            type: 'string'
        },
        {
            name: 'statusName',
            type: 'string'
        },
        {
            name: 'statusId',
            type: 'number'
        },
        //付款日期
        {
            name: 'paidDate',
            type: 'string'
        },
        //是否已取消
        {
            name: 'isCancel',
            type: 'boolean'
        },
        {
            name: 'paidAmountStr',
            type: 'string',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return '';
                } else {
                    return value;
                }
            }
        }, {
            name: 'partnerId',
            type: 'string'
        },
        {
            name: 'partnerName',
            type: 'string'
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + `api/partnerBills`,
        reader: {
            type: 'json',
            root: 'data'
        }
    },
});
