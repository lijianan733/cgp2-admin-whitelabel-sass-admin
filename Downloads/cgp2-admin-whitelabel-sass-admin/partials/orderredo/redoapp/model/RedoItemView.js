/**
 * Created by admin on 2019/10/10.
 */
Ext.define('CGP.redodetails.model.RedoItemView', {
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
        'productName','sku',
        {
            name: 'qty',
            type: 'int',
            allowBlank:false
        },
        {
            name: 'originalqty',
            type: 'int'
        },{
            name: 'orderItemQty',
            type: 'int'
        },
        'materialPath','materialId','materialName','comment','bindOrderItemId','redoType'
    ]
});