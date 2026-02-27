/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.model.RefundApplicationModel', {
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


        // 产品信息
        {
            name: 'currency',//货币
            type: 'object',
        },
        {
            name: 'codeSymbol',//code符号
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('currency');
                if (currency) {
                    var {code, symbolLeft} = currency;
                    return `${code}${symbolLeft}`;
                }
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
            name: 'orderNumber',
            type: 'string',
        },
        {
            name: 'totalAmount',
            type: 'string',
        },
        {
            name: 'productAmount',
            type: 'string',
        },
        {
            name: 'freightAmount',
            type: 'string',
        },
        {
            name: 'sellingAmount',
            type: 'string',
        },
    ],
})