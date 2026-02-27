/**
 * Created by admin on 2020/6/20.
 */
Ext.define("CGP.product.view.pricingStrategyv2.model.QtyTableArgument", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.pricing.configuration.QtyTableArgument"
        },
        {
            name: 'index',
            type: 'int'
        },
        {
            name: 'key',
            type: 'string'
        },
        {
            name: 'table',
            type: 'array',
            defaultValue: null
        },
        {
            name: 'description',
            type: 'string'
        }
    ]
});