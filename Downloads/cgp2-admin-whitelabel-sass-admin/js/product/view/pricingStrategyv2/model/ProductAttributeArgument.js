/**
 * Created by admin on 2020/6/20.
 */
Ext.define("CGP.product.view.pricingStrategyv2.model.ProductAttributeArgument", {
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
            name: 'index',
            type: 'int'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.pricing.configuration.ProductAttributeArgument"
        },
        {
            name: 'key',
            type: 'string'
        },
        {
            name: 'attributeId',
            type: 'int'
        },
        {
            name: 'description',
            type: 'string'
        }
    ]
});