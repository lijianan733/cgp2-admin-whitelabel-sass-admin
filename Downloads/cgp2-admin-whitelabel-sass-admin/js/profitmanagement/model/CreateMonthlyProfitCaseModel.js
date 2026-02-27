/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.model.CreateMonthlyProfitCaseModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.color.RgbColor'
        },
        {
            name: 'partnerId',//partnerId
            type: 'number'
        },
        {
            name: 'partnerEmail',//partner邮箱
            type: 'string',
        },
        {
            name: 'amount',//盈余
            type: 'number',
        },
        {
            name: 'currency',//货币
            type: 'object',
        },
        {
            name: 'isSettled',//是否已结清
            type: 'boolean',
        },
        {
            name: 'waitTransferBalance',//待结算金额
            type: 'number',
        },
        {
            name: 'outTransferBalance',//当月转出金额
            type: 'number',
        },
        {
            name: 'inTransferBalance',//他月转入金额
            type: 'number',
        },
        {
            name: 'year',
            type: 'number'
        },
        {
            name: 'month',
            type: 'number'
        },
        {
            name: 'settleDate',//年月
            type: 'string',
            convert: function (value, record) {
                var year = record.get('year'),
                    month = record.get('month');
                return year + '-' + month;
            }
        },
        {
            name: 'symbolLeft',//符号
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('currency');

                return currency ? currency['symbolLeft'] : '';
            }
        },
        {
            name: 'currencyCode',//货币code
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('currency');

                return currency ? currency['code'] : '';
            }
        },

        {
            name: 'amountText',//总盈余
            type: 'string',
            convert: function (value, record) {
                var symbolLeft = record.get('symbolLeft'),
                    amount = +record.get('amount');
                if (amount){
                    amount = amount.toFixed(2);
                }
                return `${symbolLeft} ${amount}`;
            }
        },
        {
            name: 'transferBalanceText',//已结算金额
            type: 'string',
            convert: function (value, record) {
                var symbolLeft = record.get('symbolLeft'),
                    transferBalance = record.get('transferBalance');
                if (transferBalance){
                    transferBalance = transferBalance.toFixed(2);
                }
                return `${symbolLeft} ${transferBalance}`;
            }
        },
        {
            name: 'waitTransferBalanceText',//待结算金额
            type: 'string',
            convert: function (value, record) {
                var symbolLeft = record.get('symbolLeft'),
                    waitTransferBalance = record.get('waitTransferBalance');
                if (waitTransferBalance){
                    waitTransferBalance = waitTransferBalance.toFixed(2);
                }
                return `${symbolLeft} ${waitTransferBalance}`;
            }
        },
        {
            name: 'inTransferBalanceText',//他月转入金额
            type: 'string',
            convert: function (value, record) {
                var symbolLeft = record.get('symbolLeft'),
                    inTransferBalance = record.get('inTransferBalance');
                if (inTransferBalance){
                    inTransferBalance = inTransferBalance.toFixed(2);
                }
                return `${symbolLeft} ${inTransferBalance}`;
            }
        },
        {
            name: 'outTransferBalanceText',//当月转出金额
            type: 'string',
            convert: function (value, record) {
                var symbolLeft = record.get('symbolLeft'),
                    outTransferBalance = record.get('outTransferBalance');
                if (outTransferBalance){
                    outTransferBalance = outTransferBalance.toFixed(2);
                }
                return `${symbolLeft} ${outTransferBalance}`;
            }
        },
    ],
})