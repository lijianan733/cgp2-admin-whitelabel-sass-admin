/**
 * Created by admin on 2020/2/26.
 */
Ext.define("CGP.product.view.pricingStrategyv2.model.PricingStrategy", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.pricing.configuration.ExpressionPricingConfig'
        },
        'description',
        {
            name: 'currency',
            type: 'string',
            defaultValue: 'USD'
        },
        {
            name: 'index',
            type: 'int'
        },
        {
            name: 'formula',
            type: 'object'
        },
        {
            name: 'setting',
            type: 'object'
        },
        {
            name: 'strategyType',
            type: 'string',
            persist: false,
            convert: function (v, record) {
                return record.data.setting ? record.data.setting.clazz : "";
            }
        },
        {
            name: 'table',
            type: 'array',
            persist: false,
            convert: function (v, record) {
                if (record.data.setting) {
                    return record.data.setting.table || record.data.setting.mainTable;
                } else {
                    return [];
                }
            }
        },
        {
            name: 'additionTable',
            type: 'array',
            persist: false,
            convert: function (v, record) {
                return record.data.setting ? record.data.setting.additionTable : [];
            }
        },
        {
            name: 'expression',
            type: 'string',
            persist: false,
            convert: function (v, record) {
                return record.data.setting ? record.data.setting.expression : '';
            }
        },
        {
            name: 'args',
            type: 'array',
            persist: false,
            convert: function (v, record) {
                return record.data.setting ? record.data.setting.args : [];
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pricingstrategies',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})