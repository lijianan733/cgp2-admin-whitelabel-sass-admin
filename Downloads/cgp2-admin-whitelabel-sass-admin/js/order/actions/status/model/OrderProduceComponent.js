Ext.define('Order.status.model.OrderProduceComponent', {
    extend: 'Ext.data.Model',
    fields: [
        {
        name: 'seqNo',
        type: 'int'
    }, {
        name: 'orderItemId',
        type: 'int'
    }, {
        name: 'productName',
        type: 'string'
    }, {
        name: 'productId',
        type: 'int'
    }, {
        name: 'produceComponentInfos',
        type: 'object'
    },{
        name: 'materialId',
        type: 'string'
    }]
});