/**
 * Created by admin on 2020/3/31.
 */
Ext.define("CGP.product.view.pricingStrategyv2.model.LocalArgument", {
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
            type: 'string'
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
            name: 'attributeId',
            type: 'int'
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