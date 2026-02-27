/**
 * Created by admin on 2020/2/26.
 */
Ext.define("CGP.product.view.pricingStrategyv2.model.SimplePricingSetting", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        'name', 'clazz', 'description',
        {
            name: 'mainTable',
            type: 'array'
        },

        {
            name: 'additionTable',
            type: 'array'
        }
    ]
})