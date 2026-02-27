/**
 * Created by admin on 2020/2/26.
 */
Ext.define("CGP.product.view.pricingStrategyv2.model.LocalAdditionTable", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        'description',
        {
            name: 'index',
            type: 'int'
        },
        {
            name: 'condition',
            type: 'object'
        },
        {
            name: 'table',
            type: 'array'
        }
    ]
})