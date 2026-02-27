/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.model.CreateQpmnProfitCheckModel', {
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
            name: 'year',
            type: 'number'
        },
        {
            name: 'month',
            type: 'number'
        },
        {
            name: 'settleDate',
            type: 'string'
        },
        {
            name: 'settleDate2',
            type: 'string',
            convert: function (value, record) {
                var year = record.get('year'),
                    month = record.get('month');
                if (month < 10) {
                    month = `0${month}`;
                }
                return year + ' - ' + month;
            }
        },
        {
            name: 'finish', //是否已结清
            type: 'boolean',
        },
        {
            name: 'amount',//总盈余
            type: 'number',
        },
        {
            name: 'transferBalance',//已结算金额
            type: 'number',
        },
        {
            name: 'waitTransferBalance',//待结算金额
            type: 'number',
        },
        {
            name: 'inTransferBalance',//他月转入金额
            type: 'number',
        },
        {
            name: 'outTransferBalance',//当月转出金额
            type: 'number',
        },
        {
            name: 'currency',//货币
            type: 'object',
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
                if (amount) {
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
                if (transferBalance) {
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
                if (waitTransferBalance) {
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
                if (inTransferBalance) {
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
                if (outTransferBalance) {
                    outTransferBalance = outTransferBalance.toFixed(2);
                }
                return `${symbolLeft} ${outTransferBalance}`;
            }
        },

        {
            name: 'settlePartnerCount',//已结算合伙人数
            type: 'number',
        },
        {
            name: 'waitSettlePartnerCount',//未结算合伙人数
            type: 'number',
        },
        {
            name: 'squaredPartner',//结算人数
            type: 'string',
            convert: function (value, record) {
                var settlePartnerCount = record.get('settlePartnerCount'),
                    waitSettlePartnerCount = record.get('waitSettlePartnerCount');

                return `${settlePartnerCount}/${waitSettlePartnerCount + settlePartnerCount}`;
            }
        }
    ],
})