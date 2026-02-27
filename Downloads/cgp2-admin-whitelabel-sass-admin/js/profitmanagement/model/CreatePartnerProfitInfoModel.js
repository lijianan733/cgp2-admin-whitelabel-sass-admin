/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.model.CreatePartnerProfitInfoModel', {
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
            name: 'type',
            type: 'string',
        },
        {
            name: 'typeText',
            type: 'string',
            convert: function (value, record) {
                var type = record.get('type'),
                    typeGather = {
                        OUT: {
                            color: 'blue',
                            text: '支出'
                        },
                        IN: {
                            color: 'green',
                            text: '收入'
                        },
                        REBALANCE: {
                            color: 'orange',
                            text: '平衡'
                        }
                    },
                    {color, text} = typeGather[type];

                return JSCreateFont(color, true, text);
            }
        },
        {
            name: 'balance',
            type: 'number',
        },
        {
            name: 'isProfitText',
            type: 'string',
            convert: function (value, record) {
                var amount = record.get('balance'),
                    result = JSCreateFont('green', false, '+', 15)
                if (amount) {
                    var isProfit = amount > 0,
                        isProfitGather = {
                            true: {
                                color: 'green',
                                text: '+'
                            },
                            false: {
                                color: 'red',
                                text: '-'
                            }
                        },
                        {color, text} = isProfitGather[isProfit];

                    result = JSCreateFont(color, false, text, 15)
                }

                return result;
            }
        },
        {
            name: 'amount',
            type: 'number',
        },
        {
            name: 'operateDate',
            type: 'number',
        },


        {
            name: 'operateCurrencyCode',
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('operateCurrency');
                return currency.code;
            }
        },
        {
            name: 'balanceCurrencyCode',
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('balanceCurrency');
                return currency.code;
            }
        },
        {
            name: 'operateCurrencySymbol',
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('operateCurrency');
                return currency.symbolLeft;
            }
        },
        {
            name: 'balanceCurrencySymbol',
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('balanceCurrency');
                return currency.symbolLeft;
            }
        },


        {
            name: 'moneyText',
            type: 'string',
            convert: function (value, record) {
                var balance = record.get('balance'),
                    isProfitText = record.get('isProfitText'),
                    balanceCurrencyCode = record.get('balanceCurrencyCode'),
                    balanceCurrencySymbol = record.get('balanceCurrencySymbol'),
                    color = balance >= 0 ? 'green' : 'red';

                if (balance) {
                    balance = balance.toFixed(2);
                }
                return `${balanceCurrencySymbol} ${JSCreateFont(color, true, balance)}`;
            }
        },
        {
            name: 'nowMoneyText',
            type: 'string',
            convert: function (value, record) {
                var amount = record.get('amount'),
                    isProfitText = record.get('isProfitText'),
                    operateCurrencyCode = record.get('operateCurrencyCode'),
                    operateCurrencySymbol = record.get('operateCurrencySymbol');
                if (amount) {
                    amount = Math.abs(amount).toFixed(2);
                }
                return `${operateCurrencySymbol} ${amount}`;
            }
        },
        {
            name: 'operateCurrency',
            type: 'object',
        },
        {
            name: 'balanceCurrency',
            type: 'object',
        },
        {
            name: 'description',
            type: 'string',
        },
        {
            name: 'remark',
            type: 'string',
        },
        {
            name: 'innerRemark',
            type: 'string',
        },

        {
            name: 'deductionOfFeeAmount', //扣除手续费后金额
            type: 'string',
            convert: function (value, record) {
                var balance = record.get('balance'),
                    balanceCurrencySymbol = record.get('balanceCurrencySymbol'),
                    serviceChargeAmount = balance * 0.03,
                    deductionOfFeeAmount = balance - serviceChargeAmount;

                if (deductionOfFeeAmount) {
                    deductionOfFeeAmount = deductionOfFeeAmount.toFixed(2);
                }

                return `${balanceCurrencySymbol} ${deductionOfFeeAmount}`;
            }
        }
    ],
})