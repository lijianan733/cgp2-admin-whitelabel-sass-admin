/**
 * @Description: 付款状态
 * @author nan
 * @date 2024/3/25
 */
Ext.define('CGP.orderitemsmultipleaddress.model.PayInfoModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        },
        {
            name: 'method',
            type: 'string',
        },
        {
            name: 'amountDisplay',
            type: 'string'
        },
        {
            name: 'amount',
            type: 'object'
        },
        {
            name: 'status',
            type: 'string',
            convert: function (value) {
                /**
                 * （1）付款状态：成功     （SUCCESS）
                 * （2）付款状态：失败     （FAILURE）
                 * （3）付款状态：取消     （CANCELED）
                 * （4）付款状态：处理中  (PROCESSING)
                 */
                var obj = {
                    SUCCESS: '<font color="green">成功</font>',
                    FAILURE: '<font color="red">失败</font>',
                    CANCELED: '<font color="orange">取消</font>',
                    PROCESSING: '<font color="green">处理中</font>'
                };
                return obj[value]
            }
        },
        //付款类型
        {
            name: 'type',
            type: 'string',
            convert: function (value) {
                /**
                 * （1）PAYMENT：结账
                 *  REFUND:退款
                 */
                var obj = {
                    PAYMENT: '结账',
                    REFUND: '退款'
                };
                return obj[value]
            }

        },
        //流水号
        {
            name: 'transactionId',
            type: 'string',
            defaultValue: '无'
        },
        {
            name: 'paidDate',
            type: 'string',
            convert: function (value) {
                //转时间戳
                if (value) {
                    var date = new Date(value);
                    return date.toLocaleString();
                } else {
                    return '无'
                }
            }
        },
        {
            name: 'errors',
            type: 'array',
        },
        //是否显示更多
        {
            name: 'isShowMore',
            type: 'boolean'
        }
    ],
})
