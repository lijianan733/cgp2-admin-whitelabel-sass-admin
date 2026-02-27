/**
 * Created by admin on 2020/2/26.
 */
Ext.define("CGP.product.view.pricingStrategyv2.model.LocalPricingStrategy", {
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
})