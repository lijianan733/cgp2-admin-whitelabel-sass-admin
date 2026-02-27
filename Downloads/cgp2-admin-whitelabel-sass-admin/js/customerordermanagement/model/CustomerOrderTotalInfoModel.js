/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.model.CustomerOrderTotalInfoModel', {
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
            name: 'currency',//货币
            type: 'object',
        },
        {
            name: 'noCurrency',
            type: 'boolean'
        },
        {
            name: 'codeSymbol',//code符号
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('currency'),
                    result = '';
                if (currency) {
                    var {code, symbolLeft} = currency;
                    result = `${code}${symbolLeft}`;
                }
                return result;
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
            name: 'title',
            type: 'string'
        },
        {
            name: 'retailPrice',
            type: 'string'
        },
        {
            name: 'billPrice',
            type: 'string'
        }
    ],
})