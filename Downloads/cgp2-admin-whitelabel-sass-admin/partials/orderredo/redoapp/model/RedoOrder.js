/**
 * Created by admin on 2019/9/26.
 */
Ext.define('CGP.redodetails.model.RedoOrder', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        'bindOrderNumber','originalOrderNumber',
        {
            name: 'lineItems',
            type: 'array'
        },
        {
            name: 'deliveryAddress',
            type: 'object'
        }
    ]
});