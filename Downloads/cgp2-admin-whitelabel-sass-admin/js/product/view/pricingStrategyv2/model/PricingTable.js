/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.product.view.pricingStrategyv2.model.PricingTable", {
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
            name: 'from',
            type: 'int',
            defaultValue: 1
        },
        {
            name: 'to',
            type: 'int',
            defaultValue: 1
        },
        {
            name: 'price',
            type: 'number',
            defaultValue: null
        },
        {
            name: 'description',
            type: 'string'
        }
    ]
});