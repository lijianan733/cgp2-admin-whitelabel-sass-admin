/**
 * Created by admin on 2019/9/26.
 */
Ext.define('CGP.redodetails.model.RedoLineItems', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'originalOrderItemId',
            type: 'string'
        },
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'qty',
            type: 'int'
        },
        'materialPath','comment','bindOrderItemId'
    ]
});