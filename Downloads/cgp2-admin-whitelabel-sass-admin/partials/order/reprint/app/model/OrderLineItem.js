Ext.define('CGP.orderreprint.model.OrderLineItem', {
    extend: 'Ext.data.Model',

    fields: [
            'seqNo', 'productName', 'productModel', 'productSku',
             'projectId', 'projectImg', 'imageUrl', 'description',
        {
            name: 'qty',
            type: 'int'
        }]

})