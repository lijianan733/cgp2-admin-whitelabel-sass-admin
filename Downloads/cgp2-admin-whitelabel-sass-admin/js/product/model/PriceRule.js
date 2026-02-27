Ext.define('CGP.product.model.PriceRule', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: 'true'
        },
        {
            name: 'qtyFrom',
            type: 'int'
        },
        {
            name: 'qtyTo',
            type: 'int'
        },
        {
            name: 'price',
            type: 'float'
        }
    ]
})