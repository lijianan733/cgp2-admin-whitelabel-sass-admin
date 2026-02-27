/**
 * Created by nan on 2020/9/25.
 */
Ext.define('CGP.partner.view.enableproductmanage.model.PriceRuleModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: 'isProductRule',
            type: 'boolean'
        },
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
            name: 'filterSetting',
            type: 'object',
            defaultValue: null
        },
        {
            name: 'index',
            type: 'int'
        },
        {
            name: 'strategyType',
            type: 'string'
        },
        {
            name: 'isDefault',
            type: 'boolean'
        }
    ]
});

