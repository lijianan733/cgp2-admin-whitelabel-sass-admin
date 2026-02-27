/**
 * @Description:
 * @author nan
 * @date 2024/8/23
 */
Ext.define('CGP.orderitemsmultipleaddress.model.OtherPayInfoModel', {
    extend: 'CGP.orderitemsmultipleaddress.model.PayInfoModel',
    fields: [
        //流水号
        {
            name: 'transactionIds',
            type: 'array'
        },
        //付款凭证
        {
            name: 'transactionVouchers',
            type: 'array'
        },
        //付款人信息
        {
            name: 'user',
            type: 'object',
        },
        {
            name: 'remark',
            type: 'string'
        },
        //其他货币付款金额
        {
            name: 'modifiedAmount',
            type: 'number'
        },
        //试用其他货币付款时间
        {
            name: 'modifiedTime',
            type: 'string',
            convert: function (value, record) {
                return value ? (Ext.Date.format(new Date(value), 'Y/m/d H:i')) : '';

            }
        },
        //实付货币
        {
            name: 'modifiedCurrency',
            type: 'string',
        },
        //实付金额，带货币符号
        {
            name: 'modifiedAmountStr',
            type: 'string'
        },
        //低于实付金额的原因
        {
            name: 'modifiedRemark',
            type: 'string',
        }
    ]
})