/**
 * currency model
 */
Ext.define('CGP.currency.model.Currency', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true,
    }, {
        name: 'title',
        type: 'string',
    }, {
        name: 'code', // 货币代码
        type: 'string',
    }, {
        name: 'symbolLeft', //用户密码
        type: 'string',
    }, {
        name: 'symbolRight', // 昵称
        type: 'string',
    }, {
        name: 'decimalPoint', // 小数点
        type: 'string',
    }, {
        name: 'decimalPlaces', // 小数点
        type: 'string',
    }, {
        name: 'thousandsPoint', //千分数
        type: 'string',
    }, {
        name: 'value',   //与默认货币的兑换比率
        type: 'float',
    }, {
        name: 'website', //网站id
        type: 'object',
    }, {
        name: 'displayName',
        type: 'string',
        convert: function (value, record) {
            return record.get('code') + '<' + record.getId() + '>'
        }
    }, {
        name: 'displayNameV2',
        type: 'string',
        convert: function (value, record) {
            var code = record.get('code'),
                title = record.get('title');

            return `${title} <${code}>`
        }
    }],
    /**
     * @cfg {Ext.data.Proxy} proxy
     * model proxy
     */
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/currencies',
        reader: {
            type: 'json',
            root: 'data',
        },
    },
});